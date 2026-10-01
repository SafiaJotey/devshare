import { ObjectId } from "mongodb";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { getUserCollection } from "./user.model";
import { getBlogCollection } from "../blog/blog.model";
import {
  IChangePasswordPayload,
  ILoginUserPayload,
  IRegisterUserPayload,
  ISocialLoginPayload,
  IUser,
  IUserResponse,
} from "./user.interface";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  hashToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { NotificationService } from "../notification/notification.service";

// Helper to strip password and refreshTokens from user object
const sanitizeUser = (user: IUser): IUserResponse => {
  const { password, refreshTokens, ...sanitized } = user;
  return sanitized;
};

const registerUser = async (
  payload: IRegisterUserPayload
): Promise<{ user: IUserResponse; accessToken: string; refreshToken: string }> => {
  const collection = getUserCollection();
  const normalizedEmail = payload.email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = await collection.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      "An account with this email address already exists"
    );
  }

  // Hash password
  const hashedPassword = await hashPassword(payload.password);

  const newUser: IUser = {
    name: payload.name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "user",
    avatar:
      payload.avatar ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        payload.name
      )}`,
    title: payload.title || "Developer & Contributor",
    bio: payload.bio || "",
    primaryDomain: "Frontend",
    skills: [],
    socialLinks: {},
    preferences: {
      defaultCategory: "Frontend",
      codeFont: "jetbrains",
      autoSave: true,
      emailOnComment: true,
      emailOnLike: true,
      weeklyDigest: true,
      showInLeaderboard: true,
      publicEmail: false,
    },
    refreshTokens: [],
    isActive: true,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(newUser);
  newUser._id = result.insertedId;

  const jwtPayload = {
    id: newUser._id.toString(),
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
  };

  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);

  // Store hashed refresh token in DB
  const hashedRefreshToken = hashToken(refreshToken);
  await collection.updateOne(
    { _id: newUser._id },
    { $push: { refreshTokens: hashedRefreshToken } }
  );

  return {
    user: sanitizeUser(newUser),
    accessToken,
    refreshToken,
  };
};

const loginUser = async (
  payload: ILoginUserPayload
): Promise<{ user: IUserResponse; accessToken: string; refreshToken: string }> => {
  const collection = getUserCollection();
  const normalizedEmail = payload.email.trim().toLowerCase();

  const user = await collection.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password credentials"
    );
  }

  if (user.isActive === false) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been deactivated. Please contact support."
    );
  }

  if (!user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This account was created with ${user.provider || "social login"}. Please sign in using your social account.`
    );
  }

  const isPasswordMatch = await comparePassword(payload.password, user.password);

  if (!isPasswordMatch) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password credentials"
    );
  }

  const jwtPayload = {
    id: user._id!.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);
  const hashedRefreshToken = hashToken(refreshToken);

  // Limit stored refresh tokens to 5 active sessions max, append newest
  await collection.updateOne(
    { _id: user._id },
    {
      $set: { lastLoginAt: new Date(), updatedAt: new Date() },
      $push: {
        refreshTokens: {
          $each: [hashedRefreshToken],
          $slice: -5, // keep at most the last 5 sessions
        },
      },
    }
  );

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

