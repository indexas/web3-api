import { Indexes, Links } from "../../models/entity";
import { IndexUsersRightType } from "../../models/shared-types";

export interface EsUserType {
	id: number;
	permission: IndexUsersRightType;
}

export type HighlightType<T = {}> = T & {
	highlight?: { [key: string]: string[] }
};

export interface EsIndexDocument extends HighlightType<Indexes> {}

export interface EsLinkDocument extends HighlightType<Links> {}
