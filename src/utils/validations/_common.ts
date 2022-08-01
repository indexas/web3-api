import { ParamSchema } from "express-validator";
import moment from "moment";
import { ApiSearchRequestBody } from "../../models/request/_common";
import { TypedSchema } from "../../models/shared-types";

type CommonValidatorKey = keyof typeof commonSchemaParams;
type CommonValidatorType = { [K in CommonValidatorKey]: ParamSchema };

// #region Single Validators

// Validator
export const paramsIntValidator: any = {
	in: ["params"],
	notEmpty: true,
	isInt: {
		bail: true,
		options: {
			allow_leading_zeroes: false,
		},
	},
};

export const customDateValidator: any = {
	options: (value: any) => {
		const check = moment(value, moment.ISO_8601);
		if (!check.isValid()) throw new Error("Date is not valid");
		return true;
	},
};

export const customStrictNumberValidator: any = {
	options: (value: any) => typeof value === "number",
	errorMessage: "Value must be a number",
};

export const intIdArrayValidator: any = {
	options: (value: any[]) => {
		if (!value.every((val) => Number.isInteger(val) && val > 0)) throw new Error("Array does not contain positive integers");
		return true;
	},
};

export const stringIdArrayValidator: any = {
	options: (value: any[]) => {
		if (!value.every((val) => val && typeof val === "string")) throw new Error("Array can only contains string values");
		return true;
	},
};

export const stringIdArrayValidatorNotEmpty: any = {
	options: (value: any[]) => {
		if (value.length === 0) {
			throw new Error("Array must contain string values");
		}
		if (!value.every((val) => val && typeof val === "string")) throw new Error("Array can only contains string values");
		return true;
	},
};

export const sortArrayValidator: any = {
	options: (value: any) => {
		if (Object.keys(value).every((key) => !(value[key] === "asc" || value[key] === "desc"))) throw new Error("Sort object values must be asc or desc");
		return true;
	},
};

export const publicRightsTypeValidator: any = (notEmpty: boolean = false) => ({
	in: ["body"],
	notEmpty,
	isIn: {
		options: [["off", "edit", "view"]],
	},
});

export const userRightsTypeValidator: any = (notEmpty: boolean = false) => ({
	in: ["body"],
	notEmpty,
	isIn: {
		options: [["edit", "view", "owner"]],
	},
});
// Sanitizer
export const customDateSanitizer: any = {
	options: (value: any) => moment(value).toDate(),
};

export const customStrIntSanitizer: any = {
	options: (value: any) => Number.parseInt(value),
};

export const strinctInt: (min?: number) => ParamSchema = (min = 0) => ({
	isInt: {
		bail: true,
		options: {
			min,
			allow_leading_zeroes: false,
		},
	},
	custom: customStrictNumberValidator,
});

// #endregion

// #region CommonSchemaParams

export const commonSchemaParams: { [K: string]: ParamSchema } = {
	bodyId: {
		in: ["body"],
		...strinctInt(),
	},
	email: {
		in: ["body"],
		notEmpty: true,
		isEmail: true,
		trim: true,
		escape: true,
	},
	url: {
		in: ["body"],
		isURL: true,
		trim: true,
	},
	paramId: {
		in: ["params"],
		notEmpty: true,
		isInt: true,
	},
} as CommonValidatorType;

// #endregion

// #region PaginationSchema

export const paginationSchema: TypedSchema<ApiSearchRequestBody> = {
	id: {
		optional: true,
		isArray: {
			bail: true,
		},
		custom: intIdArrayValidator,
	},
	skip: {
		optional: true,
		...strinctInt(),
	},
	take: {
		optional: true,
		...strinctInt(1),
	},
	startDate: {
		optional: true,
		isDate: {
			bail: true,
		},
		custom:	customDateValidator,
		customSanitizer: customDateSanitizer,
	},
	endDate: {
		optional: true,
		isDate: {
			bail: true,
		},
		custom:	customDateValidator,
		customSanitizer: customDateSanitizer,
	},
	search: {
		optional: true,
		isString: true,
		trim: true,
		escape: true,
	},
	sort: {
		optional: true,
		custom: sortArrayValidator,
	},
};

// #endregion
