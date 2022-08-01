import { NextFunction, Request, Response } from "express";

export const keepAliveMw = (req: Request, _: Response, next: NextFunction) => {
	req.socket.setKeepAlive(true, 1000);
	next();
};
