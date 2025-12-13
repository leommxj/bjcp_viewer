import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { AppState, ViewMode, DataSource } from "@/types";

const STORAGE_KEY = "bjcp-viewer-state";

// Available data sources
export const dataSources: DataSource[] = [
  {
    id: "bjcp_2021_beer_v1.25",
    name: "BJCP 2021 Beer",
    file: "bjcp_2021_beer.json",
    description: "Beer Judge Certification Program 2021 Beer Style Guidelines v1.25. Data Source: <a href='https://github.com/leommxj/bjcp_beerjson_converter' target='_blank' rel='noopener noreferrer'>bjcp_beerjson_converter</a>",
  },
  {
    id: "bjcp_2021_beer_beerjson",
    name: "BJCP 2021 Beer From beerjson/bjcp-json",
    file: "bjcp_styleguide-2021.json",
    description: "Beer Judge Certification Program 2021 Beer Style Guidelines. Data Source: <a href='https://github.com/beerjson/bjcp-json' target='_blank' rel='noopener noreferrer'>beerjson/bjcp-json</a>",
  },
  {
    id: "bjcp_2015_beer",
    name: "BJCP 2015 Beer",
    file: "bjcp_2015_beer.json",
    description: "Beer Judge Certification Program 2015 Beer Style Guidelines. Data Source: <a href='https://github.com/leommxj/bjcp_beerjson_converter' target='_blank' rel='noopener noreferrer'>bjcp_beerjson_converter</a>",
  },
  {
    id: "bjcp_2015_mead",
    name: "BJCP 2015 Mead",
    file: "bjcp_2015_mead.json",
    description: "Beer Judge Certification Program 2015 Mead Style Guidelines. Data Source: <a href='https://github.com/leommxj/bjcp_beerjson_converter' target='_blank' rel='noopener noreferrer'>bjcp_beerjson_converter</a>",
  },
  {
    id: "bjcp_2015_cider",
    name: "BJCP 2015 Cider",
    file: "bjcp_2015_cider.json",
    description: "Beer Judge Certification Program 2015 Cider Style Guidelines. Data Source: <a href='https://github.com/leommxj/bjcp_beerjson_converter' target='_blank' rel='noopener noreferrer'>bjcp_beerjson_converter</a>",
  },
  {
    id: "bjcp_2025_cider",
    name: "BJCP 2025 Cider",
    file: "bjcp_2025_cider.json",
    description: "Beer Judge Certification Program 2025 Cider Style Guidelines. Data Source: <a href='https://github.com/leommxj/bjcp_beerjson_converter' target='_blank' rel='noopener noreferrer'>bjcp_beerjson_converter</a>",
  },
];

const DEFAULT_DATA_SOURCE = "bjcp_2021_beer_v1.25";

const initialState: AppState = {
  searchQuery: "",
  selectedCategory: null,
  selectedTags: [],
  viewMode: "card",
  compareList: [],
  dataSourceId: DEFAULT_DATA_SOURCE,
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_CATEGORY"; payload: string | null }
  | { type: "SET_TAGS"; payload: string[] }
  | { type: "TOGGLE_TAG"; payload: string }
  | { type: "SET_VIEW_MODE"; payload: ViewMode }
  | { type: "ADD_TO_COMPARE"; payload: string }
  | { type: "REMOVE_FROM_COMPARE"; payload: string }
  | { type: "CLEAR_COMPARE" }
  | { type: "CLEAR_FILTERS" }
  | { type: "SET_DATA_SOURCE"; payload: string }
  | { type: "LOAD_STATE"; payload: Partial<AppState> };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_TAGS":
      return { ...state, selectedTags: action.payload };
    case "TOGGLE_TAG": {
      const tags = state.selectedTags.includes(action.payload)
        ? state.selectedTags.filter((t) => t !== action.payload)
        : [...state.selectedTags, action.payload];
      return { ...state, selectedTags: tags };
    }
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "ADD_TO_COMPARE": {
      if (state.compareList.length >= 4) return state;
      if (state.compareList.includes(action.payload)) return state;
      return { ...state, compareList: [...state.compareList, action.payload] };
    }
    case "REMOVE_FROM_COMPARE":
      return {
        ...state,
        compareList: state.compareList.filter((id) => id !== action.payload),
      };
    case "CLEAR_COMPARE":
      return { ...state, compareList: [] };
    case "CLEAR_FILTERS":
      return {
        ...state,
        searchQuery: "",
        selectedCategory: null,
        selectedTags: [],
      };
    case "SET_DATA_SOURCE":
      // Reset filters when changing data source
      return {
        ...state,
        dataSourceId: action.payload,
        searchQuery: "",
        selectedCategory: null,
        selectedTags: [],
        compareList: [],
      };
    case "LOAD_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load persisted state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({
          type: "LOAD_STATE",
          payload: {
            viewMode: parsed.viewMode || "card",
            dataSourceId: parsed.dataSourceId || DEFAULT_DATA_SOURCE,
          },
        });
      }
    } catch (e) {
      console.error("Failed to load state:", e);
    }
  }, []);

  // Persist viewMode and dataSourceId
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          viewMode: state.viewMode,
          dataSourceId: state.dataSourceId,
        })
      );
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  }, [state.viewMode, state.dataSourceId]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within AppProvider");
  }
  return context;
}
