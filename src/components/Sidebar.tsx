import { Category } from "@/types";
import { useAppState } from "@/store/AppContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronRight, Beer, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  categories: Category[];
}

export function Sidebar({ categories }: SidebarProps) {
  const { state, dispatch } = useAppState();

  const handleCategoryClick = (categoryId: string | null) => {
    dispatch({ type: "SET_CATEGORY", payload: categoryId });
  };

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Beer className="w-5 h-5 text-primary" />
          BJCP 2021
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {categories.reduce((sum, c) => sum + c.styles.length, 0)} Beer Styles
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* All Styles */}
          <Button
            variant={state.selectedCategory === null ? "secondary" : "ghost"}
            className="w-full justify-start mb-1"
            onClick={() => handleCategoryClick(null)}
          >
            <span className="truncate">All Styles</span>
          </Button>

          {/* Favorites */}
          <Button
            variant={state.selectedCategory === "favorites" ? "secondary" : "ghost"}
            className="w-full justify-start mb-2"
            onClick={() => handleCategoryClick("favorites")}
          >
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            <span className="truncate">Favorites</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {state.favorites.length}
            </span>
          </Button>

          <div className="border-t my-2" />

          {/* Categories */}
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={state.selectedCategory === category.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start mb-1 h-auto py-2",
                state.selectedCategory === category.id && "bg-secondary"
              )}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="flex items-center w-full">
                <span className="text-xs text-muted-foreground w-6 shrink-0">
                  {category.id}
                </span>
                <span className="truncate flex-1 text-left text-sm">
                  {category.name}
                </span>
                <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
