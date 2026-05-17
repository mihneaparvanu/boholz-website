/**
 * Lucide icon resolver.
 *
 * Cross-island prop passing breaks when Lucide components are sent as Vue
 * props from Astro pages — the functional-component reference doesn't
 * survive the SSR → client boundary cleanly (renders fine, hydrates wrong).
 *
 * Pattern: pages and Astro components reference icons by string name.
 * Vue islands receive the name as a prop and resolve it locally via this
 * map. Tree-shakeable: only icons we explicitly re-export end up in the
 * bundle.
 *
 * To add an icon, add it here AND to the IconName union. TS will hold the
 * line.
 */
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CalendarCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Coins,
  Compass,
  Film,
  Hammer,
  HardHat,
  HeartHandshake,
  Home,
  Info,
  KeyRound,
  KeySquare,
  Layers,
  Leaf,
  Lightbulb,
  Lock,
  Mail,
  MapPin,
  MessagesSquare,
  Minus,
  Pencil,
  Phone,
  PlayCircle,
  Plus,
  Quote,
  Ruler,
  Search,
  Shield,
  SmartphoneNfc,
  Sparkles,
  Sun,
  Target,
  Thermometer,
  TreeDeciduous,
  TrendingUp,
  Users,
  Video,
  Wifi,
  Wrench,
  X,
  Zap,
} from "lucide-vue-next";
import type { FunctionalComponent, SVGAttributes } from "vue";

/** Lucide's per-icon prop surface — declared locally because
 *  lucide-vue-next's `LucideProps` interface is internal (not exported).
 *  Matches the lib's own numeric `size`/`strokeWidth` contract exactly so
 *  the iconMap typing is assignment-compatible with the upstream
 *  `FunctionalComponent<LucideProps>` shape. */
export type IconProps = Partial<SVGAttributes> & {
  size?: number;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  color?: string;
};

export type IconComponent = FunctionalComponent<IconProps>;

export type IconName =
  | "alert-circle"
  | "alert-triangle"
  | "arrow-right"
  | "arrow-up-right"
  | "award"
  | "book-open"
  | "briefcase"
  | "building-2"
  | "calendar-check"
  | "check"
  | "chevron-down"
  | "chevron-right"
  | "coins"
  | "compass"
  | "film"
  | "hammer"
  | "hard-hat"
  | "heart-handshake"
  | "home"
  | "info"
  | "key-round"
  | "key-square"
  | "layers"
  | "leaf"
  | "lightbulb"
  | "lock"
  | "mail"
  | "map-pin"
  | "messages-square"
  | "minus"
  | "pencil"
  | "phone"
  | "play-circle"
  | "plus"
  | "quote"
  | "ruler"
  | "search"
  | "shield"
  | "smartphone-nfc"
  | "sparkles"
  | "sun"
  | "target"
  | "thermometer"
  | "tree-deciduous"
  | "trending-up"
  | "users"
  | "video"
  | "wifi"
  | "wrench"
  | "x"
  | "zap";

export const iconMap: Record<IconName, IconComponent> = {
  "alert-circle": AlertCircle,
  "alert-triangle": AlertTriangle,
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  award: Award,
  "book-open": BookOpen,
  briefcase: Briefcase,
  "building-2": Building2,
  "calendar-check": CalendarCheck,
  check: Check,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  coins: Coins,
  compass: Compass,
  film: Film,
  hammer: Hammer,
  "hard-hat": HardHat,
  "heart-handshake": HeartHandshake,
  home: Home,
  info: Info,
  "key-round": KeyRound,
  "key-square": KeySquare,
  layers: Layers,
  leaf: Leaf,
  lightbulb: Lightbulb,
  lock: Lock,
  mail: Mail,
  "map-pin": MapPin,
  "messages-square": MessagesSquare,
  minus: Minus,
  pencil: Pencil,
  phone: Phone,
  "play-circle": PlayCircle,
  plus: Plus,
  quote: Quote,
  ruler: Ruler,
  search: Search,
  shield: Shield,
  "smartphone-nfc": SmartphoneNfc,
  sparkles: Sparkles,
  sun: Sun,
  target: Target,
  thermometer: Thermometer,
  "tree-deciduous": TreeDeciduous,
  "trending-up": TrendingUp,
  users: Users,
  video: Video,
  wifi: Wifi,
  wrench: Wrench,
  x: X,
  zap: Zap,
};

export const getIcon = (name: IconName): IconComponent => iconMap[name];
