import { useEffect, useState } from "react";
import { getVehicles } from "../api";

export function useVehicles(filters){

    const [vehicles,setVehicles]=useState([]);
    const [loading,setLoading]=useState(false);

    useEffect(()=>{

        setLoading(true);

        getVehicles(filters)
        .then(res=>setVehicles(res.content))
        .finally(()=>setLoading(false));

    },[filters]);

    return {vehicles,loading};

}