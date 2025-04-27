
import React, { useState, useEffect } from "react";
import OperatorLayout from "@/components/OperatorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Check, LogIn, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
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

interface EventData {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  address?: string;
  client: string;
  shifts: string[];
}

const ATTENDANCE_RECORDS_KEY = "attendance_records";
const EVENTS_STORAGE_KEY = "app_events_data";
const OPERATORS_STORAGE_KEY = "app_operators_data";

const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const [isCheckingIn, setIsCheckingIn] = useState(true);
  const [locationStatus, setLocationStatus] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [locationRetries, setLocationRetries] = useState(0);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const loadUserEvents = () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log("Loading tasks for user:", user.email);
      
      // Get operators data
      const operatorsData = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
      if (!operatorsData) {
        console.log("No operators data found");
        setLoading(false);
        return;
      }
      
      const operators = JSON.parse(operatorsData);
      const currentOperator = operators.find((op: any) => op.email === user.email);
      
      console.log("Current operator:", currentOperator);
      
      if (!currentOperator || !currentOperator.assignedEvents || currentOperator.assignedEvents.length === 0) {
        console.log("No assigned events found for operator");
        setLoading(false);
        return;
      }
      
      // Get events data
      const eventsData = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
      if (!eventsData) {
        console.log("No events data found");
        setLoading(false);
        return;
      }
      
      const events = JSON.parse(eventsData);
      // Ensure date objects are properly parsed from strings
      const parsedEvents = events.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
      }));
      
      console.log("All events:", parsedEvents);
      console.log("Assigned event IDs:", currentOperator.assignedEvents);
      
      // Filter events assigned to the operator and happening today or in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of the day for proper comparison
      
      const assignedEvents = parsedEvents.filter((event: any) => {
        const eventEndDate = new Date(event.endDate);
        const isAssigned = currentOperator.assignedEvents.includes(event.id);
        const isNotFinished = eventEndDate >= today;
        const isValidStatus = event.status === "upcoming" || event.status === "in-progress" || !event.status;
        
        console.log(
          `Event ID ${event.id}, Title: ${event.title}, Assigned: ${isAssigned}, 
           Status: ${event.status || "none"}, 
           End date >= today: ${isNotFinished}, 
           Valid status: ${isValidStatus}`
        );
        
        return isAssigned && isNotFinished && isValidStatus;
      });
      
      console.log("Assigned events after filtering:", assignedEvents);
      
      // Sort by start date (closest first)
      assignedEvents.sort((a: any, b: any) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      
      if (assignedEvents.length > 0) {
        const nextEvent = assignedEvents[0];
        console.log("Next event:", nextEvent);
        
        // Create shifts based on start and end times
        const startTime = nextEvent.startTime || format(new Date(nextEvent.startDate), "HH:mm");
        const endTime = nextEvent.endTime || format(new Date(nextEvent.endDate), "HH:mm");
        
        let shifts = [`${startTime} - ${endTime}`];
        
        // If the event has break times, add an additional shift
        if (nextEvent.breakStartTime && nextEvent.breakEndTime) {
          shifts = [
            `${startTime} - ${nextEvent.breakStartTime}`,
            `${nextEvent.breakEndTime} - ${endTime}`
          ];
        }
        
        setEventData({
          id: nextEvent.id,
          title: nextEvent.title,
          startDate: new Date(nextEvent.startDate),
          endDate: new Date(nextEvent.endDate),
          startTime: startTime,
          endTime: endTime,
          location: nextEvent.location || "",
          address: nextEvent.address || "",
          client: nextEvent.client || "Cliente non specificato",
          shifts: shifts
        });
      } else {
        setEventData(null);
      }
      
    } catch (error) {
      console.error("Error loading user events:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadUserEvents();
    
    // Set up storage event listener to detect changes from other tabs
    const handleStorageChange = () => {
      loadUserEvents();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up a periodic refresh every minute
    const intervalId = setInterval(loadUserEvents, 60000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [user]);
  
  useEffect(() => {
    // Check if there was a recent check-in to determine button state
    const attendanceRecords = getAttendanceRecords();
    if (!user || !eventData) return;
    
    const userRecords = attendanceRecords.filter(record => 
      record.operatorId === user.email && 
      record.eventId === eventData.id &&
      new Date(record.timestamp).toDateString() === new Date().toDateString()
    );
    
    if (userRecords.length > 0) {
      const lastRecord = userRecords[userRecords.length - 1];
      setIsCheckingIn(lastRecord.type === "check-out");
      setLastCheckTime(new Date(lastRecord.timestamp));
    }
  }, [user, eventData]);
  
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
    if (!user || !eventData) return;
    
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
        eventId: eventData.id
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

  if (!eventData) {
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
            <CardTitle className="text-xl">{eventData.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>
                {format(eventData.startDate, "dd/MM/yyyy")} - {format(eventData.endDate, "dd/MM/yyyy")}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>
                {eventData.startTime} - {eventData.endTime}
              </span>
            </div>
            {eventData.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{eventData.location}</span>
              </div>
            )}
            {eventData.address && (
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span>{eventData.address}</span>
              </div>
            )}
            <div className="flex items-start space-x-2">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex flex-col">
                <span className="font-medium">Cliente:</span>
                <span>{eventData.client}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium">Turni assegnati:</span>
                <ul className="list-disc list-inside">
                  {eventData.shifts.map((shift, index) => (
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
