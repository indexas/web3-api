require("dotenv").config({ path: process.env.NODE_ENV === "development" ? ".env.development" : ".env" });

const appConfig = {
	appPort: parseInt(process.env.APP_PORT!),
	dbUrl: process.env.DATABASE_URL,
	elasticUrl: process.env.ELASTIC_URL,
	redisUrl: process.env.REDIS_URL,
	appUrl: process.env.APP_URL,
};

export default appConfig;
