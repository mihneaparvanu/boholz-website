import {
  LucideHammer,
  LucideShieldCheck,
  LucideCalendar,
} from "lucide-vue-next";
import type { Component } from "vue";

export interface TrustBadge {
  icon: Component;
  title: string;
  value: number;
}

export const trustBadges: TrustBadge[] = [
  { icon: LucideHammer, title: "100% Made in Germany", value: 25 },
  { icon: LucideCalendar, title: "Monate Festpreisgarantie", value: 18 },
  { icon: LucideShieldCheck, title: "Jahre Gewährleistung", value: 5 },
];
