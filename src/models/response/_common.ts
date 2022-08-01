import { Response } from "express";
import { ValidationError } from "express-validator";

export interface ApiErrorResponse {
	status: number;
	message?: string;
	code?: number;
	errors?: ValidationError[];
}

export type ApiResponse<T = undefined> = Response<T | ApiErrorResponse>;
