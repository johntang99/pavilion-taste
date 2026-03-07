// ============================================================
// BAAM System F — Chinese Restaurant Premium
// Chinese-specific TypeScript interfaces
// Rule: nameZh is string (NOT string | undefined) on all core entities
// ============================================================

import type { SiteInfo } from '@/lib/types';

// ============================================================
// Menu
// ============================================================

export type DimSumCategory =
  | 'steamed'
  | 'baked'
  | 'fried'
  | 'congee-noodle'
  | 'dessert'
  | 'other';

export type SpiceLevel = 0 | 1 | 2 | 3;
export type WeekdayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface ChineseMenuItem {
  id: string;
  siteId: string;
  menuCategoryId?: string | null;
  slug: string;
  // Names — both required for Chinese restaurant
  name: string;
  nameZh: string;
  description?: string | null;
  descriptionZh?: string | null;
  shortDescription?: string | null;
  shortDescriptionZh?: string | null;
  // Pricing — null = market price (时价)
  price?: number | null;
  priceNote?: string | null;
  image?: string | null;
  // Chinese-specific
  originRegion?: string | null;
  isDimSum: boolean;
  dimSumCategory?: DimSumCategory | null;
  isChefSignature: boolean;
  chefNote?: string | null;
  chefNoteZh?: string | null;
  pairingNote?: string | null;
  // Dietary
  isHalal: boolean;
  isKosher: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spiceLevel?: SpiceLevel | null;
  // Availability
  isPopular: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuCategory {
  id: string;
  siteId: string;
  name: string;
  nameZh: string;
  slug: string;
  description?: string | null;
  descriptionZh?: string | null;
  menuType: string;
  hoursOpen?: string | null;
  hoursClose?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface MenuDailySpecial {
  id: string;
  siteId: string;
  weekday: WeekdayKey;
  menuItemId: string;
  item?: ChineseMenuItem;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// Festivals
// ============================================================

export type FestivalSlug = 'chinese-new-year' | 'mid-autumn' | 'wedding-banquet' | 'dragon-boat' | string;

export interface PrixFixeCourse {
  dish: string;
  dishZh: string;
  description?: string | null;
}

export interface PrixFixeTier {
  id: string;
  festivalId: string;
  tier: 'standard' | 'premium' | 'vip';
  tierName: string;
  tierNameZh: string;
  pricePerPerson: number;
  minGuests: number;
  courses: PrixFixeCourse[];
  sortOrder: number;
}

export interface Festival {
  id: string;
  siteId: string;
  name: string;
  nameZh: string;
  slug: FestivalSlug;
  activeDateStart: string;
  activeDateEnd: string;
  year: number;
  heroImage?: string | null;
  tagline?: string | null;
  taglineZh?: string | null;
  description?: string | null;
  descriptionZh?: string | null;
  urgencyMessage?: string | null;
  urgencyCount?: number | null;
  isActive: boolean;
  isLocked: boolean;
  prixFixeTiers?: PrixFixeTier[];
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// Banquet Packages
// ============================================================

export type BanquetTier = 'business-lunch' | 'celebration' | 'wedding-banquet' | 'corporate';

export interface BanquetPackage {
  id: string;
  siteId: string;
  name: string;
  nameZh: string;
  slug: string;
  tier: BanquetTier;
  description?: string | null;
  descriptionZh?: string | null;
  pricePerHead: number;
  minGuests: number;
  maxGuests: number;
  includes: string[];
  includesZh: string[];
  highlight?: string | null;
  roomImage?: string | null;
  isActive: boolean;
  sortOrder: number;
}

// ============================================================
// Dim Sum Orders
// ============================================================

export interface DimSumOrderItem {
  menuItemId: string;
  name: string;
  nameZh: string;
  quantity: number;
  price: number;
}

export interface DimSumOrder {
  id: string;
  siteId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  partySize: number;
  preferredDate: string;
  preferredTime: string;
  items: DimSumOrderItem[];
  totalAmount?: number | null;
  specialRequests?: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
}

// ============================================================
// Catering
// ============================================================

export type EventType = 'corporate' | 'wedding' | 'birthday' | 'holiday' | 'other';
export type BanquetEventType = 'birthday' | 'anniversary' | 'wedding-banquet' | 'corporate' | 'other';
export type InquiryStatus = 'new' | 'contacted' | 'quoted' | 'confirmed' | 'declined';

export interface CateringInquiry {
  id?: string;
  siteId: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string | null;
  companyName?: string | null;
  location?: string | null;
  eventType: EventType;
  eventDate?: string | null;
  guestCount?: number | null;
  budgetRange?: string | null;
  cuisinePreferences?: string | null;
  additionalNotes?: string | null;
  status: InquiryStatus;
}

export interface PrivateDiningInquiry {
  id?: string;
  siteId: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string | null;
  wechatId?: string | null;
  eventType: BanquetEventType;
  eventDate?: string | null;
  guestCount?: number | null;
  packageId?: string | null;
  packageName?: string | null;
  dietaryNotes?: string | null;
  budgetRange?: string | null;
  additionalNotes?: string | null;
  status: InquiryStatus;
}

// ============================================================
// Site Info (Chinese extension)
// ============================================================

export interface DimSumHours {
  open: string;
  close: string;
}

export interface SeatingCapacity {
  regular: number;
  banquet?: number;
}

export interface SiteInfoChinese extends SiteInfo {
  // Required Chinese fields
  nameZh: string;
  cuisineType: string;
  cuisineTypeZh: string;
  // Chef
  chefName?: string;
  chefNameZh?: string;
  // WeChat
  wechatQrUrl?: string | null;
  wechatAccountName?: string | null;
  // Dim Sum specifics
  dimSumHours?: DimSumHours;
  weekendBrunchHours?: DimSumHours | null;
  // Capacity
  seatingCapacity?: SeatingCapacity;
  // Parking (important for Chinese restaurant UX)
  parkingNote?: string | null;
  parkingNoteZh?: string | null;
  // Ratings
  googleRating?: number | null;
  googleReviewCount?: number | null;
  googlePlaceId?: string | null;
  yelpUrl?: string | null;
  // Locale config
  defaultLocale: 'en' | 'zh';
  enabledLocales: ('en' | 'zh')[];
}

// ============================================================
// Team
// ============================================================

export interface TeamMember {
  id: string;
  siteId: string;
  slug: string;
  name: string;
  nameZh?: string | null;
  role: string;
  roleZh?: string | null;
  bio?: string | null;
  bioZh?: string | null;
  image?: string | null;
  chefOrigin?: string | null;
  chefTraining?: string | null;
  credentials?: string[];
  sortOrder: number;
  isActive: boolean;
}

// ============================================================
// Gallery
// ============================================================

export type GalleryCategory = 'food' | 'dining-room' | 'events' | 'festivals' | 'chef';

export interface GalleryItem {
  id: string;
  siteId: string;
  image: string;
  caption?: string | null;
  captionZh?: string | null;
  category: GalleryCategory;
  altText?: string | null;
  sortOrder: number;
  isFeatured: boolean;
}

// ============================================================
// Intake schema (Pipeline B)
// ============================================================

export type ChineseVariant = 'hao-zhan' | 'hongxiang' | 'longmen' | 'shuimo';

export interface ChineseRestaurantIntake {
  clientId: string;
  templateSiteId: 'grand-pavilion';
  industry: 'chinese-restaurant';
  business: {
    name: string;
    nameZh: string;
    ownerName: string;
    ownerNameZh: string;
    ownerTitle: string;
    ownerTitleZh: string;
    chefOrigin?: string;
    chefTraining?: string;
    cuisineType: string;
    cuisineTypeZh: string;
    subType: string;
    foundedYear: number;
    tagline?: string;
    taglineZh?: string;
    teamMembers?: Partial<TeamMember>[];
  };
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    lat?: number;
    lng?: number;
    parkingNote?: string;
    parkingNoteZh?: string;
  };
  social: {
    instagram?: string;
    facebook?: string;
    yelp?: string;
    wechatAccountName?: string;
    wechatQrUrl?: string;
  };
  hours: Record<string, { open: string; close: string }>;
  dimSum: {
    enabled: boolean;
    hours?: DimSumHours;
    weekendBrunchHours?: DimSumHours;
    cartStyle?: 'traditional-cart' | 'order-sheet' | 'digital';
  };
  menu: {
    enabled: string[];
    disabled: string[];
  };
  festivals: {
    enabled: FestivalSlug[];
    disabled: FestivalSlug[];
  };
  reservations: {
    provider: 'custom' | 'opentable' | 'resy';
    opentableId?: string | null;
    resyVenueId?: string | null;
    privateDining: boolean;
    catering: boolean;
    maxPartySize?: number;
  };
  brand: {
    variant: ChineseVariant;
    overrides?: Record<string, any>;
  };
  locales: {
    enabled: ('en' | 'zh')[];
    primary: 'en' | 'zh';
    disabled?: string[];
  };
  features: {
    online_reservation: boolean;
    private_dining: boolean;
    events_section: boolean;
    blog: boolean;
    gallery: boolean;
    gift_cards: boolean;
    online_ordering: boolean;
    catering: boolean;
    careers: boolean;
    festival_pages: boolean;
    dim_sum_cart: boolean;
    chef_signatures: boolean;
    vip_membership: boolean;
  };
  seo?: {
    targetCity?: string;
    targetNeighborhood?: string;
    primaryKeyword?: string;
    zhPrimaryKeyword?: string;
  };
  voice?: 'warm-traditional-authoritative' | 'modern-energetic' | 'refined-minimal';
  domains?: {
    production?: string;
    dev?: string;
  };
}
