import { HighlightType } from "../../services/elastic-service/type";
import { LinksSearchRequestBody } from "../request/links";
import { ListResponse } from "../shared-types";

export interface LinkResponse {
	id: number;
  content: string | null;
  title: string | null;
  url: string | null;
  sort: number | null;
  tags: string[];
  streamId: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  language: string | null;
  favicon: string | null;
  images: string[];
  highlight?: HighlightType;
}

export interface LinkSearchResponse extends ListResponse<LinkResponse, LinksSearchRequestBody>{}
