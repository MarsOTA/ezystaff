import React, { useState } from "react";
import OperatorLayout from "@/components/OperatorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, LogIn, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useOperatorTasks, CheckRecord } from "@/hooks/useOperatorTasks";

const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const { tasks, loading: loadingTasks, error, getAttendanceRecords, saveAttendanceRecord } = useOperatorTasks();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [locationRetries, setLocationRetries] = useState(0);
  
  // If still loading or no tasks, show loading state
  if (loadingTasks) {
    return (
      <OperatorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Caricamento attività...</p>
          </div>
        </div>
      </OperatorLayout>
    );
  }
  
  // If error or no tasks found, show error message
  if (error || tasks.length === 0) {
    return (
      <OperatorLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Le tue attività di oggi</h1>
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {error || "Non ci sono attività programmate al momento."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </OperatorLayout>
    );
  }
  
  // Get the first task from the list (main implementation works with one task)
  const task = tasks[0];
  
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
  
  const handleCheckAction = async (task: typeof tasks[0]) => {
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
      
      const isCheckingIn = !task.isCheckedIn;
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
        eventId: task.id
      };
      
      saveAttendanceRecord(record);
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

  return (
    <OperatorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Le tue attività di oggi</h1>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">{task.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>
                {format(task.startDate, "dd/MM/yyyy")} 
                {!task.endDate.toDateString().includes(task.startDate.toDateString()) && 
                  ` - ${format(task.endDate, "dd/MM/yyyy")}`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>
                {task.startTime} - {task.endTime}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{task.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium">Turni assegnati:</span>
                <ul className="list-disc list-inside">
                  {task.shifts.map((shift, index) => (
                    <li key={index}>{shift}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {task.lastCheckTime && (
              <div className="bg-muted p-3 rounded-md text-sm">
                <span className="font-medium">Ultimo {task.isCheckedIn ? "check-in" : "check-out"}:</span>{" "}
                {format(task.lastCheckTime, "dd/MM/yyyy HH:mm:ss")}
              </div>
            )}
            
            {renderLocationStatusIndicator()}
          </CardContent>
          <CardFooter>
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => handleCheckAction(task)}
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Rilevamento posizione...
                </>
              ) : !task.isCheckedIn ? (
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
