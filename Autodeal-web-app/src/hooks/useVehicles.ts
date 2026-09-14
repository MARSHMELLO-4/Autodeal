import { useEffect, useMemo, useState } from "react";
import { getVehicles } from "../api/api-client";
import type { filterModel } from "../models/fIltersModels";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    vehiclesReceived,
    vehiclesRequested,
    vehiclesRequestFailed,
} from "../store/vehiclesSlice";

const SEARCH_DEBOUNCE_MS = 300;

export function useVehicles(filters: filterModel){

    const dispatch = useAppDispatch();
    const vehicles = useAppSelector((state) => state.vehicles.items);
    const loading = useAppSelector((state) => state.vehicles.loading);
    const error = useAppSelector((state) => state.vehicles.error);

    /* Debounce only the search term so typing does not fire a request per
       keystroke, while category/status changes stay instant. */
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [filters.search]);

    const effectiveFilters = useMemo(
        () => ({ ...filters, search: debouncedSearch }),
        [filters, debouncedSearch],
    );

    useEffect(()=>{

        dispatch(vehiclesRequested());

        getVehicles(effectiveFilters)
        .then(res=>dispatch(vehiclesReceived(res.content || [])))
        .catch(err => dispatch(vehiclesRequestFailed(err.message || "Failed to fetch vehicles")));

    },[dispatch, effectiveFilters]);

    return {vehicles,loading, error};

}