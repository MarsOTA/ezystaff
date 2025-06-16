
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import TaskCheckButton from "./TaskCheckButton";
import TaskLocation from "./TaskLocation";

interface TaskCardProps {
  event: {
    id: number;
    title: string;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    location: string;
    shifts: string[];
  };
  isCheckingIn: boolean;
  loadingLocation: boolean;
  lastCheckTime: Date | null;
  locationStatus: "checking" | "valid" | "invalid" | "error";
  locationAccuracy: number | null;
  onCheckAction: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  event,
  isCheckingIn,
  loadingLocation,
  lastCheckTime,
  locationStatus,
  locationAccuracy,
  onCheckAction
}) => {
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const eventIsToday = isToday(event.startDate);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">{event.title}</CardTitle>
        {eventIsToday && (
          <div className="text-sm text-green-600 font-medium">
            📍 Evento di oggi
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Date</div>
              <div className="text-sm text-muted-foreground">
                {format(event.startDate, "dd/MM/yyyy")} - {format(event.endDate, "dd/MM/yyyy")}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Orario</div>
              <div className="text-sm text-muted-foreground">
                {event.startTime} - {event.endTime}
              </div>
            </div>
          </div>
        </div>

        <TaskLocation location={event.location} />

        <div className="space-y-2">
          <div className="font-medium">Turni assegnati</div>
          <div className="flex flex-wrap gap-2">
            {event.shifts.map((shift, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {shift}
              </span>
            ))}
          </div>
        </div>

        {eventIsToday && (
          <div className="border-t pt-4">
            <TaskCheckButton
              isCheckingIn={isCheckingIn}
              loadingLocation={loadingLocation}
              lastCheckTime={lastCheckTime}
              locationStatus={locationStatus}
              locationAccuracy={locationAccuracy}
              onCheckAction={onCheckAction}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
