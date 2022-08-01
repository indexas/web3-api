export type IndexCountType = "owned" | "shared" | "seperate" | "both";

export interface IndexCountResult {
	totalCount?: number;
	ownedCount?: number;
	sharedCount?: number;
}
