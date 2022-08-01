import { Request } from "express";

export type SortType = "asc" | "desc";

export type ObjectFromKeys<T, V> = {
	[K in keyof T]: V;
};
export interface BaseRequestFilterParams<T = {}> {
	startDate?: Date;
	endDate?: Date;
	id?: number[] | string[];
	search?: string;
	sort?: ObjectFromKeys<T, SortType>;
}

export interface BaseRequestPaginationParams {
	skip?: number;
	take?: number;
}

export type ApiFilteredRequestBody<T = {}> = T & BaseRequestFilterParams<T>;

export type ApiPaginatedRequestBody<T = {}> = T & BaseRequestPaginationParams;

/**
 * S corresponds to requested object it self. It's used for sorting
 */
export type ApiSearchRequestBody<S = {}> = Partial<Omit<S, "id">> & BaseRequestFilterParams<S> & BaseRequestPaginationParams;

export interface ApiRequest<B = {}, P = {}, Q = {}> extends Request<P, {}, B, Q> {}
export interface ApiRequestWithAddress<B = {}, P = {}, Q = {}> extends ApiRequest<B, P, Q> {
	address?: string;
	token?: string;
}

export type ApiSearchRequest<B = {}> = ApiRequest<ApiSearchRequestBody<B>>;
