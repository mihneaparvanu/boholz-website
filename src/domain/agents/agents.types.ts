export type Agent = {
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  phoneSecondary: string | null;
  role: string | null;
};

export type AgentSlug = keyof typeof import("./agents").agents;
