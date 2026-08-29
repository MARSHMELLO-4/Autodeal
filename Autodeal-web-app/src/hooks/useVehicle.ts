import { useEffect, useState } from "react";
import { getVehicle } from "../api/api-client";

export function useVehicle(id : string){

    const [vehicle,setVehicle]=useState();
    const [loading,setLoading]=useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(()=>{

        setLoading(true);
        setError(null);

        getVehicle(id)
        .then(res=>setVehicle(res.content))
        .catch(err => setError(err))
        .finally(()=>setLoading(false));

    },[id]);

    return {vehicle,loading, error};

}