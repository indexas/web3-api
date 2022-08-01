import { NextFunction } from "express";
import {
	checkSchema, validationResult,
} from "express-validator";
import { ApiRequestWithAddress } from "../models/request/_common";
import { ApiResponse } from "../models/response/_common";
import { sendResponse } from "../utils/helper";

export const checkValidationMw = (schema: any) => async (req: ApiRequestWithAddress, res: ApiResponse, next: NextFunction) => {
	// await Promise.allSettled(checkSchema(schema).map((validation) => validation.run(req)));

	// Sequential Execution applied if we want to show all errors please comment below lines and uncomment the top line
	// eslint-disable-next-line no-restricted-syntax
	const validations = checkSchema(schema);
	for (let i = 0; i < validations.length; i++) {
		// eslint-disable-next-line no-await-in-loop
		const result = await validations[i].run(req);
		if ((result as any).errors.length) break;
	}

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return sendResponse(res, {
			success: false,
			error: {
				status: 400,
				errors: errors.array(),
			},
		});
	}
	next();
};
