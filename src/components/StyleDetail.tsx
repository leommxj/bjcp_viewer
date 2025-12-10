import { BeerStyle } from "@/types";
import { useAppState } from "@/store/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Plus, Check } from "lucide-react";
import { parseTags, formatRange, getSRMColor, getAverageSRM } from "@/lib/data";
import { cn } from "@/lib/utils";

interface StyleDetailProps {
  style: BeerStyle | null;
  open: boolean;
  onClose: () => void;
}

export function StyleDetail({ style, open, onClose }: StyleDetailProps) {
  const { state, dispatch } = useAppState();

  if (!style) return null;

  const isFavorite = state.favorites.includes(style.style_id);
  const isInCompare = state.compareList.includes(style.style_id);
  const tags = parseTags(style.tags);
  const srmColor = getSRMColor(getAverageSRM(style.color));

  const handleFavoriteClick = () => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: style.style_id });
  };

  const handleCompareClick = () => {
    if (isInCompare) {
      dispatch({ type: "REMOVE_FROM_COMPARE", payload: style.style_id });
    } else {
      dispatch({ type: "ADD_TO_COMPARE", payload: style.style_id });
    }
  };

  const handleTagClick = (tag: string) => {
    dispatch({ type: "TOGGLE_TAG", payload: tag });
    onClose();
  };

  const sections = [
    { key: "overall_impression", label: "Overall Impression" },
    { key: "aroma", label: "Aroma" },
    { key: "appearance", label: "Appearance" },
    { key: "flavor", label: "Flavor" },
    { key: "mouthfeel", label: "Mouthfeel" },
    { key: "comments", label: "Comments" },
    { key: "history", label: "History" },
    { key: "style_comparison", label: "Style Comparison" },
    { key: "ingredients", label: "Characteristic Ingredients" },
    { key: "examples", label: "Commercial Examples" },
  ].filter((s) => style[s.key as keyof BeerStyle]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start gap-4">
            {/* Color bar */}
            <div
              className="w-6 h-16 rounded shrink-0"
              style={{ backgroundColor: srmColor }}
              title={`SRM: ${formatRange(style.color)}`}
            />
            <div className="flex-1">
              <DialogTitle className="text-xl">
                <span className="text-muted-foreground mr-2">{style.style_id}</span>
                {style.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {style.category}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={isFavorite ? "default" : "outline"}
                size="sm"
                onClick={handleFavoriteClick}
              >
                <Star className={cn("w-4 h-4 mr-1", isFavorite && "fill-current")} />
                {isFavorite ? "Favorited" : "Favorite"}
              </Button>
              <Button
                variant={isInCompare ? "default" : "outline"}
                size="sm"
                onClick={handleCompareClick}
                disabled={!isInCompare && state.compareList.length >= 4}
              >
                {isInCompare ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    In Compare
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1" />
                    Compare
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="stats">Vital Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 pb-6">
              {sections.map((section) => {
                const content = style[section.key as keyof BeerStyle] as string;
                return (
                  <div key={section.key}>
                    <h3 className="font-semibold text-sm text-primary mb-2">
                      {section.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {content}
                    </p>
                  </div>
                );
              })}

              {/* Entry Instructions if present */}
              {style.entry_instructions && (
                <div>
                  <h3 className="font-semibold text-sm text-primary mb-2">
                    Entry Instructions
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {style.entry_instructions}
                  </p>
                </div>
              )}

              {/* Tags */}
              <div>
                <h3 className="font-semibold text-sm text-primary mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={state.selectedTags.includes(tag) ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="pb-6">
              <div className="grid grid-cols-2 gap-6">
                <StatCard
                  label="Original Gravity (OG)"
                  value={formatRange(style.original_gravity)}
                  description="The density of the wort before fermentation"
                />
                <StatCard
                  label="Final Gravity (FG)"
                  value={formatRange(style.final_gravity)}
                  description="The density after fermentation"
                />
                <StatCard
                  label="Alcohol By Volume (ABV)"
                  value={formatRange(style.alcohol_by_volume)}
                  description="Percentage of alcohol content"
                />
                <StatCard
                  label="International Bitterness Units (IBU)"
                  value={formatRange(style.international_bitterness_units)}
                  description="Measure of hop bitterness"
                />
                <StatCard
                  label="Color (SRM)"
                  value={formatRange(style.color)}
                  description="Standard Reference Method color scale"
                  colorPreview={srmColor}
                />
              </div>

              {/* Category Description */}
              {style.category_description && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-sm text-primary mb-2">
                    Category Description
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {style.category_description}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  description: string;
  colorPreview?: string;
}

function StatCard({ label, value, description, colorPreview }: StatCardProps) {
  return (
    <div className="p-4 rounded-lg bg-muted/50">
      <div className="flex items-center gap-2">
        {colorPreview && (
          <div
            className="w-6 h-6 rounded"
            style={{ backgroundColor: colorPreview }}
          />
        )}
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-lg font-bold text-primary">{value}</div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{description}</p>
    </div>
  );
}
