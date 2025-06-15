
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Event } from "@/types/event";

interface TodayEventsCardProps {
  events: Event[];
}

const TodayEventsCard: React.FC<TodayEventsCardProps> = ({ events }) => {
  const today = new Date();
  
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate.toDateString() === today.toDateString();
  });

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Eventi di Oggi</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">{todayEvents.length}</div>
        <div className="space-y-3">
          {todayEvents.map((event) => (
            <div key={event.id} className="border-l-4 border-blue-500 pl-3 py-2">
              <div className="font-medium text-sm">{event.title}</div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(event.startDate), "HH:mm", { locale: it })} - {format(new Date(event.endDate), "HH:mm", { locale: it })}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(event.startDate), "d MMMM yyyy", { locale: it })}
              </div>
            </div>
          ))}
          {todayEvents.length === 0 && (
            <p className="text-sm text-muted-foreground">Nessun evento oggi</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayEventsCard;
