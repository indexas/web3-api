import { ApiResponse } from "../../models/response/_common";
import { ApiRequestWithAddress } from "../../models/request/_common";
import { clearBody, clearQuery, sendResponse } from "../../utils/helper";
import { LinkContentResult, Links } from "../../models/entity";
import crawlerService from "../../services/crawler-service";
import { LinksCrawlContentRequest, LinksSearchRequestBody, LinksSyncContentRequest } from "../../models/request/links";
import esService from "../../services/elastic-service";
import mongoService from "../../services/mongo-service";
import lambdaService from "../../services/lambda-service";
import { ERROR } from "../../constants";
import socketService from "../../services/socket-service";
/** Search Links */
// export const searchLinks = async (
// 	req: ApiRequestWithAddress<LinksSearchRequestBody, LinksRequestParams>,
// 	res: ApiResponse<LinkResponse[]>,
// ) => {
// 	const { streamId } = req.params;
// 	const body = clearBody(req);

// 	const result = await elasticService.searchLinks(req.address!, streamId, body);

// 	sendResponse(res, result);
// };
/** Create Link */
export const crawl = async (
	req: ApiRequestWithAddress<{}, { url: string }>,
	res: ApiResponse<Partial<Links>>,
) => {
	const { url } = clearQuery(req);

	const result = await crawlerService.crawlLink(url);
	return sendResponse(res, result!);
};

export const search = async (
	req: ApiRequestWithAddress<LinksSearchRequestBody>,
	res: ApiResponse<Partial<Links>>,
) => {
	const body = clearBody(req);
	const result = await esService.searchLinks(body);
	return sendResponse(res, result!);
};

export const findContent = async (
	req: ApiRequestWithAddress<{}>,
	res: ApiResponse<LinkContentResult[]>,
) => {
	try {
		const result = await mongoService.findContentResult(req.address!);
		const linkContentResult: LinkContentResult[] = result.map((o) => ({
			id: o._id.toString(),
			address: o.address,
			streamId: o.streamId,
			links: o.links,
		}));
		return sendResponse(res, {
			success: true,
			data: linkContentResult,
		});
	} catch (err) {
		return sendResponse(res, {
			success: false,
			error: ERROR.COMMON.READ_ERROR,
		});
	}
};

export const crawlContent = async (
	req: ApiRequestWithAddress<LinksCrawlContentRequest>,
	res: ApiResponse<{}>,
) => {
	const body = clearBody(req);
	const { streamId, links } = body;
	if (links.length > 0) {
		lambdaService.getContents(links).then(async () => {
			try {
				const result = {
					address: req.address!,
					streamId,
					links,
				};
				const added = await mongoService.addContentResult(result);
				await socketService.sendSyncMessage(req.token!, {
					...result,
					id: added._id.toString(),
				});
			} catch (err) {
				console.log(err);
			}
		}).catch((err) => {
			console.log(err);
		});

		return sendResponse(res, {
			success: true,
		});
	}
	return sendResponse(res, {
		success: false,
	});
};

export const syncContent = async (
	req: ApiRequestWithAddress<LinksSyncContentRequest>,
	res: ApiResponse<{
		deletedCount: number,
	}>,
) => {
	const body = clearBody(req);

	try {
		const result = await mongoService.syncContent(req.address!, body.ids);
		if (result.deletedCount > 0) {
			return sendResponse(res, {
				success: true,
				data: {
					deletedCount: result.deletedCount,
				},
			});
		}
		return sendResponse(res, {
			success: true,
			error: ERROR.LINKS.NOT_FOUND,
		});
	} catch (err) {
		return sendResponse(res, {
			success: false,
			error: ERROR.COMMON.UPDATE_ERROR,
		});
	}
};
