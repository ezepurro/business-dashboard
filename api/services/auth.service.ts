import { User } from '../models';
import { comparePassword, hashPassword, hashRefreshToken } from '../utils/bcrypt';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { UserRole, UserStatus } from '../types/enums';
import { compareRefreshToken } from '../utils/bcrypt';
import ApiError from '../utils/ApiError';

interface RegisterDTO {
  username: string;
  name: string;
  email: string;
  password: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

class AuthService {
  async register(data: RegisterDTO) {
    const { username, name, email, password } = data;

    const exists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (exists) {
      throw new ApiError(409, 'El usuario ya existe.');
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      username,
      name,
      email,
      passwordHash,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    await User.findByIdAndUpdate(user.id, {
      refreshToken: await hashRefreshToken(refreshToken),
    });

    await user.save();

    return {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },

      accessToken,

      refreshToken,
    };
  }

  async login(data: LoginDTO) {
    const { email, password } = data;

    const user = await User.findOne({
      email,
    }).select('+passwordHash +refreshToken');

    if (!user) {
      throw new ApiError(401, 'Credenciales inválidas.');
    }

    const validPassword = await comparePassword(password, user.passwordHash);

    if (!validPassword) {
      throw new ApiError(401, 'Credenciales inválidas.');
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    await User.findByIdAndUpdate(user.id, {
      refreshToken: await hashRefreshToken(refreshToken),
    });

    await user.save();

    return {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },

      accessToken,

      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(401, 'Refresh Token requerido.');
    }

    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, 'Refresh Token inválido.');
    }

    const user = await User.findById(payload.userId).select('+refreshToken');

    if (!user || !user.refreshToken) {
      throw new ApiError(401, 'Refresh Token inválido.');
    }

    const validRefreshToken = await compareRefreshToken(refreshToken, user.refreshToken);

    if (!validRefreshToken) {
      throw new ApiError(401, 'Refresh Token inválido.');
    }

    const newAccessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user.id,
    });

    user.refreshToken = await hashRefreshToken(newRefreshToken);

    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, {
      refreshToken: null,
    });

    return;
  }
}

export default new AuthService();
