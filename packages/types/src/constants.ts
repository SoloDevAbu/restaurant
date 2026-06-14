export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const ORDER_STATUSES = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.CANCELLED,
] as const;

export const DIET_TYPE = {
  VEG: "veg",
  NON_VEG: "non_veg",
} as const;

export const DIET_TYPES = [DIET_TYPE.VEG, DIET_TYPE.NON_VEG] as const;

export const FEATURED_TAG = {
  MUST_TRY: "must_try",
  MAIN_COURSE: "main_course",
  COMBO: "combo",
  DESSERT: "dessert",
  DRINK: "drink",
} as const;

export const FEATURED_TAGS = [
  FEATURED_TAG.MUST_TRY,
  FEATURED_TAG.MAIN_COURSE,
  FEATURED_TAG.COMBO,
  FEATURED_TAG.DESSERT,
  FEATURED_TAG.DRINK,
] as const;
