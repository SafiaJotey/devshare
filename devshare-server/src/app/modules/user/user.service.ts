import { ObjectId } from "mongodb";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { getUserCollection } from "./user.model";
import {
  ILoginUserPayload,
  IRegisterUserPayload,
  IUser,
  IUserResponse,
} from "./user.interface";
import { comparePassword, generateToken, hashPassword } from "../../utils/jwt";

// Helper to strip password from user object
const sanitizeUser = (user: IUser): IUserResponse => {
  const { password, ...sanitized } = user;
  return sanitized;
};

const registerUser = async (
  payload: IRegisterUserPayload
): Promise<{ user: IUserResponse; token: string }> => {
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
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(newUser);
  newUser._id = result.insertedId;

  // Generate JWT token
  const token = generateToken({
    id: newUser._id.toString(),
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
  });

  return {
    user: sanitizeUser(newUser),
    token,
  };
};

const loginUser = async (
  payload: ILoginUserPayload
): Promise<{ user: IUserResponse; token: string }> => {
  const collection = getUserCollection();
  const normalizedEmail = payload.email.trim().toLowerCase();

  const user = await collection.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password credentials"
    );
  }

  const isPasswordMatch = await comparePassword(payload.password, user.password);

  if (!isPasswordMatch) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password credentials"
    );
  }

  const token = generateToken({
    id: user._id!.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return {
    user: sanitizeUser(user),
    token,
  };
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
  const { _id, email, password, role, createdAt, ...allowedUpdates } = payload as any;

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
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return sanitizeUser(result);
};

export const UserService = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};

export default UserService;
