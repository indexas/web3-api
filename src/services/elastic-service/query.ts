import { SearchRequest } from "@elastic/elasticsearch/lib/api/types";
import { IndexesSearchRequestBody } from "../../models/request/indexes";
import { LinksSearchRequestBody } from "../../models/request/links";

function highlighterSpecTopic() {
	return {
		type: "plain",
		fields: {
			title: {
				number_of_fragments: 0,
			},
		},
	};
}

function highlighterSpecLink() {
	const highlight: any = {
		type: "plain",
		fields: {
			"links.content": {
				fragment_size: 200,
				number_of_fragments: 2,
			},
		},
	};

	const fields = ["title", "url", "tags"];
	fields.forEach((key) => {
		highlight.fields[`links.${key}`] = { number_of_fragments: 0 };
	});

	return highlight;
}

const searchQuery = (query: string) => ({
	bool: {
		minimum_should_match: 1,
		should: [
			{
				nested: {
					path: "links",
					query: {
						bool: {
							minimum_should_match: 1,
							should: [
								{
									multi_match: {
										fields: ["links.title^10", "links.url", "links.content"],
										analyzer: "searchable",
										query,
										type: "phrase_prefix",
										slop: 1,
										zero_terms_query: "all",
									},
								},
								{
									multi_match: {
										fields: ["links.tags^3"],
										analyzer: "searchable",
										query,
										type: "bool_prefix",
										zero_terms_query: "all",
									},
								},
							],
						},
					},
					inner_hits: {
						name: "link_hits",
						size: 5,
						_source: {
							excludes: ["links.content"],
						},
						highlight: highlighterSpecLink(),
					},
				},
			},
			{
				multi_match: {
					fields: ["title"],
					analyzer: "searchable",
					query,
					slop: 1,
					zero_terms_query: "all",
					type: "phrase_prefix",
				},
			},
		],
	},
});

const indexesWithLinksSearch = (
	address: string,
	req: IndexesSearchRequestBody = {
		skip: 0,
		take: 10,
	},
): SearchRequest => {
	const search: SearchRequest = {
		index: "indexes",
		from: req.skip,
		size: req.take,
		query: {
			bool: {
				must: req.search ? [searchQuery(req.search) as any] : undefined,
				filter: [
					{
						term: {
							address,
						},
					},
				],
			},
		},
	};
	if (!req.sort) {
		search.sort = [{
			updatedAt: {
				order: "desc",
			},
		}] as any;
	}

	search.highlight = highlighterSpecTopic();
	return search;
};

const linksSearchRequest = (req: LinksSearchRequestBody = {
	skip: 0,
	take: 10,
}): SearchRequest => ({
	index: "indexes",
	query: {
		bool: {
			must: [{
				term: { streamId: req.streamId! },
			},
			{
				nested: {
					path: "links",
					query: {
						bool: {
							minimum_should_match: 1,
							should: [
								{
									multi_match: {
										fields: ["links.title^10", "links.url", "links.content"],
										analyzer: "searchable",
										query: req.search!,
										type: "phrase_prefix",
										slop: 1,
										zero_terms_query: "all",
									},
								},
								{
									multi_match: {
										fields: ["links.tags^3"],
										analyzer: "searchable",
										query: req.search!,
										type: "bool_prefix",
										zero_terms_query: "all",
									},
								},
							],
						},
					},
					inner_hits: {
						from: req.skip,
						size: req.take,
						highlight: highlighterSpecLink(),
					},
				},
			},
			],
		},
	},
});

const findIndexQuery = (address: string, streamId: string) => ({
	bool: {
		must: [
			{
				term: { address },
			},
			{
				term: { streamId },
			},
		],
	},
});

const findLinkQuery = (userId: number, linkId: number) => ({
	bool: {
		must: [
			{
				nested: {
					path: "users",
					query: {
						bool: {
							must: [
								{
									term: { "users.id": userId },
								},
							],
						},
					},
				},
			},
			{
				term: { id: linkId },
			},
		],
	},
});

const linkSearch = (
	userId: number,
	streamId: number,
	req: LinksSearchRequestBody = {
		skip: 0,
		take: 10,
	},
) => {
	const search: SearchRequest = {
		index: "indexes",
		from: req.skip,
		size: req.take,
		_source_excludes: ["content", "idx", "users"],
		query: {
			bool: {
				must: [
					{
						term: { streamId },
					},
					{
						exists: {
							field: "id",
						},
					},
					{
						nested: {
							path: "users",
							query: {
								bool: {
									must: [
										{
											term: { "users.id": userId },
										},
									],
								},
							},
						},
					},
				],
			},
		},
	};

	if (req.search) {
		(search.query?.bool?.must as any).push({
			bool: {
				minimum_should_match: 1,
				should: [
					{
						multi_match: {
							fields: ["title^10", "url", "content"],
							analyzer: "searchable",
							query: req.search,
							type: "phrase_prefix",
							slop: 1,
							zero_terms_query: "all",
						},
					},
					{
						multi_match: {
							fields: ["tags^3"],
							analyzer: "searchable",
							query: req.search,
							type: "bool_prefix",
							zero_terms_query: "all",
						},
					},
				],
			},
		});

		search.highlight = {
			type: "plain",
			fields: {
				title: {
					number_of_fragments: 0,
				},
				url: {
					number_of_fragments: 0,
				},
				content: {
					fragment_size: 200,
					number_of_fragments: 2,
				},
			},
		};
	} else {
		search.sort = {
			sort: {
				order: "asc",
			},
		} as any;
	}

	if (req.id && req.id.length > 0) {
		(search.query?.bool?.must as any).push({
			terms: { id: req.id },
		});
	}

	return search;
};

const ES_QUERY = {
	indexes: {
		indexesWithLinksSearch,
		linkSearch,
		linksSearchRequest,
		findIndexQuery,
		findLinkQuery,
	},
};

export default ES_QUERY;
