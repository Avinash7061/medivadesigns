export const MESSAGE_STATUSES = ["UNREAD", "READ", "RESOLVED"] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];
