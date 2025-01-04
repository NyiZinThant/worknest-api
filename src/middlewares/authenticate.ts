import { NextFunction, Request, Response } from 'express';
import ApiError from 'src/utils/ApiError';
import jwtUtil from 'src/utils/jwtUtil';

const authenticate =
  (allowTypes: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        throw new Error('MissingToken');
      }
      const payload: any = jwtUtil.verify(accessToken, 'access');
      if (!allowTypes.includes(payload.type)) {
        next(
          new ApiError(
            'You do not have permission to access this resource.',
            'AccessDenied',
            req.originalUrl,
            401
          )
        );
        return;
      }
      req.profile = payload;
      next();
    } catch (e) {
      if (
        e instanceof Error &&
        (e.name === 'TokenExpiredError' || e.message === 'MissingToken')
      ) {
        try {
          const refreshToken = req.cookies.refreshToken;
          if (!refreshToken) {
            new ApiError(
              'Refresh token missing.',
              'MissingRefreshToken',
              req.originalUrl,
              401
            );
            return;
          }
          const refreshPayload: any = jwtUtil.verify(refreshToken, 'refresh');
          const newAccess = jwtUtil.generateAccessToken({
            id: refreshPayload.id,
            type: refreshPayload.type,
          });
          res.cookie('accessToken', newAccess.token, {
            secure: true,
            httpOnly: true,
            maxAge: newAccess.exp,
          });
          next();
          return;
        } catch (e) {
          if (e instanceof Error && e.name === 'TokenExpiredError') {
            next(
              new ApiError(
                'Refresh token has expired. Please login again.',
                'RefreshTokenExpired',
                req.originalUrl,
                401
              )
            );
          }
          next(
            new ApiError(
              'Invalid refresh token.',
              'InvalidRefreshToken',
              req.originalUrl,
              401
            )
          );
        }
      }
      next(
        new ApiError(
          'Invalid access token.',
          'InvalidAccessToken',
          req.originalUrl,
          401
        )
      );
    }
  };

export default authenticate;
