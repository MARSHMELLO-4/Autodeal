import { useEffect, useState } from "react";
import { getVehicles } from "../api/api-client";

export function useVehicles(filters : any){

    const [vehicles,setVehicles]=useState([]);
    const [loading,setLoading]=useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(()=>{

        setLoading(true);
        setError(null);

        getVehicles(filters)
        .then(res=>setVehicles(res.content))
        .catch(err => setError(err))
        .finally(()=>setLoading(false));

    },[filters]);

    return {vehicles,loading, error};

}