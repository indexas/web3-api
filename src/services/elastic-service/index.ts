import { Client } from "@elastic/elasticsearch";
import { AggregationsAggregate, SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import appConfig from "../../config";
import { ERROR } from "../../constants";
import { Indexes } from "../../models/entity";
import { IndexesSearchRequestBody } from "../../models/request/indexes";
import { LinksSearchRequestBody } from "../../models/request/links";
import { IndexResponse, IndexSearchResponse } from "../../models/response/indexes";
import { LinkResponse, LinkSearchResponse } from "../../models/response/links";
import { ServiceResponse } from "../../models/shared-types";
import ES_QUERY from "./query";
import { EsIndexDocument, EsLinkDocument } from "./type";

const client = new Client({
	node: appConfig.elasticUrl,
});

const IND_NAME = "indexes";

class ElasticService {
	async pingService() {
		try {
			await client.ping(undefined, {
				requestTimeout: 1000,
			});
			console.log("Elasticsearch is running");
		} catch (err) {
			throw new Error(`Couldn't connect to elastic: ${err}`);
		}
	}

	// #region Indexes
	async searchIndexes(
		req: IndexesSearchRequestBody,
		address?: string,
	): Promise<ServiceResponse<IndexSearchResponse>> {
		try {
			// NOTE: If address specified in body we ignore the address from token
			const addressToCheck = req.address || address;
			if (!addressToCheck) {
				return {
					success: false,
					error: ERROR.USER.USER_PERMISSON,
				};
			}
			const query = ES_QUERY.indexes.indexesWithLinksSearch(addressToCheck, req);
			const result = await client.search<EsIndexDocument>(query);
			const totalCount = (result?.hits?.total as any)?.value || 0;

			const response: IndexSearchResponse = {
				totalCount,
				records: this.transformIndexSearch(result, !!req.search),
				search: req,
			};
			return {
				success: true,
				data: response,
			};
		} catch (err) {
			return {
				success: false,
			};
		}
	}

	async searchLinks(
		req: LinksSearchRequestBody,
	): Promise<ServiceResponse<LinkSearchResponse>> {
		try {
			const query = ES_QUERY.indexes.linksSearchRequest(req);
			const result = await client.search<EsLinkDocument>(query);
			const totalCount = result?.hits?.hits &&
				result?.hits?.hits.length > 0 ? (result?.hits?.hits[0].inner_hits?.links.hits.total as any)?.value : 0;

			const response: LinkSearchResponse = {
				totalCount,
				records: this.transfromLinkSearch(result),
				search: req,
			};
			return {
				success: true,
				data: response,
			};
		} catch (err) {
			return {
				success: false,
			};
		}
	}

	async patchIndex(doc: Indexes) {
		await client.update({
			index: IND_NAME,
			id: doc.streamId,
			doc,
		});
		await this.refresh();
	}

	async createIndex(document: Indexes) {
		await client.index({
			index: IND_NAME,
			id: document.streamId,
			document,
		});
		await this.refresh();
	}

	async deleteIndex(streamId: string) {
		await client.delete({
			id: streamId,
			index: IND_NAME,
		});
		await this.refresh();
	}

	async getIndex(streamId: string): Promise<Indexes | null> {
		try {
			const data = await client.getSource<Indexes>({
				index: IND_NAME,
				id: streamId,
			});
			return data;
		} catch {
			return null;
		}

		// const dt = await client.search<EsIndexDocument>({
		// 	index: IND_NAME,
		// 	size: 1,
		// 	query: ES_QUERY.indexes.findIndexQuery(address, streamId),
		// });

		// const hits = dt?.hits?.hits;
		// return hits && hits.length > 0 ? hits[0]._source : null;
	}
	// #endregion

	async refresh() {
		await client.indices.refresh({ index: IND_NAME });
	}

	private highlightTopic(t: any) {
		if (t.highlight) {
			if (t.highlight.title) {
				t._source.title = t.highlight.title[0];
			}
		}
		return t._source;
	}

	private transformIndexSearch(
		dt: SearchResponse<EsIndexDocument, Record<string, AggregationsAggregate>>,
		hasSearchTerm: boolean,
	) {
		let result: (IndexResponse | EsIndexDocument)[] = [];
		const hits = dt?.hits?.hits;
		if (hits && hits.length > 0) {
			if (hasSearchTerm) {
				hits.forEach((h) => {
					const indexResponse: IndexResponse = {
						...this.highlightTopic(h) as IndexResponse,
						links: hasSearchTerm ? (h.inner_hits?.link_hits.hits.hits.map((l: any) => this.highlightLink(l)) || []) as any : [],
					};
					result.push(indexResponse);
				});
			} else {
				result = hits.map((h) => h._source) as any;
			}
		}
		return result;
	}

	private transfromLinkSearch(dt: SearchResponse<EsLinkDocument, Record<string, AggregationsAggregate>>) {
		const result: (LinkResponse)[] = [];
		const hitsIndex = dt?.hits?.hits;
		if (hitsIndex && hitsIndex.length && hitsIndex.length > 0) {
			const hits = hitsIndex[0].inner_hits?.links?.hits?.hits;
			if (hits && hits.length > 0) {
				hits.forEach((h) => {
					result.push(this.highlightLink(h));
				});
			}
		}

		return result;
	}

	private highlightLink(l: any) {
		if (l.highlight) {
			if (l.highlight["links.content"]) {
				l._source.content = l.highlight["links.content"]
					.join("... ")
					.replace(/(\r\n|\n|\r|\\n)/gm, "");
			}

			if (l.highlight["links.title"]) {
				l._source.title = l.highlight["links.title"][0];
			}

			/*
		if (l.highlight['links.url']) {
			l._source.url = l.highlight['links.url'][0]
		}
		*/

			if (l.highlight["links.tags"]) {
				l._source.tags = l.highlight["links.tags"];
			}
		}

		return l._source;
	}
}

const elasticService = new ElasticService();

export default elasticService;
