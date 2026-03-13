import type { BaseTimestamps, EntityId } from "./common";

export type NotificationStatus = "DRAFT" | "SCHEDULED" | "SENT" | "FAILED";

export interface NotificationBase extends BaseTimestamps {
  id: EntityId;
  campaignId?: EntityId;
  title: string;
  body: string;
  status: NotificationStatus;
}

export interface NotificationLogBase {
  id: EntityId;
  notificationId: EntityId;
  createdAt: string;
  deliveredAt?: string;
  clickedAt?: string;
}

