import AWS from "aws-sdk";
import { Links } from "../../models/entity";

const lambda = new AWS.Lambda({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_S3_REGION,
	version: "v4",
} as any);

class LambdaService {
	async getContents(links: Links[]) {
		return new Promise<Links[]>((resolve, reject) => {
			try {
				links.forEach((link, index) => {
					lambda.invoke(
						{
							FunctionName: "indexas-crawler-dev-crawl",
							Payload: JSON.stringify({ url: link.url }),
						},
						async (err, data) => {
							const payload = data && JSON.parse(data.Payload! as any);
							if (err) console.error(err, err.stack);
							else if (payload && payload.content) {
								link.content = payload.content;
							}
							if (index === links.length - 1) {
								return resolve(links);
							}
						},
					);
				});
			} catch (e) {
				console.log("Lambda error: ", e);
				reject(e);
			}
		});
	}
}

const lambdaService = new LambdaService();

export default lambdaService;
