import { ERROR } from "../../constants";
import { Links } from "../../models/entity";
import { ServiceResponse } from "../../models/shared-types";
import crawlerService from "../crawler-service";

class LinkService {
	public async crawl(
		url: string,
	): Promise<ServiceResponse<Partial<Links>>> {
		const response = await crawlerService.crawlLink(url);
		if (response == null) {
			return {
				success: false,
				error: ERROR.LINKS.NO_META,
			};
		}

		try {
			return response;
		} catch (err) {
			return {
				success: false,
				error: ERROR.COMMON.READ_ERROR,
			};
		}
	}
}

const linkService = new LinkService();

export default linkService;
