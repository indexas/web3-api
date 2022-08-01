/**
 * Model indexes
 *
 */
export type Indexes = {
  streamId: string
  title: string | null
  publicRights: EnumIndexVisibility | null
  privateLinkRights: EnumIndexVisibility | null
  privateLinkCode: string | null
  clonedFrom: string | null
  createdAt: Date
  updatedAt: Date
	address: string;
	links: Links[];
};

/**
 * Model IndexUsers
 *
 */
export type IndexUsers = {
  id: number
  streamId: string
  address: string
  permission: EnumIndexUsersRole | null
  createdAt: Date
  updatedAt: Date
};

/**
 * Model invitations
 *
 */
export type Invitations = {
  id: number
  streamId: string
	family: string
  invitingAddress: string
  invitedAddress: string
  permission: EnumInviteRight | null
  url: string
  status: EnumInviteStatus | null
  createdAt: Date
  updatedAt: Date
};

/**
 * Model links
 *
 */
export type Links = {
  _id: number
  streamId: string
  content: string | null
  title: string | null
  url: string | null
  description: string | null
  language: string | null
  favicon: string | null
  createdAt: Date
  updatedAt: Date
  images: string[]
  tags: string[]
};

/**
 * Model users
 *
 */
export type Users = {
  address: string
  name: string | null
  username: string | null
  picture: string | null
  location: string | null
  visibility: boolean
  bio: string | null
  urlWeb: string | null
  apiKey: string | null
  zapierToken: string | null
  createdAt: Date
  updatedAt: Date
};

export interface LinkContentResult {
  id?: string;
  address: string;
  streamId: string;
  links: Links[];
}

/**
 * Enums
 */

export type EnumIndexVisibility = {
	off: "off",
	edit: "edit",
	view: "view",
};

export type EnumIndexUsersRole = {
  owner: "owner",
  edit: "edit",
  view: "view"
};

export type EnumInviteRight = {
  view: "view",
  edit: "edit"
};

export type EnumInviteStatus = {
	pending: "pending",
	approved: "approved",
	rejected: "rejected",
};
