import {
	IndexesRequestBody, IndexesSearchRequestBody,
} from "../../models/request/indexes";
import { ServiceResponse } from "../../models/shared-types";
import { ERROR } from "../../constants";
import { IndexResponse, IndexSearchResponse } from "../../models/response/indexes";
import esService from "../elastic-service";
import mongoService from "../mongo-service";
import redisService from "../redis-service";
/*
	We create single instance to use lower memory in production
	our prisma client also singleton
*/
class IndexService {
	public async get(streamId: string): Promise<ServiceResponse> {
		try {
			const doc = await esService.getIndex(streamId);
			if (doc != null) {
				return {
					success: true,
					data: doc,
				};
			}
			return {
				success: false,
				error: ERROR.INDEXES.NOT_FOUND,
			};
		} catch (err) {
			return {
				success: false,
				error: ERROR.COMMON.READ_ERROR,
			};
		}
	}
	public async delete(streamId: string): Promise<ServiceResponse> {
		try {
			await mongoService.deleteIndex(streamId);
			await esService.deleteIndex(streamId);
			await redisService.deleteIndex(streamId);
			return {
				success: true,
				data: {},
			};
		} catch (err) {
			return {
				success: false,
				error: ERROR.COMMON.DELETE_ERROR,
			};
		}
	}

	public async post(data: IndexesRequestBody): Promise<ServiceResponse<IndexResponse>> {
		try {
			await mongoService.createIndex(data);
			await esService.createIndex(data);
			await redisService.setIndex(data.streamId);
			return {
				success: true,
				data,
			};
		} catch (err) {
			return {
				success: false,
				error: ERROR.COMMON.CREATE_ERROR,
			};
		}
	}

	public async put(data: IndexesRequestBody): Promise<ServiceResponse<IndexResponse>> {
		try {
			await mongoService.updateIndex(data);
			await esService.putIndex(data);
			return {
				success: true,
				data,
			};
		} catch (err) {
			return {
				success: false,
				error: ERROR.COMMON.CREATE_ERROR,
			};
		}
	}

	public async clone(address: string, streamId: string): Promise<ServiceResponse> {
		try {
			// TODO: Clone verisi ceramicten mi çekilecek yoksa elastic tenmi
			const toClone = await esService.getIndex(streamId);
			if (toClone) {
				return {
					success: true,
					data: toClone,
				};
			}
			return {
				success: false,
				error: ERROR.INDEXES.NOT_FOUND,
			};
		} catch {
			return {
				success: false,
				error: ERROR.COMMON.CREATE_ERROR,
			};
		}
	}

	public async search(addressFromToken: string, req: IndexesSearchRequestBody): Promise<ServiceResponse<IndexSearchResponse>> {
		try {
			const indexes = await esService.searchIndexes(req, addressFromToken);
			return indexes;
		} catch {
			return {
				success: false,
				error: ERROR.COMMON.READ_ERROR,
			};
		}
	}
}

const indexService = new IndexService();

export default indexService;
