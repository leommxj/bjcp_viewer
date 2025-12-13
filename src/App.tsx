import { useState, useMemo, useEffect } from "react";
import { BeerStyle } from "@/types";
import { useAppState, dataSources } from "@/store/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { SearchBar } from "@/components/SearchBar";
import { StyleCard, StyleListItem } from "@/components/StyleViews";
import { StyleDetail } from "@/components/StyleDetail";
import { CompareDialog } from "@/components/CompareDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  groupByCategory,
  getAllTags,
  filterStyles,
} from "@/lib/data";

export default function App() {
  const { state } = useAppState();
  const [selectedStyle, setSelectedStyle] = useState<BeerStyle | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [styles, setStyles] = useState<BeerStyle[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data when dataSourceId changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Find source, fallback to first available if not found
        let source = dataSources.find((s) => s.id === state.dataSourceId);
        if (!source) {
          source = dataSources[0];
        }
        const response = await fetch(`./data/${source.file}`);
        const data = await response.json();
        setStyles(data.beerjson.styles as BeerStyle[]);
      } catch (e) {
        console.error("Failed to load data:", e);
        setStyles([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [state.dataSourceId]);

  // Memoized data processing
  const categories = useMemo(() => groupByCategory(styles), [styles]);
  const allTags = useMemo(() => getAllTags(styles), [styles]);

  // Filter styles based on current state
  const filteredStyles = useMemo(() => {
    return filterStyles(
      styles,
      state.searchQuery,
      state.selectedCategory,
      state.selectedTags
    );
  }, [styles, state.searchQuery, state.selectedCategory, state.selectedTags]);

  const handleStyleClick = (style: BeerStyle) => {
    setSelectedStyle(style);
    setDetailOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const currentSource = dataSources.find((s) => s.id === state.dataSourceId);

  return (
    <div className="h-screen flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar categories={categories} />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar categories={categories} onNavigate={handleSidebarClose} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search and filters */}
        <SearchBar
          allTags={allTags}
          onOpenCompare={() => setCompareOpen(true)}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        {/* Results count */}
        <div className="px-4 py-2 text-sm text-muted-foreground border-b flex items-center justify-between">
          <div>
            {loading ? (
              "Loading..."
            ) : (
              <>
                Showing {filteredStyles.length} of {styles.length} styles
                {state.selectedCategory && (
                  <span>
                    {" "}
                    in{" "}
                    <span className="text-foreground">
                      {categories.find((c) => c.id === state.selectedCategory)?.name}
                    </span>
                  </span>
                )}
              </>
            )}
          </div>
          <div className="text-xs">
            {currentSource?.name}
          </div>
        </div>

        {/* Style grid/list */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading styles...
              </div>
            ) : filteredStyles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No styles found matching your criteria.
              </div>
            ) : state.viewMode === "card" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStyles.map((style, index) => (
                  <StyleCard
                    key={`${style.style_id}-${index}`}
                    style={style}
                    onClick={() => handleStyleClick(style)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredStyles.map((style, index) => (
                  <StyleListItem
                    key={`${style.style_id}-${index}`}
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
