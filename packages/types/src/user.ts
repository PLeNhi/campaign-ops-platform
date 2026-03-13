import type { BaseTimestamps, EntityId } from "./common";

export type UserRole = "ADMIN" | "OPERATOR" | "VIEWER";

export interface UserBase extends BaseTimestamps {
  id: EntityId;
  email: string;
  role: UserRole;
}

