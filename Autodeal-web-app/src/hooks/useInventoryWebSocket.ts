import { useEffect, useRef } from "react";
import { getVehicle, getVehicles } from "../api/api-client";
import { connectInventoryWebSocket } from "../api/websockets/connect-ws";
import type { filterModel } from "../models/fIltersModels";
import { DEFAULT_VEHICLE_SORT } from "../models/vehicleSort";
import { useAppDispatch } from "../store/hooks";
import {
  vehicleRemoved,
  vehiclesReceived,
  vehicleUpserted,
} from "../store/vehiclesSlice";
import { vehicleMatchesFilters } from "../utils/vehicleFilters";

export function useInventoryWebSocket(filters: filterModel, 
  setShowVehicleAddedAlert : React.Dispatch<React.SetStateAction<boolean>>) {
  const dispatch = useAppDispatch();
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    return connectInventoryWebSocket((event) => {
      if (event.type === "VEHICLE_SOLD") {
        dispatch(vehicleRemoved(event.id));
        return;
      }

      //if the event type if the vehicle added then we have to show the alert 
      if(event.type === "VEHICLE_CREATED"){
        setShowVehicleAddedAlert(true);
      }

      const activeFilters = filtersRef.current;

      if ((activeFilters.sort ?? DEFAULT_VEHICLE_SORT) !== DEFAULT_VEHICLE_SORT) {
        getVehicles(activeFilters)
          .then((res) => dispatch(vehiclesReceived(res.content || [])))
          .catch((error) => {
            console.error("Failed to refresh vehicles from inventory event:", error);
          });
        return;
      }

      getVehicle(String(event.id))
        .then((vehicle) => {
          if (vehicleMatchesFilters(vehicle, activeFilters)) {
            dispatch(vehicleUpserted(vehicle));
          } else {
            dispatch(vehicleRemoved(vehicle.id));
          }
        })
        .catch((error) => {
          console.error("Failed to refresh vehicle from inventory event:", error);
        });
    });
  }, [dispatch]);
}
