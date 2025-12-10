import { BeerStyle } from "@/types";
import { useAppState } from "@/store/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Plus, Check } from "lucide-react";
import { parseTags, formatRange, getSRMColor, getAverageSRM } from "@/lib/data";
import { cn } from "@/lib/utils";

interface StyleCardProps {
  style: BeerStyle;
  onClick: () => void;
}

export function StyleCard({ style, onClick }: StyleCardProps) {
  const { state, dispatch } = useAppState();
  const isFavorite = state.favorites.includes(style.style_id);
  const isInCompare = state.compareList.includes(style.style_id);
  const tags = parseTags(style.tags).slice(0, 4);
  const srmColor = getSRMColor(getAverageSRM(style.color));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "TOGGLE_FAVORITE", payload: style.style_id });
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCompare) {
      dispatch({ type: "REMOVE_FROM_COMPARE", payload: style.style_id });
    } else {
      dispatch({ type: "ADD_TO_COMPARE", payload: style.style_id });
    }
  };

  return (
    <Card
      className="cursor-pointer hover:border-primary transition-colors group"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Color indicator */}
            <div
              className="w-4 h-8 rounded shrink-0"
              style={{ backgroundColor: srmColor }}
              title={`SRM: ${formatRange(style.color)}`}
            />
            <div>
              <CardTitle className="text-base leading-tight">
                <span className="text-muted-foreground mr-1">{style.style_id}</span>
                {style.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{style.category}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", isFavorite && "text-yellow-500")}
              onClick={handleFavoriteClick}
            >
              <Star className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", isInCompare && "text-primary")}
              onClick={handleCompareClick}
              disabled={!isInCompare && state.compareList.length >= 4}
            >
              {isInCompare ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {style.overall_impression}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div>
            <span className="text-muted-foreground">ABV:</span>{" "}
            {formatRange(style.alcohol_by_volume)}
          </div>
          <div>
            <span className="text-muted-foreground">IBU:</span>{" "}
            {formatRange(style.international_bitterness_units)}
          </div>
          <div>
            <span className="text-muted-foreground">OG:</span>{" "}
            {formatRange(style.original_gravity)}
          </div>
          <div>
            <span className="text-muted-foreground">FG:</span>{" "}
            {formatRange(style.final_gravity)}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs py-0">
              {tag}
            </Badge>
          ))}
          {parseTags(style.tags).length > 4 && (
            <Badge variant="outline" className="text-xs py-0">
              +{parseTags(style.tags).length - 4}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface StyleListItemProps {
  style: BeerStyle;
  onClick: () => void;
}

export function StyleListItem({ style, onClick }: StyleListItemProps) {
  const { state, dispatch } = useAppState();
  const isFavorite = state.favorites.includes(style.style_id);
  const isInCompare = state.compareList.includes(style.style_id);
  const srmColor = getSRMColor(getAverageSRM(style.color));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "TOGGLE_FAVORITE", payload: style.style_id });
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCompare) {
      dispatch({ type: "REMOVE_FROM_COMPARE", payload: style.style_id });
    } else {
      dispatch({ type: "ADD_TO_COMPARE", payload: style.style_id });
    }
  };

  return (
    <div
      className="flex items-center gap-4 p-3 border rounded-lg cursor-pointer hover:border-primary transition-colors"
      onClick={onClick}
    >
      {/* Color indicator */}
      <div
        className="w-3 h-10 rounded shrink-0"
        style={{ backgroundColor: srmColor }}
      />

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium">
          <span className="text-muted-foreground mr-1">{style.style_id}</span>
          {style.name}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {style.category}
        </p>
      </div>

      {/* Stats */}
      <div className="hidden md:flex gap-4 text-xs text-muted-foreground">
        <div className="w-20">ABV: {formatRange(style.alcohol_by_volume)}</div>
        <div className="w-20">IBU: {formatRange(style.international_bitterness_units)}</div>
      </div>

      {/* Actions */}
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isFavorite && "text-yellow-500")}
          onClick={handleFavoriteClick}
        >
          <Star className={cn("w-4 h-4", isFavorite && "fill-current")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isInCompare && "text-primary")}
          onClick={handleCompareClick}
          disabled={!isInCompare && state.compareList.length >= 4}
        >
          {isInCompare ? (
            <Check className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
