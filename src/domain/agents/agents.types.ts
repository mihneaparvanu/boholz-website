export type Agent = {
  fullName: string;
  email: string;
  phoneNumber: string;
  phoneSecondary: string;
  role: string;
};

export type AgentSlug = keyof typeof import("./agents").agents;
