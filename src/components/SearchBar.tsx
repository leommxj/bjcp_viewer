import { useState } from "react";
import { useAppState } from "@/store/AppContext";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X, LayoutGrid, List, GitCompare, Menu, ChevronDown, ChevronUp } from "lucide-react";

interface SearchBarProps {
  allTags: string[];
  onOpenCompare: () => void;
  onOpenSidebar: () => void;
}

export function SearchBar({ allTags, onOpenCompare, onOpenSidebar }: SearchBarProps) {
  const { state, dispatch } = useAppState();
  const [tagsExpanded, setTagsExpanded] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_SEARCH", payload: e.target.value });
  };

  const handleTagClick = (tag: string) => {
    dispatch({ type: "TOGGLE_TAG", payload: tag });
  };

  const handleClearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" });
  };

  const hasActiveFilters =
    state.searchQuery || state.selectedTags.length > 0 || state.selectedCategory;

  return (
    <div className="border-b bg-card p-3 md:p-4 space-y-3">
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0"
          onClick={onOpenSidebar}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search styles..."
            value={state.searchQuery}
            onChange={handleSearchChange}
            className="pl-9"
          />
          {state.searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => dispatch({ type: "SET_SEARCH", payload: "" })}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="hidden sm:flex items-center border rounded-md">
          <Button
            variant={state.viewMode === "card" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-r-none"
            onClick={() => dispatch({ type: "SET_VIEW_MODE", payload: "card" })}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={state.viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-l-none"
            onClick={() => dispatch({ type: "SET_VIEW_MODE", payload: "list" })}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        {/* Compare Button */}
        <Button
          variant={state.compareList.length > 0 ? "default" : "outline"}
          size="sm"
          onClick={onOpenCompare}
          disabled={state.compareList.length === 0}
          className="shrink-0"
        >
          <GitCompare className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Compare ({state.compareList.length})</span>
          <span className="sm:hidden">{state.compareList.length}</span>
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="hidden sm:flex">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Tags */}
      <div className="relative">
        {tagsExpanded ? (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={state.selectedTags.includes(tag) ? "default" : "outline"}
                onClick={() => handleTagClick(tag)}
                className="cursor-pointer"
              >
                {tag}
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTagsExpanded(false)}
              className="h-6 px-2 text-xs"
            >
              <ChevronUp className="w-3 h-3 mr-1" />
              Collapse
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1 overflow-x-auto scrollbar-thin">
              <div className="flex gap-2 pb-1">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={state.selectedTags.includes(tag) ? "default" : "outline"}
                    onClick={() => handleTagClick(tag)}
                    className="shrink-0 cursor-pointer"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTagsExpanded(true)}
              className="shrink-0 h-6 px-2 text-xs"
            >
              <ChevronDown className="w-3 h-3 mr-1" />
              Expand
            </Button>
          </div>
        )}
      </div>

      {/* Active Tag Filters */}
      {state.selectedTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {state.selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="default"
              onClick={() => handleTagClick(tag)}
              className="gap-1 cursor-pointer"
            >
              {tag}
              <X className="w-3 h-3" />
            </Badge>
          ))}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="sm:hidden h-6 px-2 text-xs">
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
