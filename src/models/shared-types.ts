import { ParamSchema } from "express-validator/src/middlewares/schema";
import { ApiErrorResponse } from "./response/_common";

export type PublicRightsType = "off" | "edit" | "view";

export type IndexUsersRightType = "edit" | "view" | "owner";

export type LinkRightsType = "edit" | "view" | "owner";

type CustomRecord<K extends string | number | symbol, T> = { [P in K]?: T; };

export type TypedSchema<B = {}, P = {}> = CustomRecord<string | keyof B | keyof P, ParamSchema>;

export interface ServiceResponse<T = {}> {
	success: boolean;
	data?: T;
	error?: ApiErrorResponse;
}

export interface ListResponse<T, S> {
	totalCount?: number;
  records?: T[];
  search?: S;
}
