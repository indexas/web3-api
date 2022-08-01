import { IndexesRequestBody, IndexesRequestParams, IndexesSearchRequestBody } from "../../../models/request/indexes";
import { TypedSchema } from "../../../models/shared-types";
import {
	customDateValidator, paginationSchema,
} from "../_common";

const searchIndexesSchema: TypedSchema<IndexesSearchRequestBody> = {
	...paginationSchema,
	address: {
		in: ["body"],
		isString: true,
		optional: true,
	},
};

// const patchIndexSchema: TypedSchema<IndexesRequestBody, IndexesRequestParams> = {
// 	streamId: {
// 		...paramsIdValidator,
// 		customSanitizer: customStrIntSanitizer,
// 	},
// 	title: {
// 		in: ["body"],
// 		isString: true,
// 	},
// 	publicRights: publicRightsTypeValidator,
// 	privateLinkRights: publicRightsTypeValidator,
// };

const deleteIndexSchema: TypedSchema<{}, IndexesRequestParams> = {
	streamId: {
		in: ["params"],
		isString: true,
		notEmpty: true,
	},
};

const postIndexSchema: TypedSchema<{}, IndexesRequestBody> = {
	title: {
		in: ["body"],
		isString: true,
		optional: true,
	},
	streamId: {
		in: ["body"],
		isString: true,
		notEmpty: true,
	},
	address: {
		in: ["body"],
		isString: true,
		optional: true,
	},
	clonedFrom: {
		in: ["body"],
		isString: true,
		optional: true,
	},
	createdAt: {
		in: ["body"],
		custom: customDateValidator,
		optional: true,
	},
	updatedAt: {
		in: ["body"],
		custom: customDateValidator,
		optional: true,
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
	"links.*.content": {
		optional: {
			options: {
				nullable: true,
				checkFalsy: false,
			},
		},
		isString: true,
	},
	"links.title": {
		optional: true,
		isString: true,
	},
	"links.description": {
		optional: true,
		isString: true,
	},
	"links.language": {
		optional: true,
		isString: true,
	},
	"links.favicon": {
		isString: true,
		optional: true,
	},
	"links.createdAt": {
		custom: customDateValidator,
		optional: true,
	},
	"links.updatedAt": {
		custom: customDateValidator,
		optional: true,
	},
	"links.images": {
		isArray: {
			bail: true,
		},
		optional: true,
	},
	"links.tags": {
		isArray: {
			bail: true,
		},
		optional: true,
	},
};

const getIndexSchema: TypedSchema<{}, IndexesRequestParams> = {
	streamId: {
		in: ["params"],
		isString: true,
		notEmpty: true,
	},
};

const cloneIndexSchema = deleteIndexSchema;

export const indexesSchema = {
	searchIndexesSchema,
	getIndexSchema,
	deleteIndexSchema,
	postIndexSchema,
	cloneIndexSchema,
};
