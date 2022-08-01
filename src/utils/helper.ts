import { Response } from "express";
import { matchedData } from "express-validator";
import { ApiRequest } from "../models/request/_common";
import { ServiceResponse } from "../models/shared-types";

export function removeProperties<T extends { [key: string]: any }>(obj: T, ...properties: string[]): Partial<T> {
	const clone = { ...obj };
	properties.forEach((p) => {
		delete clone[p];
	});
	return clone;
}

export function checkPasswordStrength(password: string): {
	valid: boolean,
	message?: string
} {
	let strength = 0;
	if (password.match(/[a-z]+/)) {
		strength += 1;
	}
	if (password.match(/[A-Z]+/)) {
		strength += 1;
	}
	if (password.match(/[0-9]+/)) {
		strength += 1;
	}
	if (password.match(/[$@#&!]+/)) {
		strength += 1;
	}

	if (password.length < 8) {
		return ({
			valid: false,
			message: "minimum number of characters is 8",
		});
	}

	if (strength < 3) {
		return ({
			valid: false,
			message: "password is not strong enough",
		});
	}
	return ({
		valid: true,
	});
}

export function isAllString(...strs: any[]) {
	let result = strs.length > 0;
	for (let i = 0; i < strs.length; i++) {
		if (typeof strs[i] !== "string") {
			result = false;
			break;
		}
	}
	return result;
}

export function isStringInteger(val: any) {
	return (typeof val === "string" && Number.isInteger(parseInt(val))) ||
		(typeof val === "number" && Number.isInteger(val));
}

export function clearBody<T>(req: ApiRequest<T>): T {
	return matchedData(req, {
		includeOptionals: true,
		locations: ["body"],
	}) as (typeof req.body);
}

export function clearParams<T>(req: ApiRequest<{}, T>): T {
	return matchedData(req, {
		includeOptionals: true,
		locations: ["params"],
	}) as (typeof req.params);
}

export function clearQuery<T>(req: ApiRequest<{}, T>): T {
	return matchedData(req, {
		includeOptionals: true,
		locations: ["query"],
	}) as (typeof req.params);
}

export function sendResponse(res: Response, serviceResponse: ServiceResponse) {
	if (serviceResponse.success) {
		return res.json(serviceResponse.data);
	}
	return res.status(serviceResponse.error?.status || 400).json(serviceResponse.error);
}
