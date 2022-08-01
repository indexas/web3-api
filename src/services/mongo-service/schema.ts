import mongoose from "mongoose";

const { Schema } = mongoose;
mongoose.model;

const imgSchema = new Schema({
	url: String,
	size: Number,
	width: Number,
	height: Number,
	caption: String,
});

const linkSchema = new Schema({
	id: {
		type: String,
		required: true,
		trim: true,
	},
	content: String,
	title: String,
	url: {
		type: String,
		required: true,
	},
	sort: Number,
	description: String,
	language: String,
	favicon: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	images: [imgSchema],
	tags: [String],
});

const indexSchema = new Schema({
	streamId: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	title: String,
	clonedFrom: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	address: {
		type: String,
		required: true,
		trim: true,
	},
	links: [linkSchema],
});

const contentQueueSchema = new Schema({
	address: String,
	streamId: String,
	links: [linkSchema],
});

const MongooseSchemas = {
	linkSchema,
	indexSchema,
	contentQueueSchema,
};

export default MongooseSchemas;
