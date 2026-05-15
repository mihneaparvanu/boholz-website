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
  suffix?: string;
}

export const trustBadges: TrustBadge[] = [
  { icon: LucideHammer, title: "Made in Germany", value: 100, suffix: "%" },
  { icon: LucideCalendar, title: "Monate Festpreisgarantie", value: 18 },
  { icon: LucideShieldCheck, title: "Jahre Gewährleistung", value: 5 },
];
