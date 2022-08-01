import express from "express";
import compression from "compression";
import cors from "cors";
import appConfig from "./config";
import apiRouter from "./routes/api";
import morganMiddleware from "./middlewares/logger/morgan";
import { keepAliveMw } from "./middlewares/keep_alive";
import elasticService from "./services/elastic-service";
import redisService from "./services/redis-service";
import mongoService from "./services/mongo-service";
import socketService from "./services/socket-service";

async function main() {
	try {
		await mongoService.init();
		await elasticService.pingService();
		await redisService.init();
	} catch (err) {
		console.log(err);
		process.exit(0);
	}
	const app = express();

	app.use(cors());
	// Top Level Middlewares
	app.use(compression());
	app.use(keepAliveMw);
	app.use(express.json());
	app.use(morganMiddleware);

	// Routers
	app.use("/", apiRouter);

	const server = app.listen(appConfig.appPort, () => console.log(`Index.as API server ready at port ${appConfig.appPort}`));
	await socketService.init(server);
}

process.on("exit", async () => {
});

main();
