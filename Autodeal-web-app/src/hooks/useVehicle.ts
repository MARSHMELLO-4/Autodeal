import { useEffect, useState } from "react";
import { getVehicle } from "../api/api-client";

export function useVehicle(id: string) {
    const [vehicle, setVehicle] = useState<unknown>(undefined);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let active = true;

        getVehicle(id)
            .then((res) => {
                if (active) setVehicle(res.content);
            })
            .catch((err) => {
                if (active) {
                    setError(err instanceof Error ? err : new Error(String(err)));
                }
            });

        return () => {
            active = false;
        };
    }, [id]);

    const loading = !error && vehicle === undefined;

    return { vehicle, loading, error };
}