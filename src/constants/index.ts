export const ERROR = {
	AUTH: {
		INVALID_TOKEN: {
			code: 11,
			message: "Invalid access token.",
			status: 400,
		},
		INVLD_REGISTER_DT: {
			code: 12,
			message: "Username, email and password must be strings and all are required.",
			status: 400,
		},
		INVLD_CRD: {
			code: 13,
			message: "Invalid credentials",
			status: 401,
		},
		WEAK_PW: {
			code: 14,
			message: "Weak password",
			status: 400,
		},
		INVLD_MAIL: {
			code: 15,
			message: "Invalid email address",
			status: 400,
		},
		ACC_TAKEN: {
			code: 16,
			message: "A user account exists with given username or email",
			status: 400,
		},
		USER_NOT_FOUND: {
			code: 17,
			message: "User is not found.",
			status: 404,
		},
	},
	USER: {
		TOKEN_WRONG: {
			code: 21,
			message: "Token is not valid.",
			status: 401,
		},
		USER_PERMISSON: {
			code: 22,
			message: "Permission denied.",
			status: 405,
		},
	},
	INDEXES: {
		NOT_FOUND: {
			code: 31,
			message: "Index not found",
			status: 404,
		},
	},
	LINKS: {
		NO_META: {
			code: 41,
			message: "Can't get metadata for link",
			status: 404,
		},
		NOT_FOUND: {
			code: 42,
			message: "No links found.",
			status: 404,
		},
	},
	COMMON: {
		DELETE_ERROR: {
			code: 81,
			message: "Error occured during delete",
			status: 500,
		},
		CREATE_ERROR: {
			code: 82,
			message: "Error occured during create",
			status: 500,
		},
		READ_ERROR: {
			code: 83,
			message: "Error occured during read",
			status: 500,
		},
		UPDATE_ERROR: {
			code: 84,
			message: "Error occured during update",
			status: 500,
		},
	},
};
