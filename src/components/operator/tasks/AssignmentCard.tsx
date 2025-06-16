
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import TaskLocation from "./TaskLocation";

interface AssignmentCardProps {
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
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ event }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span>
            {format(event.startDate, "dd/MM/yyyy")} - {format(event.endDate, "dd/MM/yyyy")}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span>
            {event.startTime} - {event.endTime}
          </span>
        </div>
        <TaskLocation location={event.location} />
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 flex items-center justify-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Turni assegnati:</span>
            <ul className="list-disc list-inside">
              {event.shifts.map((shift, index) => (
                <li key={index}>{shift}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;
