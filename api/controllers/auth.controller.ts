import { NextFunction, Request, Response } from 'express';

import authService from '../services/auth.service';

import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
  REFRESH_TOKEN_NAME,
} from '../utils/cookies';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } = await authService.register(req.body);

      setRefreshTokenCookie(res, refreshToken);

      return res.status(201).json({
        success: true,
        accessToken,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } = await authService.login(req.body);

      setRefreshTokenCookie(res, refreshToken);

      return res.json({
        success: true,
        accessToken,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.[REFRESH_TOKEN_NAME];

      const { accessToken, refreshToken: newRefreshToken } =
        await authService.refreshToken(refreshToken);

      setRefreshTokenCookie(res, newRefreshToken);

      return res.json({
        success: true,
        accessToken,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.user!.id);

      clearRefreshTokenCookie(res);

      return res.json({
        success: true,
        message: 'Sesión cerrada correctamente.',
      });
    } catch (err) {
      next(err);
    }
  }

  async me(req: Request, res: Response) {
    return res.json({
      success: true,
      user: req.user,
    });
  }
}

export default new AuthController();
