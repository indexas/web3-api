import {
	NextFunction, Response,
} from "express";
import { ApiRequestWithAddress } from "../models/request/_common";
import { ERROR } from "../constants";
import { sendResponse } from "../utils/helper";
import authService from "../services/auth-service";

/**
 * Middleware for checking the auth status for the user
 * @param req RequestWithUser
 */
export const checkAuthMw = (req: ApiRequestWithAddress, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];
		if (token == null) return res.sendStatus(401);

		authService.verify(token).then((address) => {
			if (!address) {
				return sendResponse(res, { success: false, error: ERROR.AUTH.INVALID_TOKEN });
			}
			req.address = address;
			req.token = token;
			next();
		}).catch(() => sendResponse(res, { success: false, error: ERROR.AUTH.INVALID_TOKEN }));
	} catch {
		return sendResponse(res, { success: false, error: ERROR.USER.TOKEN_WRONG });
	}
};

export const getAuthMw = (req: ApiRequestWithAddress, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];

		if (token) {
			authService.verify(token).then((address) => {
				req.address = address;
				req.token = token;
				next();
			}).catch(() => next());
		} else {
			next();
		}
	} catch {
		return sendResponse(res, { success: false, error: ERROR.USER.TOKEN_WRONG });
	}
};
