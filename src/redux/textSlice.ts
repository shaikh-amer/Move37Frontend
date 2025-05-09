import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { displayFormat } from "@/lib/displayItem";
import { DisplayItem, Scene } from "@/types/types";
import { getInitialScenes } from "./screenSlice";

// Define the state interface
interface TextState {
  // We'll store each new DisplayItem in an array
  displayItems: DisplayItem[];
  selectedScene?: Scene | null;
  selectedSceneIndex: number;
  selectedTextIndex: number | null;
  currentText: string;
}

// Initial state with an empty array of display items
const initialState: TextState = {
  displayItems: [],
  selectedScene:
    getInitialScenes()?.scenesSettings?.[0] || getInitialScenes()?.[0],
  selectedSceneIndex: 0,
  selectedTextIndex: null,
  currentText: "",
};

const textSlice = createSlice({
  name: "text",
  initialState,
  reducers: {
    // Reducer that accepts a string payload (the user text)
    // It creates a new DisplayItem by cloning the base displayFormat object,
    // updates the first text line with the user text, and pushes it into displayItems.

    addTextDisplayItem(state, action: PayloadAction<string>) {
      const userText = action.payload;
      // Deep clone the base displayFormat object to avoid mutating the original.
      const newDisplayItem: DisplayItem = JSON.parse(
        JSON.stringify(displayFormat),
      );

      // Update the text_lines[0].text with the user-provided text.
      if (newDisplayItem.text_lines && newDisplayItem.text_lines.length > 0) {
        newDisplayItem.text_lines[0].text = userText;
      }

      // Push the updated display item into the state's array.
      state.displayItems.push(newDisplayItem);
    },
    setSelectedScreen(state, action: PayloadAction<Scene | null>) {
      state.selectedScene = action.payload;
    },
    setSelectedSceneIndex(state, action: PayloadAction<number>) {
      state.selectedSceneIndex = action.payload;
    },
    setSelectedTextIndex(state, action: PayloadAction<number | null>) {
      state.selectedTextIndex = action.payload;
    },
    setCurrentText(state, action: PayloadAction<string>) {
      state.currentText = action.payload;
    },
    clearCurrentText: (state) => {
      state.currentText = "";
      state.selectedTextIndex = null;
    },
  },
});

export const {
  addTextDisplayItem,
  setSelectedSceneIndex,
  setSelectedScreen,
  setSelectedTextIndex,
  setCurrentText,
  clearCurrentText,
} = textSlice.actions;
export default textSlice.reducer;
