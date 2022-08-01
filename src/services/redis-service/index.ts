import { createClient, RedisClientType } from "redis";

class RedisService {
	private readonly client: RedisClientType;
	constructor() {
		this.client = createClient();
		this.client.on("error", (err) => console.log("Redis Client Error", err));
	}

	async init() {
		try {
			await this.connect();
			await this.client.configSet("appendonly", "yes");
			console.info("Redis is running");
		} catch (err) {
			console.error("Can't connect to Redis\n", err);
		}
	}

	async connect() {
		if (!this.client.isOpen) {
			await this.client.connect();
		}
	}

	async quit() {
		if (this.client.isOpen) {
			await this.client.quit();
		}
	}

	async setIndex(streamId: string) {
		await this.client.set(streamId, "");
	}

	async deleteIndex(streamId: string) {
		await this.client.del(streamId);
	}

	async checkIndex(streamId: string): Promise<boolean> {
		try {
			const exists = await this.client.get(streamId);
			return exists !== null;
		} catch (err) {
			return false;
		}
	}

	async setSocket(token: string, socketId: string) {
		await this.client.set(`socket-${token}`, socketId);
	}

	async deleteSocket(token: string) {
		await this.client.del(`socket-${token}`);
	}

	async getSocketId(token: string) {
		const result = await this.client.get(`socket-${token}`);
		return result;
	}
}

const redisService = new RedisService();

export default redisService;
