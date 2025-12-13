import { Category } from "@/types";
import { useAppState, dataSources } from "@/store/AppContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronRight, Beer, Database, Github } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  categories: Category[];
  onNavigate?: () => void;
}

export function Sidebar({ categories, onNavigate }: SidebarProps) {
  const { state, dispatch } = useAppState();

  const handleCategoryClick = (categoryId: string | null) => {
    dispatch({ type: "SET_CATEGORY", payload: categoryId });
    onNavigate?.();
  };

  const handleDataSourceChange = (sourceId: string) => {
    dispatch({ type: "SET_DATA_SOURCE", payload: sourceId });
  };

  const currentSource = dataSources.find((s) => s.id === state.dataSourceId);
  const totalStyles = categories.reduce((sum, c) => sum + c.styles.length, 0);

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-full">
      {/* Data Source Selector */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Data Source</span>
        </div>
        <select
          value={state.dataSourceId}
          onChange={(e) => handleDataSourceChange(e.target.value)}
          className="w-full px-2 py-1.5 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {dataSources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Beer className="w-5 h-5 text-primary" />
          {currentSource?.name || "BJCP Styles"}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {totalStyles} Styles
        </p>
        {currentSource?.description && (
          <p
            className="text-xs text-muted-foreground mt-2 leading-relaxed [&_a]:text-primary [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: currentSource.description }}
          />
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* All Styles */}
          <Button
            variant={state.selectedCategory === null ? "secondary" : "ghost"}
            className="w-full justify-start mb-2"
            onClick={() => handleCategoryClick(null)}
          >
            <span className="truncate">All Styles</span>
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

      {/* Footer */}
      <div className="p-3 border-t">
        <a
          href="https://github.com/leommxj/bjcp_viewer"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="w-4 h-4" />
          <span>Source Code</span>
        </a>
      </div>
    </aside>
  );
}
