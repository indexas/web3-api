import { Indexes } from "../entity";
import { ApiSearchRequestBody } from "./_common";

export interface IndexesRequestParams {
	streamId: string;
}

/**
 * o: "owner",
 * s: "shared",
 * a: "all",
 * v: "view",
 * e: "edit"
 */
export type IndexSearchRequestType = "o" | "s" | "a" | "v" | "e";
export interface IndexesSearchRequestBody extends ApiSearchRequestBody<Indexes> {
	// permission: IndexSearchRequestType;
}

export interface IndexesRequestBody extends Indexes {}
