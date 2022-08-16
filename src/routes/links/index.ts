import express from "express";
import {
	crawl,
	crawlContent,
	findContent,
	search,
	syncContent,
} from "../../controllers/links";
import { checkValidationMw } from "../../middlewares/check-validation";
import VALIDATION_SCHEMA from "../../utils/validations";
import { checkAuthMw, getAuthMw } from "../../middlewares/check-auth";

// All routes are private guard is in top router

const linksRouter = express.Router({ mergeParams: true });

linksRouter.get(
	"/crawl",
	checkAuthMw,
	checkValidationMw(VALIDATION_SCHEMA.links.crawlLinkSchema),
	crawl,
);

linksRouter.post(
	"/search",
	getAuthMw,
	checkValidationMw(VALIDATION_SCHEMA.links.searchLinkSchema),
	search,
);

linksRouter.post(
	"/crawl-content",
	checkAuthMw,
	checkValidationMw(VALIDATION_SCHEMA.links.crawlContentSchema),
	crawlContent,
);

linksRouter.get(
	"/find-content",
	checkAuthMw,
	findContent,
);

linksRouter.post(
	"/sync-content",
	checkAuthMw,
	checkValidationMw(VALIDATION_SCHEMA.links.syncContentSchema),
	syncContent,
);

export default linksRouter;
