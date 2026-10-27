import type { Agent } from "@/db/models";
export type AgentRecord = Omit<Agent, "id" | "slug" | "bio">;
export type AgentSlug = keyof typeof import("./agents").agents;
