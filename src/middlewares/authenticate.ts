import { NextFunction, Request, Response } from 'express';
import ApiError from 'src/utils/ApiError';
import jwtUtil from 'src/utils/jwtUtil';

const authenticate =
  (allowTypes: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        next(
          new ApiError(
            'Authentication failed. Please provide a valid access token',
            req.originalUrl,
            401
          )
        );
        return;
      }
      const payload: any = jwtUtil.verify(accessToken, 'access');
      if (!allowTypes.includes(payload.type)) {
        next(
          new ApiError(
            'You do not have permission to access this resource.',
            req.originalUrl,
            401
          )
        );
        return;
      }
      req.profile = payload;
      next();
    } catch (e) {
      if (e instanceof Error && e.name === 'TokenExpiredError') {
        try {
          const refreshToken = req.cookies.refreshToken;
          if (!refreshToken) {
            new ApiError('Refresh token missing.', req.originalUrl, 401);
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
        } catch (e) {
          if (e instanceof Error && e.name === 'TokenExpiredError') {
            next(
              new ApiError(
                'Refresh token has expired. Please login again.',
                req.originalUrl,
                401
              )
            );
          }
          next(new ApiError('Invalid refresh token', req.originalUrl, 401));
        }
      }
      next(new ApiError('Invalid access token', req.originalUrl, 401));
    }
  };

export default authenticate;
