import {
	LinkCrawlReuestParams, LinksCrawlContentRequest, LinksSearchRequestBody, LinksSyncContentRequest,
} from "../../../models/request/links";
import { TypedSchema } from "../../../models/shared-types";
import { paginationSchema, stringIdArrayValidatorNotEmpty } from "../_common";

const crawlLinkSchema: TypedSchema<{}, LinkCrawlReuestParams> = {
	url: {
		in: ["query"],
		notEmpty: true,
		isURL: {
			bail: true,
		},
	},
};

const searchLinkSchema: TypedSchema<LinksSearchRequestBody> = {
	...paginationSchema,
	streamId: {
		in: ["body"],
		isString: true,
		notEmpty: true,
	},
	search: {
		in: ["body"],
		isString: true,
		optional: true,
	},
};

const crawlContentSchema: TypedSchema<{}, LinksCrawlContentRequest> = {
	streamId: {
		in: ["body"],
		isString: true,
		notEmpty: true,
	},
	links: {
		in: ["body"],
		isArray: {
			bail: true,
		},
	},
	"links.*.url": {
		notEmpty: true,
		isURL: {
			bail: true,
		},
	},
	"links.*.id": {
		isString: true,
		notEmpty: true,
	},
};

const syncContentSchema: TypedSchema<LinksSyncContentRequest> = {
	ids: {
		in: ["body"],
		isArray: true,
		custom: stringIdArrayValidatorNotEmpty,
	},
};

const linksSchema = {
	crawlLinkSchema,
	searchLinkSchema,
	crawlContentSchema,
	syncContentSchema,
};

export default linksSchema;
