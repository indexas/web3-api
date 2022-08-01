import { Links } from "../entity";
import { IndexesRequestParams } from "./indexes";
import { ApiSearchRequestBody } from "./_common";

export interface LinksRequestParams extends IndexesRequestParams {
	id: number;
}

export interface LinkCrawlReuestParams {
	url: string;
}

export interface LinksSearchRequestBody extends ApiSearchRequestBody<{}> {
	streamId?: string;
}

export interface LinksCrawlContentRequest {
	streamId: string;
	links: Links[];
}

export interface LinksSyncContentRequest {
	ids: string[];
}

export interface LinksRequestBody {
  url: string;
}