const socialLoginUser = async (
  payload: ISocialLoginPayload
): Promise<{
  user: IUserResponse;
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}> => {
  const collection = getUserCollection();
  const normalizedEmail = payload.email.trim().toLowerCase();

  const existingUser = await collection.findOne({ email: normalizedEmail });
  let targetUser: IUser;
  let isNewUser = false;

  if (existingUser) {
    if (existingUser.isActive === false) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Your account has been deactivated. Please contact support."
      );
    }

    const updateFields: Partial<IUser> = {
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    };

    if (payload.avatar && (!existingUser.avatar || existingUser.avatar.includes("dicebear"))) {
      updateFields.avatar = payload.avatar;
    }
    if (!existingUser.provider) {
      updateFields.provider = payload.provider;
    }

    await collection.updateOne({ _id: existingUser._id }, { $set: updateFields });
    targetUser = { ...existingUser, ...updateFields };
  } else {
    isNewUser = true;
    const newUser: IUser = {
      name: payload.name.trim() || "Developer",
      email: normalizedEmail,
      role: "user",
      avatar:
        payload.avatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          payload.name || "Dev"
        )}`,
      title: "Developer & Contributor",
      bio: "",
      primaryDomain: "Frontend",
      skills: [],
      socialLinks: {},
      preferences: {
        defaultCategory: "Frontend",
        codeFont: "jetbrains",
        autoSave: true,
        emailOnComment: true,
        emailOnLike: true,
        weeklyDigest: true,
        showInLeaderboard: true,
        publicEmail: false,
      },
      provider: payload.provider,
      refreshTokens: [],
      isActive: true,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newUser);
    targetUser = { ...newUser, _id: result.insertedId };
  }

  const jwtPayload = {
    id: targetUser._id!.toString(),
    email: targetUser.email,
    name: targetUser.name,
    role: targetUser.role,
  };

  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);
  const hashedRefreshToken = hashToken(refreshToken);

  await collection.updateOne(
    { _id: targetUser._id },
    {
      $set: { lastLoginAt: new Date(), updatedAt: new Date() },
      $push: {
        refreshTokens: {
          $each: [hashedRefreshToken],
          $slice: -5,
        },
      },
    }
  );

  return {
    user: sanitizeUser(targetUser),
    accessToken,
    refreshToken,
    isNewUser,
  };
};

const refreshAccessToken = async (
  incomingRefreshToken: string
): Promise<{ accessToken: string; newRefreshToken: string; user: IUserResponse }> => {
  if (!incomingRefreshToken) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Refresh token is required"
    );
  }

  // Verify token signature & expiry
  const decoded = verifyRefreshToken(incomingRefreshToken);
  const collection = getUserCollection();

  if (!ObjectId.isValid(decoded.id)) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token payload");
  }

  const hashedIncoming = hashToken(incomingRefreshToken);

  // Find user that holds this hashed refresh token
  const user = await collection.findOne({
    _id: new ObjectId(decoded.id),
    refreshTokens: hashedIncoming,
  });

  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid or revoked session. Please log in again."
    );
  }

  if (user.isActive === false) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been deactivated. Please contact support."
    );
  }

  // Rotate token: Issue new access & refresh tokens
  const jwtPayload = {
    id: user._id!.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const newAccessToken = generateAccessToken(jwtPayload);
  const newRefreshToken = generateRefreshToken(jwtPayload);
  const hashedNew = hashToken(newRefreshToken);

  // Replace old refresh token with new one in user's refreshTokens array
  await collection.updateOne(
    { _id: user._id },
    {
      $pull: { refreshTokens: hashedIncoming },
    }
  );

  await collection.updateOne(
    { _id: user._id },
    {
      $push: {
        refreshTokens: {
          $each: [hashedNew],
          $slice: -5,
        },
      },
      $set: { updatedAt: new Date() },
    }
  );

  return {
    accessToken: newAccessToken,
    newRefreshToken,
    user: sanitizeUser(user),
  };
};

const logoutUser = async (userId?: string, incomingRefreshToken?: string): Promise<void> => {
  if (!userId && !incomingRefreshToken) return;

  const collection = getUserCollection();

  if (incomingRefreshToken) {
    const hashed = hashToken(incomingRefreshToken);
    await collection.updateOne(
      { refreshTokens: hashed },
      { $pull: { refreshTokens: hashed } }
    );
  } else if (userId && ObjectId.isValid(userId)) {
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { refreshTokens: [] } }
    );
  }
};

const changePassword = async (
  userId: string,
  payload: IChangePasswordPayload
): Promise<void> => {
  if (!ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user identifier");
  }

  const collection = getUserCollection();
  const user = await collection.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User profile not found");
  }

  if (!user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This account was created using social login and does not have a password set."
    );
  }

  const isCurrentMatch = await comparePassword(payload.currentPassword, user.password);
  if (!isCurrentMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect current password");
  }

  const isSame = await comparePassword(payload.newPassword, user.password);
  if (isSame) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password cannot be identical to the current password"
    );
  }

  const hashedPassword = await hashPassword(payload.newPassword);

  // Invalidate all existing sessions on password change for security
  await collection.updateOne(
    { _id: user._id },
    {
      $set: {
        password: hashedPassword,
        refreshTokens: [],
        updatedAt: new Date(),
      },
    }
  );
};

const getMe = async (userId: string): Promise<IUserResponse> => {
  const collection = getUserCollection();

  if (!ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user identifier");
  }

  const user = await collection.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User profile not found");
  }

  return sanitizeUser(user);
};

const updateProfile = async (
  userId: string,
  payload: Partial<IUser>
): Promise<IUserResponse> => {
  const collection = getUserCollection();

  if (!ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user identifier");
  }

  // Prevent modifying critical fields via profile update
  const { _id, email, password, role, refreshTokens, isActive, createdAt, ...allowedUpdates } =
    payload as any;

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $set: {
        ...allowedUpdates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User profile not found");
  }

  return sanitizeUser(result);
};

/** Stores the compact base64 profile image directly in the user's MongoDB document. */
const updateAvatar = async (userId: string, avatar: string): Promise<IUserResponse> => {
  const collection = getUserCollection();
  if (!ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user identifier");
  }

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: { avatar, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User profile not found");
  }
  return sanitizeUser(result);
};

const revokeOtherSessions = async (
  userId: string,
  incomingRefreshToken?: string
): Promise<void> => {
  if (!ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user identifier");
  }

  const collection = getUserCollection();
  if (incomingRefreshToken) {
    const hashed = hashToken(incomingRefreshToken);
    // Keep only the current session token
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { refreshTokens: [hashed], updatedAt: new Date() } }
    );
  } else {
    // If no incoming token provided, keep the most recent token
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    const lastToken = user?.refreshTokens?.[user.refreshTokens.length - 1];
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { refreshTokens: lastToken ? [lastToken] : [], updatedAt: new Date() } }
    );
  }
};

const deleteAccount = async (userId: string, password?: string): Promise<void> => {
  if (!ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user identifier");
  }

  const collection = getUserCollection();
  const user = await collection.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User profile not found");
  }

  if (user.password && password) {
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Incorrect password provided for account deletion"
      );
    }
  }

  await collection.deleteOne({ _id: new ObjectId(userId) });
};

const getTopContributors = async (limit: number = 8) => {
  const userCollection = getUserCollection();
  const blogCollection = getBlogCollection();

  // Find active users
  const users = await userCollection
    .find({
      isActive: true,
      "preferences.showInLeaderboard": { $ne: false },
    })
    .project({
      password: 0,
      refreshTokens: 0,
    })
    .toArray();

  // Aggregate published blogs per author
  const blogCounts = await blogCollection
    .aggregate([
      { $match: { status: "Published" } },
      {
        $group: {
          _id: "$authorId",
          authorName: { $first: "$author.name" },
          authorAvatar: { $first: "$author.avatar" },
          authorTitle: { $first: "$author.title" },
          totalArticles: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: "$likes" },
        },
      },
      { $sort: { totalArticles: -1, totalViews: -1 } },
    ])
    .toArray();

  const blogStatsMap = new Map<string, any>();
  for (const b of blogCounts) {
    if (b._id) {
      blogStatsMap.set(b._id.toString(), b);
    }
  }

  // Combine user info with blog stats
  const contributors: any[] = users.map((u) => {
    const stats = blogStatsMap.get(u._id!.toString());
    return {
      _id: u._id!.toString(),
      name: u.name,
      avatar:
        u.avatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`,
      title: u.title || "Developer & Contributor",
      bio: u.bio || "",
      primaryDomain: u.primaryDomain || "Frontend",
      skills: u.skills || [],
      socialLinks: u.socialLinks || {},
      totalArticles: stats ? stats.totalArticles : 0,
      totalViews: stats ? stats.totalViews : 0,
      totalLikes: stats ? stats.totalLikes : 0,
      email: u.preferences?.publicEmail ? u.email : undefined,
    };
  });

  // Also include any author from blogs who might not have a direct user profile
  for (const b of blogCounts) {
    const exists = contributors.some(
      (c) =>
        c._id === b._id?.toString() ||
        c.name.toLowerCase() === b.authorName?.toLowerCase()
    );
    if (!exists && b.authorName) {
      contributors.push({
        _id: b._id ? b._id.toString() : b.authorName.toLowerCase().replace(/\s+/g, "-"),
        name: b.authorName,
        avatar:
          b.authorAvatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            b.authorName
          )}`,
        title: b.authorTitle || "Technical Author",
        bio: "Writing and building in public on DevShare.",
        primaryDomain: "Frontend",
        skills: ["Software Engineering"],
        socialLinks: {},
        totalArticles: b.totalArticles,
        totalViews: b.totalViews,
        totalLikes: b.totalLikes,
        email: undefined,
      });
    }
  }

  // Sort: highest article count first, then by views
  contributors.sort(
    (a, b) => b.totalArticles - a.totalArticles || b.totalViews - a.totalViews
  );

  return contributors.slice(0, limit);
};

const getAuthorDetails = async (authorId: string, currentUserId?: string) => {
  const userCollection = getUserCollection();
  const blogCollection = getBlogCollection();

  let user: IUser | null = null;
  if (ObjectId.isValid(authorId)) {
    user = await userCollection.findOne({ _id: new ObjectId(authorId) });
  }

  // If not found by ObjectId, try searching by name or username
  if (!user) {
    const cleanName = decodeURIComponent(authorId).replace(/-/g, " ");
    user = await userCollection.findOne({
      name: { $regex: new RegExp(`^${cleanName}$`, "i") },
    });
  }

  // Query published articles by this author
  const blogQueryConditions: any[] = [];
  if (user?._id) {
    blogQueryConditions.push({ authorId: user._id });
    blogQueryConditions.push({ "author.id": user._id.toString() });
  }
  if (ObjectId.isValid(authorId)) {
    blogQueryConditions.push({ authorId: new ObjectId(authorId) });
    blogQueryConditions.push({ "author.id": authorId });
  }
  const cleanName = decodeURIComponent(authorId).replace(/-/g, " ");
  blogQueryConditions.push({
    "author.name": { $regex: new RegExp(`^${cleanName}$`, "i") },
  });
  if (user?.name) {
    blogQueryConditions.push({
      "author.name": { $regex: new RegExp(`^${user.name}$`, "i") },
    });
  }

  const articles = await blogCollection
    .find({
      $or: blogQueryConditions,
      status: "Published",
    })
    .sort({ createdAt: -1 })
    .toArray();

  const totalViews = articles.reduce((acc, a) => acc + (a.views || 0), 0);
  const totalLikes = articles.reduce((acc, a) => acc + (a.likes || 0), 0);

  // If user found in users collection
  if (user) {
    const isFollowing = currentUserId
      ? (user.followers || []).includes(currentUserId)
      : false;
    const realFollowers = user.followers?.length || 0;
    const baseFollowers = Math.floor(totalLikes * 0.4) + 12;

    return {
      author: {
        _id: user._id!.toString(),
        name: user.name,
        username: user.email.split("@")[0],
        title: user.title || "Developer & Contributor",
        avatar:
          user.avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
        bio: user.bio || "Sharing technical insights and architectures on DevShare.",
        primaryDomain: user.primaryDomain || "Frontend",
        skills:
          user.skills && user.skills.length > 0
            ? user.skills
            : ["Software Engineering", "Full-Stack"],
        socialLinks: user.socialLinks || {},
        location: "Global / Remote",
        joinedDate: user.createdAt
          ? `Member since ${new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}`
          : "DevShare Contributor",
        email: user.preferences?.publicEmail ? user.email : undefined,
      },
      stats: {
        totalArticles: articles.length,
        totalViews,
        totalLikes,
        followers: baseFollowers + realFollowers,
      },
      isFollowing,
      articles,
    };
  }

  // If user not in users collection, check if articles exist with this author name
  if (articles.length > 0) {
    const firstArt = articles[0];
    const authorName = firstArt.author?.name || cleanName;
    return {
      author: {
        _id: authorId,
        name: authorName,
        username: authorName.toLowerCase().replace(/\s+/g, ""),
        title: firstArt.author?.title || "Technical Author",
        avatar:
          firstArt.author?.avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            authorName
          )}`,
        bio: "Writing in-depth engineering breakdowns and technical tutorials on DevShare.",
        primaryDomain: firstArt.category || "Frontend",
        skills: ["Architecture", "Engineering", firstArt.category],
        socialLinks: {},
        location: "Global / Remote",
        joinedDate: "DevShare Contributor",
        email: undefined,
      },
      stats: {
        totalArticles: articles.length,
        totalViews,
        totalLikes,
        followers: Math.floor(totalLikes * 0.4) + 12,
      },
      isFollowing: false,
      articles,
    };
  }

  throw new AppError(httpStatus.NOT_FOUND, "Contributor not found");
};

