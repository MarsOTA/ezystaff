
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface UseOperatorAttendanceProps {
  eventId: number;
}

export const useOperatorAttendance = ({ eventId }: UseOperatorAttendanceProps) => {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [locationStatus, setLocationStatus] = useState<"checking" | "valid" | "invalid" | "error">("checking");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);

  useEffect(() => {
    // Simula il controllo della posizione
    setLoadingLocation(true);
    setTimeout(() => {
      setLocationStatus("valid");
      setLocationAccuracy(15); // metri
      setLoadingLocation(false);
    }, 2000);
  }, []);

  const handleCheckAction = async () => {
    try {
      setIsCheckingIn(true);
      
      // Simula il check-in/out
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const now = new Date();
      setLastCheckTime(now);
      
      if (lastCheckTime) {
        toast.success("Check-out effettuato con successo!");
      } else {
        toast.success("Check-in effettuato con successo!");
      }
      
    } catch (error) {
      toast.error("Errore durante il check-in/out");
    } finally {
      setIsCheckingIn(false);
    }
  };

  return {
    isCheckingIn,
    locationStatus,
    loadingLocation,
    lastCheckTime,
    locationAccuracy,
    handleCheckAction
  };
};
