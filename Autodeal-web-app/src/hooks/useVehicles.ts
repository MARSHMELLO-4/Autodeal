import { useEffect } from "react";
import { getVehicles } from "../api/api-client";
import type { filterModel } from "../models/fIltersModels";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    vehiclesReceived,
    vehiclesRequested,
    vehiclesRequestFailed,
} from "../store/vehiclesSlice";

export function useVehicles(filters : filterModel){

    const dispatch = useAppDispatch();
    const vehicles = useAppSelector((state) => state.vehicles.items);
    const loading = useAppSelector((state) => state.vehicles.loading);
    const error = useAppSelector((state) => state.vehicles.error);

    useEffect(()=>{

        dispatch(vehiclesRequested());

        getVehicles(filters)
        .then(res=>dispatch(vehiclesReceived(res.content || [])))
        .catch(err => dispatch(vehiclesRequestFailed(err.message || "Failed to fetch vehicles")));

    },[dispatch, filters]);

    return {vehicles,loading, error};

}