const toggleFollowAuthor = async (
  currentUserId: string,
  targetAuthorId: string
): Promise<{ isFollowing: boolean; followers: number }> => {
  const userCollection = getUserCollection();
  const blogCollection = getBlogCollection();

  let authorUser: IUser | null = null;
  if (ObjectId.isValid(targetAuthorId)) {
    authorUser = await userCollection.findOne({ _id: new ObjectId(targetAuthorId) });
  }
  if (!authorUser) {
    const cleanName = decodeURIComponent(targetAuthorId).replace(/-/g, " ");
    authorUser = await userCollection.findOne({
      name: { $regex: new RegExp(`^${cleanName}$`, "i") },
    });
  }

  if (!authorUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Author profile not found");
  }

  const authorIdStr = authorUser._id!.toString();
  if (authorIdStr === currentUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You cannot follow yourself");
  }

  const currentUser = await userCollection.findOne({ _id: new ObjectId(currentUserId) });
  if (!currentUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Authenticated user not found");
  }

  const alreadyFollowing = (authorUser.followers || []).includes(currentUserId);

  // Compute author baseline stats
  const authorArticles = await blogCollection
    .find({
      $or: [
        { authorId: authorUser._id },
        { "author.id": authorIdStr },
        { "author.name": authorUser.name },
      ],
      status: "Published",
    })
    .toArray();
  const totalLikes = authorArticles.reduce((acc, a) => acc + (a.likes || 0), 0);
  const baseFollowers = Math.floor(totalLikes * 0.4) + 12;

  if (alreadyFollowing) {
    // Unfollow
    await userCollection.updateOne(
      { _id: authorUser._id },
      { $pull: { followers: currentUserId } as any }
    );
    await userCollection.updateOne(
      { _id: new ObjectId(currentUserId) },
      { $pull: { following: authorIdStr } as any }
    );

    const updated = await userCollection.findOne({ _id: authorUser._id });
    return {
      isFollowing: false,
      followers: baseFollowers + (updated?.followers?.length || 0),
    };
  } else {
    // Follow
    await userCollection.updateOne(
      { _id: authorUser._id },
      { $addToSet: { followers: currentUserId } as any }
    );
    await userCollection.updateOne(
      { _id: new ObjectId(currentUserId) },
      { $addToSet: { following: authorIdStr } as any }
    );

    // Send notification
    try {
      await NotificationService.createNotification({
        userId: authorIdStr,
        senderId: currentUserId,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        type: "follow",
        title: "New Follower",
        message: `${currentUser.name} started following your profile and publications`,
        link: `/author/${currentUserId}`,
      });
    } catch (err) {
      console.error("Failed to dispatch follow notification:", err);
    }

    const updated = await userCollection.findOne({ _id: authorUser._id });
    return {
      isFollowing: true,
      followers: baseFollowers + (updated?.followers?.length || 0),
    };
  }
};

export const UserService = {
  registerUser,
  loginUser,
  socialLoginUser,
  refreshAccessToken,
  logoutUser,
  revokeOtherSessions,
  deleteAccount,
  getTopContributors,
  getAuthorDetails,
  toggleFollowAuthor,
  changePassword,
  getMe,
  updateProfile,
  updateAvatar,
};

export default UserService;
