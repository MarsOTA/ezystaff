
import React, { useState, useEffect } from "react";
import OperatorLayout from "@/components/OperatorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, LogIn, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useOperatorTasks } from "@/hooks/useOperatorTasks";
import { safeLocalStorage } from "@/utils/fileUtils";
import { ATTENDANCE_RECORDS_KEY } from "@/utils/operatorUtils";

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

const TasksPage: React.FC = () => {
  const { todayTask, loading, error, refreshTasks } = useOperatorTasks();
  const [isCheckingIn, setIsCheckingIn] = useState(true);
  const [locationStatus, setLocationStatus] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [locationRetries, setLocationRetries] = useState(0);
  
  useEffect(() => {
    // Check if there was a recent check-in to determine button state
    const attendanceRecords = getAttendanceRecords();
    if (todayTask) {
      const userRecords = attendanceRecords.filter(record => 
        record.eventId === todayTask.eventId &&
        new Date(record.timestamp).toDateString() === new Date().toDateString()
      );
      
      if (userRecords.length > 0) {
        const lastRecord = userRecords[userRecords.length - 1];
        setIsCheckingIn(lastRecord.type === "check-out");
        setLastCheckTime(new Date(lastRecord.timestamp));
      }
    }
  }, [todayTask]);
  
  const getAttendanceRecords = (): CheckRecord[] => {
    const records = safeLocalStorage.getItem(ATTENDANCE_RECORDS_KEY);
    return records ? JSON.parse(records) : [];
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
    if (!todayTask) return;
    
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
      
      // Get the user email from local storage if not available directly
      const currentUserJson = safeLocalStorage.getItem("app_user");
      const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
      const userEmail = currentUser?.email || "unknown@user.com";
      
      const record: CheckRecord = {
        operatorId: userEmail,
        timestamp,
        type,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        },
        eventId: todayTask.eventId
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
      
      // Dispatch an event to notify other tabs/windows
      const storageEvent = new Event("storage");
      window.dispatchEvent(storageEvent);
      refreshTasks();
      
    } catch (error) {
      setLoadingLocation(false);
      console.error("Error getting location:", error);
      toast.error("Errore nel rilevamento della posizione. Assicurati di aver concesso i permessi di geolocalizzazione.");
      setLocationStatus("Errore nel rilevamento della posizione");
    }
  };
  
  const saveAttendanceRecord = (record: CheckRecord) => {
    const records = getAttendanceRecords();
    records.push(record);
    safeLocalStorage.setItem(ATTENDANCE_RECORDS_KEY, JSON.stringify(records));
  };

  const renderLocationStatusIndicator = () => {
    if (!locationStatus) return null;
    
    return (
      <div className={`p-3 rounded-md text-sm flex items-center gap-2 ${
        locationStatus.includes("Errore") 
          ? "bg-red-50 text-red-800" 
          : "bg-yellow-50 text-yellow-800"
      }`}>
        {loadingLocation && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>{locationStatus}</span>
        {locationAccuracy !== null && (
          <span className="ml-1">
            (Precisione: {Math.round(locationAccuracy)}m)
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <OperatorLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Le tue attività di oggi</h1>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </OperatorLayout>
    );
  }

  if (error) {
    return (
      <OperatorLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Le tue attività di oggi</h1>
          <Card className="shadow-md">
            <CardContent className="pt-6 pb-6">
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">{error}</p>
                <Button onClick={refreshTasks} className="mt-4">
                  Riprova a caricare
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </OperatorLayout>
    );
  }

  if (!todayTask) {
    return (
      <OperatorLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Le tue attività di oggi</h1>
          <Card className="shadow-md">
            <CardContent className="pt-6 pb-6">
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">Non hai eventi assegnati per oggi.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </OperatorLayout>
    );
  }

  return (
    <OperatorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Le tue attività di oggi</h1>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">{todayTask.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>
                {format(todayTask.startDate, "dd/MM/yyyy")} - {format(todayTask.endDate, "dd/MM/yyyy")}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>
                {format(todayTask.startDate, "HH:mm")} - {format(todayTask.endDate, "HH:mm")}
              </span>
            </div>
            {todayTask.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{todayTask.location}</span>
              </div>
            )}
            {todayTask.address && (
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span>{todayTask.address}</span>
              </div>
            )}
            <div className="flex items-start space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium">Cliente:</span>
                <span>{todayTask.client}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium">Turni assegnati:</span>
                <ul className="list-disc list-inside">
                  {todayTask.shifts.map((shift, index) => (
                    <li key={index}>{shift}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {lastCheckTime && (
              <div className="bg-muted p-3 rounded-md text-sm">
                <span className="font-medium">Ultimo {isCheckingIn ? "check-out" : "check-in"}:</span>{" "}
                {format(lastCheckTime, "dd/MM/yyyy HH:mm:ss")}
              </div>
            )}
            
            {renderLocationStatusIndicator()}
          </CardContent>
          <CardFooter>
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleCheckAction}
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Rilevamento posizione...
                </>
              ) : isCheckingIn ? (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Check-in
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-5 w-5" />
                  Check-out
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </OperatorLayout>
  );
};

export default TasksPage;
