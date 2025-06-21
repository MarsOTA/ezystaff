
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface TaskCheckButtonProps {
  isCheckingIn: boolean;
  loadingLocation: boolean;
  lastCheckTime: Date | null;
  locationStatus: "checking" | "valid" | "invalid" | "error";
  locationAccuracy: number | null;
  onCheckAction: () => void;
  isCurrentlyCheckedIn?: boolean;
}

const TaskCheckButton: React.FC<TaskCheckButtonProps> = ({
  isCheckingIn,
  loadingLocation,
  lastCheckTime,
  locationStatus,
  locationAccuracy,
  onCheckAction,
  isCurrentlyCheckedIn = false
}) => {
  const getLocationStatusColor = () => {
    switch (locationStatus) {
      case "valid": return "text-green-600";
      case "invalid": return "text-red-600";
      case "error": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  const getLocationStatusText = () => {
    switch (locationStatus) {
      case "checking": return "Verificando posizione...";
      case "valid": return `Posizione verificata (±${locationAccuracy}m)`;
      case "invalid": return "Posizione non valida";
      case "error": return "Errore nel rilevamento posizione";
      default: return "Posizione sconosciuta";
    }
  };

  const getButtonText = () => {
    if (isCheckingIn) {
      return isCurrentlyCheckedIn ? "Check-out in corso..." : "Check-in in corso...";
    }
    return isCurrentlyCheckedIn ? "Check-out" : "Check-in";
  };

  const getButtonVariant = () => {
    return isCurrentlyCheckedIn ? "destructive" : "default";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MapPin className={`h-4 w-4 ${getLocationStatusColor()}`} />
        <span className={`text-sm ${getLocationStatusColor()}`}>
          {getLocationStatusText()}
        </span>
      </div>

      {isCurrentlyCheckedIn && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 text-green-700">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              Attualmente in servizio
            </span>
          </div>
        </div>
      )}

      {lastCheckTime && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Ultimo check: {format(lastCheckTime, "dd/MM/yyyy HH:mm")}
          </span>
        </div>
      )}

      <Button 
        onClick={onCheckAction}
        disabled={isCheckingIn || loadingLocation || locationStatus === "invalid"}
        className="w-full"
        size="lg"
        variant={getButtonVariant()}
      >
        {isCheckingIn ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {getButtonText()}
          </>
        ) : (
          <>
            <Clock className="mr-2 h-4 w-4" />
            {getButtonText()}
          </>
        )}
      </Button>
    </div>
  );
};

export default TaskCheckButton;
