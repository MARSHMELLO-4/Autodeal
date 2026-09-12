import { useEffect, useRef } from "react";
import { getVehicle } from "../api/api-client";
import { connectInventoryWebSocket } from "../api/websockets/connect-ws";
import type { filterModel } from "../models/fIltersModels";
import type { VehicleModel } from "../models/vehicleModel";
import { useAppDispatch } from "../store/hooks";
import { vehicleRemoved, vehicleUpserted } from "../store/vehiclesSlice";
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

      getVehicle(String(event.id))
        .then((vehicle: VehicleModel) => {
          if (vehicleMatchesFilters(vehicle, filtersRef.current)) {
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
