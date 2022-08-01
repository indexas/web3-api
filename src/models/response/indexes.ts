import { HighlightType } from "../../services/elastic-service/type";
import { Indexes } from "../entity";
import { IndexesSearchRequestBody } from "../request/indexes";
import { ListResponse } from "../shared-types";

export interface IndexResponse extends Indexes {
  highlight?: HighlightType;
}

export interface IndexSearchResponse extends ListResponse<IndexResponse, IndexesSearchRequestBody> {}
