import { BeerStyle, Category, RangeValue } from "@/types";

// Parse tags string into array
export function parseTags(tags: string): string[] {
  if (!tags) return [];
  return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
}

// Get all unique tags from styles
export function getAllTags(styles: BeerStyle[]): string[] {
  const tagSet = new Set<string>();
  styles.forEach((style) => {
    parseTags(style.tags).forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

// Group styles by category
export function groupByCategory(styles: BeerStyle[]): Category[] {
  const categoryMap = new Map<string, Category>();

  styles.forEach((style) => {
    const key = style.category_id;
    if (!categoryMap.has(key)) {
      categoryMap.set(key, {
        id: style.category_id,
        name: style.category,
        description: style.category_description,
        styles: [],
      });
    }
    categoryMap.get(key)!.styles.push(style);
  });

  return Array.from(categoryMap.values()).sort(
    (a, b) => parseInt(a.id) - parseInt(b.id)
  );
}

// Format range value for display
export function formatRange(range: RangeValue | undefined): string {
  if (!range) return "N/A";
  const min = range.minimum.value;
  const max = range.maximum.value;
  const unit = range.minimum.unit;
  return `${min} - ${max} ${unit}`;
}

// Search styles by query
function searchStyles(styles: BeerStyle[], query: string): BeerStyle[] {
  if (!query.trim()) return styles;
  const lowerQuery = query.toLowerCase();

  return styles.filter((style) => {
    const searchableFields = [
      style.name,
      style.category,
      style.style_id,
      style.overall_impression,
      style.aroma,
      style.appearance,
      style.flavor,
      style.mouthfeel,
      style.comments,
      style.history,
      style.style_comparison,
      style.tags,
      style.ingredients,
      style.examples,
    ];

    return searchableFields.some(
      (field) => field && field.toLowerCase().includes(lowerQuery)
    );
  });
}

// Filter styles by tags
function filterByTags(styles: BeerStyle[], tags: string[]): BeerStyle[] {
  if (tags.length === 0) return styles;

  return styles.filter((style) => {
    const styleTags = parseTags(style.tags);
    return tags.every((tag) => styleTags.includes(tag));
  });
}

// Filter styles by category
function filterByCategory(
  styles: BeerStyle[],
  categoryId: string | null
): BeerStyle[] {
  if (!categoryId) return styles;
  return styles.filter((style) => style.category_id === categoryId);
}

// Combined filter function
export function filterStyles(
  styles: BeerStyle[],
  query: string,
  categoryId: string | null,
  tags: string[]
): BeerStyle[] {
  let result = styles;
  result = filterByCategory(result, categoryId);
  result = filterByTags(result, tags);
  result = searchStyles(result, query);
  return result;
}

// Get SRM color (approximate)
export function getSRMColor(srm: number): string {
  const srmColors: { [key: number]: string } = {
    1: "#FFE699",
    2: "#FFD878",
    3: "#FFCA5A",
    4: "#FFBF42",
    5: "#FBB123",
    6: "#F8A600",
    7: "#F39C00",
    8: "#EA8F00",
    9: "#E58500",
    10: "#DE7C00",
    11: "#D77200",
    12: "#CF6900",
    13: "#CB6200",
    14: "#C35900",
    15: "#BB5100",
    16: "#B54C00",
    17: "#B04500",
    18: "#A63E00",
    19: "#A13700",
    20: "#9B3200",
    21: "#952D00",
    22: "#8E2900",
    23: "#882300",
    24: "#821E00",
    25: "#7B1A00",
    26: "#771900",
    27: "#701400",
    28: "#6A0E00",
    29: "#660D00",
    30: "#5E0B00",
    31: "#5A0A02",
    32: "#560A05",
    33: "#520907",
    34: "#4C0505",
    35: "#470606",
    36: "#440607",
    37: "#3F0708",
    38: "#3B0607",
    39: "#3A0607",
    40: "#360607",
  };

  const clampedSRM = Math.min(40, Math.max(1, Math.round(srm)));
  return srmColors[clampedSRM] || srmColors[40];
}

// Get average SRM from range
export function getAverageSRM(color: RangeValue | undefined): number {
  if (!color) return 10;
  return (color.minimum.value + color.maximum.value) / 2;
}
