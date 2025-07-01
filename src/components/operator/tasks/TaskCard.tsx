
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User, Phone } from "lucide-react";
import { format } from "date-fns";
import TaskCheckButton from "./TaskCheckButton";
import TaskLocation from "./TaskLocation";
import { Operator } from "@/types/operator";

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
    eventReferentName?: string;
    eventReferentSurname?: string;
    eventReferentPhone?: string;
    teamLeaderId?: number;
  };
  isCheckingIn?: boolean;
  loadingLocation?: boolean;
  lastCheckTime?: Date | null;
  locationStatus?: "checking" | "valid" | "invalid" | "error";
  locationAccuracy?: number | null;
  onCheckAction?: () => void;
  assignedOperators?: Operator[];
  teamLeader?: Operator;
}

const TaskCard: React.FC<TaskCardProps> = ({
  event,
  isCheckingIn = false,
  loadingLocation = false,
  lastCheckTime = null,
  locationStatus = "checking",
  locationAccuracy = null,
  onCheckAction = () => {},
  assignedOperators = [],
  teamLeader
}) => {
  const isTodayEvent = () => {
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const startDate = new Date(event.startDate);
    const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    
    const endDate = new Date(event.endDate);
    const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    
    // Check if today falls within the event period (inclusive)
    const isWithinPeriod = todayDateOnly >= startDateOnly && todayDateOnly <= endDateOnly;
    
    console.log("Date comparison:", {
      today: todayDateOnly,
      eventStart: startDateOnly,
      eventEnd: endDateOnly,
      isWithinPeriod,
      eventTitle: event.title
    });
    
    return isWithinPeriod;
  };

  const eventIsToday = isTodayEvent();

  console.log("TaskCard render:", { 
    eventTitle: event.title,
    startDate: event.startDate, 
    endDate: event.endDate, 
    today: new Date(), 
    eventIsToday 
  });

  // Determina se l'operatore è attualmente in check-in
  const isCurrentlyCheckedIn = React.useMemo(() => {
    const records = localStorage.getItem("attendance_records");
    if (!records) return false;

    try {
      const parsedRecords = JSON.parse(records);
      const eventRecords = parsedRecords
        .filter((record: any) => record.eventId === event.id)
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      if (eventRecords.length === 0) return false;
      return eventRecords[0].type === "check-in";
    } catch (error) {
      console.error("Error checking attendance status:", error);
      return false;
    }
  }, [event.id, lastCheckTime]);

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
                {format(new Date(event.startDate), "dd/MM/yyyy")} - {format(new Date(event.endDate), "dd/MM/yyyy")}
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

        {/* Event Referent Information */}
        {(event.eventReferentName || event.eventReferentSurname || event.eventReferentPhone) && (
          <div className="space-y-2">
            <div className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Referente dell'evento
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              {(event.eventReferentName || event.eventReferentSurname) && (
                <div className="font-medium">
                  {event.eventReferentName} {event.eventReferentSurname}
                </div>
              )}
              {event.eventReferentPhone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {event.eventReferentPhone}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team Leader Information */}
        {teamLeader && (
          <div className="space-y-2">
            <div className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Team Leader
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="font-medium">
                {teamLeader.name} {teamLeader.surname}
              </div>
              {teamLeader.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {teamLeader.phone}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Assigned Colleagues */}
        {assignedOperators.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              I tuoi colleghi ({assignedOperators.length})
            </div>
            <div className="space-y-2">
              {assignedOperators.map((operator) => (
                <div key={operator.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium">
                    {operator.name} {operator.surname}
                  </div>
                  {operator.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {operator.phone}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Check-in / Check-out</h3>
              <p className="text-sm text-muted-foreground">
                Effettua il check-in quando arrivi sul posto e il check-out quando termini il turno.
              </p>
            </div>
            <TaskCheckButton
              isCheckingIn={isCheckingIn}
              loadingLocation={loadingLocation}
              lastCheckTime={lastCheckTime}
              locationStatus={locationStatus}
              locationAccuracy={locationAccuracy}
              onCheckAction={onCheckAction}
              isCurrentlyCheckedIn={isCurrentlyCheckedIn}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
