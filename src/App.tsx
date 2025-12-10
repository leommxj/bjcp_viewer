import { useState, useMemo } from "react";
import { BeerStyle } from "@/types";
import { useAppState } from "@/store/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { SearchBar } from "@/components/SearchBar";
import { StyleCard, StyleListItem } from "@/components/StyleViews";
import { StyleDetail } from "@/components/StyleDetail";
import { CompareDialog } from "@/components/CompareDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  groupByCategory,
  getAllTags,
  filterStyles,
} from "@/lib/data";
import bjcpData from "./bjcp_styleguide-2021.json";

const styles = bjcpData.beerjson.styles as BeerStyle[];

export default function App() {
  const { state } = useAppState();
  const [selectedStyle, setSelectedStyle] = useState<BeerStyle | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  // Memoized data processing
  const categories = useMemo(() => groupByCategory(styles), []);
  const allTags = useMemo(() => getAllTags(styles), []);

  // Filter styles based on current state
  const filteredStyles = useMemo(() => {
    // Handle favorites special case
    if (state.selectedCategory === "favorites") {
      const favoriteStyles = styles.filter((s) =>
        state.favorites.includes(s.style_id)
      );
      return filterStyles(
        favoriteStyles,
        state.searchQuery,
        null,
        state.selectedTags
      );
    }

    return filterStyles(
      styles,
      state.searchQuery,
      state.selectedCategory,
      state.selectedTags
    );
  }, [
    state.searchQuery,
    state.selectedCategory,
    state.selectedTags,
    state.favorites,
  ]);

  const handleStyleClick = (style: BeerStyle) => {
    setSelectedStyle(style);
    setDetailOpen(true);
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <Sidebar categories={categories} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search and filters */}
        <SearchBar allTags={allTags} onOpenCompare={() => setCompareOpen(true)} />

        {/* Results count */}
        <div className="px-4 py-2 text-sm text-muted-foreground border-b">
          Showing {filteredStyles.length} of {styles.length} styles
          {state.selectedCategory && state.selectedCategory !== "favorites" && (
            <span>
              {" "}
              in{" "}
              <span className="text-foreground">
                {categories.find((c) => c.id === state.selectedCategory)?.name}
              </span>
            </span>
          )}
          {state.selectedCategory === "favorites" && (
            <span className="text-foreground"> (Favorites)</span>
          )}
        </div>

        {/* Style grid/list */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {filteredStyles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No styles found matching your criteria.
              </div>
            ) : state.viewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStyles.map((style) => (
                  <StyleCard
                    key={style.style_id}
                    style={style}
                    onClick={() => handleStyleClick(style)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredStyles.map((style) => (
                  <StyleListItem
                    key={style.style_id}
                    style={style}
                    onClick={() => handleStyleClick(style)}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Detail dialog */}
      <StyleDetail
        style={selectedStyle}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />

      {/* Compare dialog */}
      <CompareDialog
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        styles={styles}
      />
    </div>
  );
}
