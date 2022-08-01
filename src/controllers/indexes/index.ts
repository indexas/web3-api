import { ApiResponse } from "../../models/response/_common";
import { ApiRequest, ApiRequestWithAddress } from "../../models/request/_common";
import {
	IndexesRequestBody, IndexesRequestParams, IndexesSearchRequestBody,
} from "../../models/request/indexes";
import { IndexResponse } from "../../models/response/indexes";
import { clearBody, clearParams, sendResponse } from "../../utils/helper";
import indexService from "../../services/index-service";
import esService from "../../services/elastic-service";
import { EsIndexDocument } from "../../services/elastic-service/type";

/** Search Indexes */
export const searchIndexes = async (
	req: ApiRequestWithAddress<IndexesSearchRequestBody>,
	res: ApiResponse<EsIndexDocument[]>,
) => {
	const body = clearBody(req);
	const result = await esService.searchIndexes(body, req.address);

	return sendResponse(res, result);
};

/** Get Index */
export const getIndex = async (
	req: ApiRequest<{}, IndexesRequestParams>,
	res: ApiResponse<EsIndexDocument[]>,
) => {
	const result = await indexService.get(req.params.streamId!);

	return sendResponse(res, result);
};

/** Delete Index */
export const deleteIndex = async (
	req: ApiRequestWithAddress<{}, IndexesRequestParams>,
	res: ApiResponse,
) => {
	const { streamId } = clearParams(req);

	const result = await indexService.delete(streamId);

	return sendResponse(res, result);
};

/** Create Index */
export const postIndex = async (
	req: ApiRequestWithAddress<IndexesRequestBody>,
	res: ApiResponse<IndexResponse>,
) => {
	const body = clearBody(req);

	body.address = req.address!;

	const result = await indexService.post(body);

	return sendResponse(res, result);
};

/** Clone Index */
export const cloneIndex = async (
	req: ApiRequestWithAddress<{}, IndexesRequestParams>,
	res: ApiResponse<IndexResponse>,
) => {
	const { streamId } = clearParams(req);

	const result = await indexService.clone(req.address!, streamId);

	return sendResponse(res, result);
};
