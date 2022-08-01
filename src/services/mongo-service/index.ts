/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import mongoose from "mongoose";
import config from "../../config";
import {
	LinkContentResult, Indexes, Links,
} from "../../models/entity";
import { ContentQueue, Index } from "./models";

mongoose.connect(config.dbUrl!);

class MongoService {
	async init() {
		await mongoose.connect(config.dbUrl!);
	}

	async createIndex(dt: Indexes) {
		return Index.create(dt);
	}

	async updateIndex(dt: Indexes) {
		return Index.updateOne({
			streamId: dt.streamId,
		}, dt);
	}

	async addLink(streamId: string, dt: Links) {
		return Index.updateOne({ streamId }, {
			$push: {
				links: dt,
			},
		});
	}

	async removeLink(streamId: string, dt: Links) {
		return Index.updateOne({ streamId }, {
			$pull: {
				links: dt._id,
			},
		});
	}

	async deleteIndex(streamId: string) {
		return Index.deleteOne({
			streamId,
		});
	}

	async addContentResult(contentResult: LinkContentResult) {
		return ContentQueue.create(contentResult);
	}

	async findContentResult(address: string) {
		return ContentQueue.find({
			address,
		}).lean();
	}

	async syncContent(address: string, ids: string[]) {
		return ContentQueue.deleteMany({
			address,
			_id: { $in: ids },
		});
	}
}

const mongoService = new MongoService();

export default mongoService;
