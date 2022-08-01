import express from "express";
import {
	cloneIndex, deleteIndex, getIndex, postIndex, searchIndexes,
} from "../../controllers/indexes";

import { checkAuthMw, getAuthMw } from "../../middlewares/check-auth";
import { checkValidationMw } from "../../middlewares/check-validation";
import VALIDATION_SCHEMA from "../../utils/validations";
// import linksRouter from "./links";

const indexesRouter = express.Router();

// All endpoints are private
// indexesRouter.use(checkAuthMw as any);

// Self endpoints
indexesRouter.post(
	"/search",
	getAuthMw,
	checkValidationMw(VALIDATION_SCHEMA.indexes.searchIndexesSchema),
	searchIndexes,
);

indexesRouter.get(
	"/:streamId",
	checkValidationMw(VALIDATION_SCHEMA.indexes.getIndexSchema),
	getIndex,
);

indexesRouter.post(
	"/",
	checkAuthMw,
	checkValidationMw(VALIDATION_SCHEMA.indexes.postIndexSchema),
	postIndex,
);

indexesRouter.delete(
	"/:streamId",
	checkAuthMw,
	checkValidationMw(VALIDATION_SCHEMA.indexes.deleteIndexSchema),
	deleteIndex,
);

indexesRouter.post(
	"/:streamId/clone",
	checkAuthMw,
	checkValidationMw(VALIDATION_SCHEMA.indexes.cloneIndexSchema),
	cloneIndex,
);

// Nested Routers
// indexesRouter.use("/:streamId/links", linksRouter);

export default indexesRouter;
