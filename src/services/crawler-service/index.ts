import axios from "axios";
import { ERROR } from "../../constants";
import { Links } from "../../models/entity";
import { ServiceResponse } from "../../models/shared-types";

// const lambda = new AWS.Lambda({
// 	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// 	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// 	region: process.env.AWS_S3_REGION,
// 	apiVersion: "v4",
// });

class CrawlerService {
	public async crawlLink(url: string): Promise<ServiceResponse<Partial<Links>>> {
		try {
			const response = await axios.get(
				`https://api.embedly.com/1/extract?key=${process.env.EMBEDLY_API_KEY}&url=${url}`,
			);
			if (!response.data) {
				return {
					success: false,
					error: ERROR.LINKS.NO_META,
				};
			}
			return {
				success: true,
				data: this.transformEmbedly(response.data),
			};
		} catch (err) {
			return {
				success: true,
				error: ERROR.COMMON.READ_ERROR,
			};
		}
	}

	private transformEmbedly(response: any): Partial<Links> {
		if (response.provider_name && response.provider_name !== response.title) {
			response.title = `${response.provider_name} - ${response.title}`;
		}
		return {
			url: response.url,
			title: response.title,
			description: response.description,
			language: response.language,
			favicon: response.favicon_url,
			images: response.images,
			content: response.content,
		};
	}
}

const crawlerService = new CrawlerService();

export default crawlerService;
