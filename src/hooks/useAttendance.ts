import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { safeLocalStorage } from "@/utils/fileUtils";

interface CheckRecord {
  operatorId: string;
  timestamp: string;
  type: "check-in" | "check-out";
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  eventId: number;
}

interface UseAttendanceProps {
  eventId: number;
}

const ATTENDANCE_RECORDS_KEY = "attendance_records";

export const useAttendance = ({ eventId }: UseAttendanceProps) => {
  const { user } = useAuth();
  const [isCheckingIn, setIsCheckingIn] = useState(true);
  const [locationStatus, setLocationStatus] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [locationRetries, setLocationRetries] = useState(0);

  useEffect(() => {
    // Check if there was a recent check-in to determine button state
    if (!user) return;
    
    const attendanceRecords = getAttendanceRecords();
    const userRecords = attendanceRecords.filter(record => 
      record.operatorId === user.email && 
      record.eventId === eventId &&
      new Date(record.timestamp).toDateString() === new Date().toDateString()
    );
    
    if (userRecords.length > 0) {
      const lastRecord = userRecords[userRecords.length - 1];
      setIsCheckingIn(lastRecord.type === "check-out");
      setLastCheckTime(new Date(lastRecord.timestamp));
    }
  }, [user, eventId]);
  
  const getAttendanceRecords = (): CheckRecord[] => {
    const records = safeLocalStorage.getItem(ATTENDANCE_RECORDS_KEY);
    return records ? JSON.parse(records) : [];
  };
  
  const saveAttendanceRecord = (record: CheckRecord) => {
    const records = getAttendanceRecords();
    records.push(record);
    safeLocalStorage.setItem(ATTENDANCE_RECORDS_KEY, JSON.stringify(records));
  };
  
  const getHighAccuracyPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };
      
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };
  
  const handleCheckAction = async () => {
    if (!user) return;
    
    setLoadingLocation(true);
    setLocationStatus("Rilevamento posizione in corso...");
    setLocationRetries(0);
    
    try {
      // Try to get high accuracy position with retry mechanism
      let position: GeolocationPosition;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          position = await getHighAccuracyPosition();
          
          // If accuracy is good enough, break the loop
          if (position.coords.accuracy < 50) {
            break;
          }
          
          // Otherwise, try again
          attempts++;
          setLocationRetries(attempts);
          setLocationStatus(`Miglioramento precisione (tentativo ${attempts}/${maxAttempts})...`);
          
          // Wait briefly before trying again
          await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
          console.error("Error in location attempt:", error);
          attempts++;
          setLocationRetries(attempts);
          setLocationStatus(`Tentativo di localizzazione ${attempts}/${maxAttempts}...`);
        }
      }
      
      // Get the position one more time for final attempt
      position = await getHighAccuracyPosition();
      setLocationAccuracy(position.coords.accuracy);
      
      const type = isCheckingIn ? "check-in" : "check-out";
      const timestamp = new Date().toISOString();
      
      const record: CheckRecord = {
        operatorId: user.email,
        timestamp,
        type,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        },
        eventId
      };
      
      saveAttendanceRecord(record);
      setIsCheckingIn(!isCheckingIn);
      setLastCheckTime(new Date(timestamp));
      setLoadingLocation(false);
      
      // Show accuracy information in the success message
      const accuracyText = position.coords.accuracy <= 10 ? "Alta" : 
                         position.coords.accuracy <= 50 ? "Media" : "Bassa";
      
      toast.success(`${type === "check-in" ? "Check-in" : "Check-out"} effettuato con successo (Precisione: ${accuracyText}, ${Math.round(position.coords.accuracy)}m)`);
      
      // Reset status and accuracy after a brief delay
      setTimeout(() => {
        setLocationStatus("");
        setLocationAccuracy(null);
      }, 5000);
      
    } catch (error) {
      setLoadingLocation(false);
      console.error("Error getting location:", error);
      toast.error("Errore nel rilevamento della posizione. Assicurati di aver concesso i permessi di geolocalizzazione.");
      setLocationStatus("Errore nel rilevamento della posizione");
    }
  };

  return {
    isCheckingIn,
    locationStatus,
    loadingLocation,
    lastCheckTime,
    locationAccuracy,
    locationRetries,
    handleCheckAction
  };
};
