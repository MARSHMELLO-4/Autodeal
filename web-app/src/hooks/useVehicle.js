import { useEffect, useState } from "react";
import { getVehicles } from "../api";

export function useVehicle(id){

    const [vehicle,setVehicle]=useState();
    const [loading,setLoading]=useState(false);

    useEffect(()=>{

        setLoading(true);

        getVehicle(id)
        .then(res=>setVehicle(res.content))
        .finally(()=>setLoading(false));

    },[id]);

    return {vehicle,loading};

}