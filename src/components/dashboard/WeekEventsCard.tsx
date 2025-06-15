
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { Event } from "@/types/event";

interface WeekEventsCardProps {
  events: Event[];
}

const WeekEventsCard: React.FC<WeekEventsCardProps> = ({ events }) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const weekEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate >= startOfWeek && eventDate <= endOfWeek;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Eventi della Settimana</CardTitle>
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{weekEvents.length}</div>
        <p className="text-xs text-muted-foreground">
          Eventi dal {startOfWeek.toLocaleDateString('it-IT')} al {endOfWeek.toLocaleDateString('it-IT')}
        </p>
      </CardContent>
    </Card>
  );
};

export default WeekEventsCard;
