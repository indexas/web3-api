import mongoose from "mongoose";
import { LinkContentResult, Indexes, Links } from "../../models/entity";
import MongooseSchemas from "./schema";

export const Index = mongoose.model<Indexes>("indexes", MongooseSchemas.indexSchema);
export const Link = mongoose.model<Links>("links", MongooseSchemas.linkSchema);
export const ContentQueue = mongoose.model<LinkContentResult>("link-contents", MongooseSchemas.contentQueueSchema);
