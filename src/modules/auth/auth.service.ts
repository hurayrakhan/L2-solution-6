import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config/index.js';
import { AppError } from '../../utils/app-error.js';
import { prisma } from '../../utils/prisma.js';
import { TLoginUser, TRegisterUser } from './auth.interface.js';

const registerUserIntoDB = async (payload: TRegisterUser) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  const hashedPassword = await bcrypt.hash(payload.password, config.bcrypt_salt_rounds);

  const newUser = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return newUser;
};

const loginUserFromDB = async (payload: TLoginUser) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user || user.deletedAt) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt.secret, {
    expiresIn: config.jwt.expires_in as jwt.SignOptions['expiresIn'],
  });

  const refreshToken = jwt.sign(jwtPayload, config.jwt.refresh_secret, {
    expiresIn: config.jwt.refresh_expires_in as jwt.SignOptions['expiresIn'],
  });

  const { password: _, ...userData } = user;

  return {
    accessToken,
    refreshToken,
    user: userData,
  };
};

const refreshToken = async (token: string) => {
  let decoded: jwt.JwtPayload;
  try {
    decoded = jwt.verify(token, config.jwt.refresh_secret) as jwt.JwtPayload;
  } catch (err) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user || user.deletedAt) {
    throw new AppError('User belonging to this token no longer exists', 401);
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt.secret, {
    expiresIn: config.jwt.expires_in as jwt.SignOptions['expiresIn'],
  });

  return { accessToken };
};

export const AuthService = {
  registerUserIntoDB,
  loginUserFromDB,
  refreshToken,
};
