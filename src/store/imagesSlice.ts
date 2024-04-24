import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Filter = {
  saturate: number;
  grayscale: number;
  contrast: number;
  brightness: number;
};

export interface ImagesState {
  id: string;
  url: string;
  filters: Filter;
}

const defaultFilters = {
  saturate: 100,
  grayscale: 0,
  brightness: 1,
  contrast: 100,
};

const initialState: {
  activeImageId: string;
  data: ImagesState[];
} = {
  activeImageId: "",
  data: [
    {
      id: "",
      url: "",
      filters: defaultFilters,
    },
  ],
};

export const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    setNewImage: (
      state,
      action: PayloadAction<{ id: string; url: string }>
    ) => {
      state.data.push({
        id: action.payload.id,
        url: action.payload.url,
        filters: defaultFilters,
      });
    },
    setActiveImage: (state, action: PayloadAction<string>) => {
      state.activeImageId = action.payload;
    },
    setFilters: (state, action: PayloadAction<Filter>) => {
      // Select current image
      const index = state.data.findIndex(
        (image) => image.id === state.activeImageId
      );
      if (index !== -1) {
        state.data[index].filters = action.payload;
      }
    },
    resetFilters: (state) => {
      const index = state.data.findIndex(
        (image) => image.id === state.activeImageId
      );
      if (index !== -1) {
        state.data[index].filters = defaultFilters;
      }
    },
  },
});

export const { setNewImage, setActiveImage, setFilters, resetFilters } =
  imagesSlice.actions;

export default imagesSlice.reducer;
