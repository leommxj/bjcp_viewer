import { BeerStyle } from "@/types";
import { useAppState } from "@/store/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Trash2 } from "lucide-react";
import { formatRange, getSRMColor, getAverageSRM } from "@/lib/data";

interface CompareDialogProps {
  open: boolean;
  onClose: () => void;
  styles: BeerStyle[];
}

export function CompareDialog({ open, onClose, styles }: CompareDialogProps) {
  const { state, dispatch } = useAppState();

  const compareStyles = state.compareList
    .map((id) => styles.find((s) => s.style_id === id))
    .filter(Boolean) as BeerStyle[];

  const handleRemove = (styleId: string) => {
    dispatch({ type: "REMOVE_FROM_COMPARE", payload: styleId });
  };

  const handleClearAll = () => {
    dispatch({ type: "CLEAR_COMPARE" });
  };

  const compareFields = [
    { key: "overall_impression", label: "Overall Impression" },
    { key: "aroma", label: "Aroma" },
    { key: "appearance", label: "Appearance" },
    { key: "flavor", label: "Flavor" },
    { key: "mouthfeel", label: "Mouthfeel" },
    { key: "ingredients", label: "Ingredients" },
    { key: "examples", label: "Commercial Examples" },
  ];

  const statsFields = [
    { key: "alcohol_by_volume", label: "ABV" },
    { key: "international_bitterness_units", label: "IBU" },
    { key: "original_gravity", label: "OG" },
    { key: "final_gravity", label: "FG" },
    { key: "color", label: "SRM" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Compare Beer Styles</DialogTitle>
            {compareStyles.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearAll}>
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </DialogHeader>

        {compareStyles.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No styles selected for comparison.
            <br />
            Click the + button on style cards to add them.
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="min-w-[800px]">
              {/* Header row */}
              <div className="grid gap-4 sticky top-0 bg-background z-10 pb-4 border-b"
                   style={{ gridTemplateColumns: `150px repeat(${compareStyles.length}, 1fr)` }}>
                <div></div>
                {compareStyles.map((style) => (
                  <div key={style.style_id} className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-1 -right-1 h-6 w-6"
                      onClick={() => handleRemove(style.style_id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-8 rounded shrink-0"
                        style={{ backgroundColor: getSRMColor(getAverageSRM(style.color)) }}
                      />
                      <div>
                        <div className="font-semibold text-sm">
                          {style.style_id} {style.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {style.category}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats comparison */}
              <div className="py-4 border-b">
                <h3 className="font-semibold mb-3">Vital Statistics</h3>
                {statsFields.map((field) => (
                  <div
                    key={field.key}
                    className="grid gap-4 py-2"
                    style={{ gridTemplateColumns: `150px repeat(${compareStyles.length}, 1fr)` }}
                  >
                    <div className="text-sm font-medium text-muted-foreground">
                      {field.label}
                    </div>
                    {compareStyles.map((style) => (
                      <div key={style.style_id} className="text-sm">
                        {formatRange(style[field.key as keyof BeerStyle] as any)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Detailed comparison */}
              {compareFields.map((field) => (
                <div key={field.key} className="py-4 border-b last:border-0">
                  <h3 className="font-semibold mb-3">{field.label}</h3>
                  <div
                    className="grid gap-4"
                    style={{ gridTemplateColumns: `repeat(${compareStyles.length}, 1fr)` }}
                  >
                    {compareStyles.map((style) => (
                      <div key={style.style_id} className="text-sm text-muted-foreground">
                        {(style[field.key as keyof BeerStyle] as string) || "N/A"}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
