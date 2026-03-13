import type { BaseTimestamps, EntityId } from "./common";

export type CampaignStatus = "DRAFT" | "SCHEDULED" | "ACTIVE" | "COMPLETED";

export interface CampaignBase extends BaseTimestamps {
  id: EntityId;
  name: string;
  status: CampaignStatus;
}

