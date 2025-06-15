
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Event, Shift } from "@/types/event";
import { Operator } from "@/types/operator";

interface TodayShiftsCardProps {
  events: Event[];
  operators: Operator[];
}

const TodayShiftsCard: React.FC<TodayShiftsCardProps> = ({ events, operators }) => {
  const today = new Date();
  
  const todayShifts: Array<{
    shift: Shift;
    operatorName: string;
    eventTitle: string;
  }> = [];

  events.forEach(event => {
    if (event.shifts) {
      event.shifts.forEach(shift => {
        const shiftDate = new Date(shift.date);
        if (shiftDate.toDateString() === today.toDateString()) {
          const operator = operators.find(op => op.id === shift.operatorId);
          todayShifts.push({
            shift,
            operatorName: operator ? `${operator.name} ${operator.surname}` : 'Operatore non trovato',
            eventTitle: event.title
          });
        }
      });
    }
  });

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Turni di Oggi</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">{todayShifts.length}</div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {todayShifts.map((item, index) => (
            <div key={`${item.shift.id}-${index}`} className="border-l-4 border-green-500 pl-3 py-2">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-3 w-3" />
                <span className="font-medium text-sm">{item.operatorName}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-1">
                {item.eventTitle}
              </div>
              <div className="text-xs text-muted-foreground">
                {item.shift.startTime} - {item.shift.endTime}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(item.shift.date), "d MMMM yyyy", { locale: it })}
              </div>
            </div>
          ))}
          {todayShifts.length === 0 && (
            <p className="text-sm text-muted-foreground">Nessun turno oggi</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayShiftsCard;
