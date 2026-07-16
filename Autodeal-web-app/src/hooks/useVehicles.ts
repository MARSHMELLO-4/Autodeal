import { useEffect, useState } from "react";
import { getVehicles } from "../api/api-client";

export function useVehicles(filters : any){

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