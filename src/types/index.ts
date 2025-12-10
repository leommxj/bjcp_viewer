// Beer style data types based on BJCP 2021 Guidelines

export interface RangeValue {
  minimum: { unit: string; value: number };
  maximum: { unit: string; value: number };
}

export interface BeerStyle {
  name: string;
  category: string;
  category_id: string;
  style_id: string;
  category_description: string;
  overall_impression: string;
  aroma: string;
  appearance: string;
  flavor: string;
  mouthfeel: string;
  comments: string;
  history: string;
  style_comparison: string;
  tags: string;
  original_gravity: RangeValue;
  international_bitterness_units: RangeValue;
  final_gravity: RangeValue;
  alcohol_by_volume: RangeValue;
  color: RangeValue;
  ingredients: string;
  examples: string;
  style_guide: string;
  type: string;
  entry_instructions?: string;
  notes?: string;
  currently_defined_types?: string;
  strength_classifications?: string;
  vital_statistics?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  styles: BeerStyle[];
}

export type ViewMode = "card" | "list";

export interface AppState {
  searchQuery: string;
  selectedCategory: string | null;
  selectedTags: string[];
  viewMode: ViewMode;
  favorites: string[]; // style_ids
  compareList: string[]; // style_ids (max 4)
}
