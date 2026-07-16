import { useEffect, useState } from "react";
import { getVehicle } from "../api/api-client";

export function useVehicle(id : string){

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