import { ObjectId } from "mongodb";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { getUserCollection } from "./user.model";
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
    socialLinks: {},
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
      socialLinks: {},
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

export const UserService = {
  registerUser,
  loginUser,
  socialLoginUser,
  refreshAccessToken,
  logoutUser,
  changePassword,
  getMe,
  updateProfile,
  updateAvatar,
};

export default UserService;
