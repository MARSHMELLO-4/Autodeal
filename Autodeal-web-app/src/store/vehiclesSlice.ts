import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VehicleModel } from "../models/vehicleModel";

interface VehiclesState {
  items: VehicleModel[];
  loading: boolean;
  error: string | null;
}

const initialState: VehiclesState = {
  items: [],
  loading: false,
  error: null,
};

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    vehiclesRequested(state) {
      state.loading = true;
      state.error = null;
    },
    vehiclesReceived(state, action: PayloadAction<VehicleModel[]>) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    vehiclesRequestFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    vehicleUpserted(state, action: PayloadAction<VehicleModel>) {
      const index = state.items.findIndex(
        (vehicle) => vehicle.id === action.payload.id,
      );

      if (index >= 0) {
        state.items[index] = action.payload;
        return;
      }

      state.items.unshift(action.payload);
    },
    vehicleRemoved(state, action: PayloadAction<number>) {
      state.items = state.items.filter((vehicle) => vehicle.id !== action.payload);
    },
  },
});

export const {
  vehiclesRequested,
  vehiclesReceived,
  vehiclesRequestFailed,
  vehicleUpserted,
  vehicleRemoved,
} = vehiclesSlice.actions;

export default vehiclesSlice.reducer;
