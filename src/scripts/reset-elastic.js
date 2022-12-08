const elastic = require("@elastic/elasticsearch");

require("dotenv").config({ path: process.env.NODE_ENV === "development" ? ".env.development" : ".env" });

const client = new elastic.Client({
	node: process.env.ELASTIC_URL,
});

const mapping1 = {
	index: 'indexes',
	body: {
		properties: {
			streamId: {
				type: 'search_as_you_type',
				analyzer: 'searchable',
			},
			address: {
				type: 'search_as_you_type',
				analyzer: 'searchable',
			},
			title: {
				type: 'search_as_you_type',
				analyzer: 'searchable',
			},
			slug: {
				type: 'keyword',
			},
			updatedAt: {
				type: 'date',
			},
			createdAt: {
				type: 'date',
			},
			links: {
				type: 'nested',
				properties: {
					title: {
						type: 'search_as_you_type',
						analyzer: 'searchable',
					},
					url: {
						type: 'search_as_you_type',
						analyzer: 'searchable',
					},
					content: {
						type: 'search_as_you_type',
						analyzer: 'searchable',
					},
					tags: {
						type: 'keyword',
					},
					description: {
						type: 'search_as_you_type',
						analyzer: 'searchable',
					},
					updatedAt: {
						type: 'date',
					},
					createdAt: {
						type: 'date',
					},
					order: {
						type: "long",
					}
				},
			},
		},
	},
};

async function main() {

	try {
		await client.indices.delete({
			index: "indexes"
		});
	} catch (err) {
		console.log("Cant delete index: ", err);
	}

	try {
		await client.indices.create({
			index: "indexes",
			body: {
        settings: {
          analysis: {
            analyzer: {
              searchable: {
                tokenizer: 'standard',
                filter: ['lowercase', 'custom_ascii_folding'],
                char_filter: ['html_strip']
              },
            },
            filter: {
              custom_ascii_folding: {
                type: 'asciifolding',
                preserve_original: true,
              },
            },
          },
        },
      },
		});

		await client.indices.putMapping(mapping1);
	} catch (err) {
		console.log("Cant create index: ", err);
	}
}

main().finally(() => process.exit(0));

