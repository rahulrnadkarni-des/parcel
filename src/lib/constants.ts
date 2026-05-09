export const BAG_TYPES = [
  { value: "PAPER_BAG", label: "Paper bag" },
  { value: "PLASTIC_BAG", label: "Plastic bag" },
  { value: "CARDBOARD_BOX", label: "Cardboard box" },
  { value: "THERMAL_BAG", label: "Thermal bag" },
  { value: "ECO_BAG", label: "Eco / cloth bag" },
  { value: "MULTIPLE_PIECES", label: "Multiple pieces" },
] as const;

export const PACKAGING_COLORS = [
  { value: "WHITE", label: "White" },
  { value: "BROWN", label: "Brown" },
  { value: "BLACK", label: "Black" },
  { value: "RED", label: "Red" },
  { value: "BLUE", label: "Blue" },
  { value: "GREEN", label: "Green" },
  { value: "YELLOW", label: "Yellow" },
  { value: "ORANGE", label: "Orange" },
  { value: "PURPLE", label: "Purple" },
  { value: "GREY", label: "Grey" },
  { value: "KRAFT", label: "Kraft (natural brown)" },
  { value: "OTHER", label: "Other" },
] as const;

export const BRANDING_STYLES = [
  { value: "MINIMALIST", label: "Minimalist" },
  { value: "COLORFUL", label: "Colorful / bold" },
  { value: "PLAIN", label: "Plain / no design" },
  { value: "PREMIUM", label: "Premium / glossy" },
  { value: "UNBRANDED", label: "Unbranded" },
] as const;

export const DISTINCTIVE_TAGS = [
  { value: "logo_printed", label: "Logo printed on bag" },
  { value: "branded_tape", label: "Branded tape / seal" },
  { value: "color_stripe", label: "Color stripe" },
  { value: "sticker_seal", label: "Sticker seal" },
  { value: "window_cutout", label: "Window cutout" },
  { value: "stapled_top", label: "Stapled top" },
  { value: "drawstring", label: "Drawstring" },
  { value: "handles", label: "Handles" },
  { value: "no_markings", label: "No distinctive markings" },
] as const;

export const BANGALORE_AREAS = [
  { value: "koramangala", label: "Koramangala" },
  { value: "hsr-layout", label: "HSR Layout" },
  { value: "indiranagar", label: "Indiranagar" },
  { value: "whitefield", label: "Whitefield" },
  { value: "electronic-city", label: "Electronic City" },
  { value: "mg-road", label: "MG Road" },
  { value: "marathahalli", label: "Marathahalli" },
  { value: "bellandur", label: "Bellandur" },
  { value: "sarjapur-road", label: "Sarjapur Road" },
  { value: "hebbal", label: "Hebbal" },
] as const;

export type BagTypeValue = (typeof BAG_TYPES)[number]["value"];
export type PackagingColorValue = (typeof PACKAGING_COLORS)[number]["value"];
export type BrandingStyleValue = (typeof BRANDING_STYLES)[number]["value"];
export type DistinctiveTagValue = (typeof DISTINCTIVE_TAGS)[number]["value"];
export type AreaSlug = (typeof BANGALORE_AREAS)[number]["value"];
