
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface UseOperatorAttendanceProps {
  eventId: number;
}

interface AttendanceRecord {
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

export const useOperatorAttendance = ({ eventId }: UseOperatorAttendanceProps) => {
  const { user } = useAuth();
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

    // Carica l'ultimo check-in/out per questo evento
    loadLastCheckTime();
  }, [eventId, user]);

  const loadLastCheckTime = () => {
    if (!user?.email) return;

    const records = localStorage.getItem("attendance_records");
    if (!records) return;

    try {
      const parsedRecords = JSON.parse(records) as AttendanceRecord[];
      const eventRecords = parsedRecords
        .filter(record => record.operatorId === user.email && record.eventId === eventId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      if (eventRecords.length > 0) {
        const lastRecord = eventRecords[0];
        setLastCheckTime(new Date(lastRecord.timestamp));
        
        // Se l'ultimo record è un check-in, significa che è già dentro
        // Se l'ultimo record è un check-out, significa che è fuori
        console.log("Last attendance record:", lastRecord);
      }
    } catch (error) {
      console.error("Error loading attendance records:", error);
    }
  };

  const isCurrentlyCheckedIn = () => {
    if (!user?.email) return false;

    const records = localStorage.getItem("attendance_records");
    if (!records) return false;

    try {
      const parsedRecords = JSON.parse(records) as AttendanceRecord[];
      const eventRecords = parsedRecords
        .filter(record => record.operatorId === user.email && record.eventId === eventId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      if (eventRecords.length === 0) return false;

      // Se l'ultimo record è un check-in, è attualmente dentro
      return eventRecords[0].type === "check-in";
    } catch (error) {
      console.error("Error checking attendance status:", error);
      return false;
    }
  };

  const handleCheckAction = async () => {
    if (!user?.email) {
      toast.error("Utente non autenticato");
      return;
    }

    try {
      setIsCheckingIn(true);
      
      // Simula il rilevamento della posizione GPS
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const now = new Date();
      const currentlyCheckedIn = isCurrentlyCheckedIn();
      const actionType = currentlyCheckedIn ? "check-out" : "check-in";
      
      // Crea il nuovo record di presenza
      const newRecord: AttendanceRecord = {
        operatorId: user.email,
        timestamp: now.toISOString(),
        type: actionType,
        location: {
          latitude: 45.4642 + (Math.random() - 0.5) * 0.01, // Coordinate Milano con piccola variazione
          longitude: 9.1900 + (Math.random() - 0.5) * 0.01,
          accuracy: locationAccuracy || 15
        },
        eventId: eventId
      };
      
      // Salva nel localStorage
      const existingRecords = localStorage.getItem("attendance_records");
      let records: AttendanceRecord[] = [];
      
      if (existingRecords) {
        try {
          records = JSON.parse(existingRecords);
        } catch (error) {
          console.error("Error parsing existing records:", error);
          records = [];
        }
      }
      
      records.push(newRecord);
      localStorage.setItem("attendance_records", JSON.stringify(records));
      
      // Aggiorna lo stato locale
      setLastCheckTime(now);
      
      // Mostra messaggio di successo
      if (actionType === "check-in") {
        toast.success("Check-in effettuato con successo!");
      } else {
        toast.success("Check-out effettuato con successo!");
      }
      
      console.log("Attendance record saved:", newRecord);
      
    } catch (error) {
      console.error("Error during check action:", error);
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
    handleCheckAction,
    isCurrentlyCheckedIn: isCurrentlyCheckedIn()
  };
};
