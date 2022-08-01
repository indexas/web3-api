import { indexesSchema } from "./indexes";
import linksSchema from "./links";

const VALIDATION_SCHEMA = {
	indexes: indexesSchema,
	links: linksSchema,
};

export default VALIDATION_SCHEMA;
