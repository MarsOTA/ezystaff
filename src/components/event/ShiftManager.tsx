
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, Plus, X, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Event } from "@/types/event";
import { Shift } from "@/hooks/useShiftManagement";

interface ShiftManagerProps {
  selectedEvent: Event | null;
  shifts: Shift[];
  shiftDate: Date | undefined;
  setShiftDate: (date: Date | undefined) => void;
  shiftStartTime: string;
  setShiftStartTime: (time: string) => void;
  shiftEndTime: string;
  setShiftEndTime: (time: string) => void;
  addShift: () => void;
  removeShift: (shiftId: string) => void;
  isDateInEventRange: (date: Date, event: Event) => boolean;
}

const ShiftManager: React.FC<ShiftManagerProps> = ({
  selectedEvent,
  shifts,
  shiftDate,
  setShiftDate,
  shiftStartTime,
  setShiftStartTime,
  shiftEndTime,
  setShiftEndTime,
  addShift,
  removeShift,
  isDateInEventRange
}) => {
  const formatDateRange = (start: Date, end: Date) => {
    const sameDay = start.getDate() === end.getDate() && 
                    start.getMonth() === end.getMonth() && 
                    start.getFullYear() === end.getFullYear();
    
    const startDateStr = format(start, "d MMMM yyyy", { locale: it });
    const endDateStr = format(end, "d MMMM yyyy", { locale: it });
    const startTimeStr = format(start, "HH:mm");
    const endTimeStr = format(end, "HH:mm");
    
    if (sameDay) {
      return `${startDateStr}, ${startTimeStr} - ${endTimeStr}`;
    } else {
      return `Dal ${startDateStr}, ${startTimeStr} al ${endDateStr}, ${endTimeStr}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imposta i turni</CardTitle>
        {selectedEvent && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              I turni devono essere compresi nel periodo dell'evento: {formatDateRange(selectedEvent.startDate, selectedEvent.endDate)}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedEvent ? (
          <>
            {/* Add New Shift */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md">
              <div className="space-y-2">
                <Label>Data turno</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !shiftDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {shiftDate ? format(shiftDate, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={shiftDate}
                      onSelect={setShiftDate}
                      locale={it}
                      className="pointer-events-auto"
                      disabled={(date) => !isDateInEventRange(date, selectedEvent)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Ora inizio</Label>
                <Input
                  type="time"
                  value={shiftStartTime}
                  onChange={(e) => setShiftStartTime(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Ora fine</Label>
                <Input
                  type="time"
                  value={shiftEndTime}
                  onChange={(e) => setShiftEndTime(e.target.value)}
                />
              </div>
              
              <div className="flex items-end">
                <Button onClick={addShift} disabled={!shiftDate} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Aggiungi turno
                </Button>
              </div>
            </div>

            {/* Shifts List */}
            {shifts.length > 0 && (
              <div className="space-y-2">
                <Label>Turni programmati</Label>
                {shifts.map((shift) => (
                  <div key={shift.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <span className="font-medium">
                        {format(shift.date, "d MMMM yyyy", { locale: it })}
                      </span>
                      <span className="ml-4 text-muted-foreground">
                        {shift.startTime} - {shift.endTime}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeShift(shift.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Seleziona prima un evento per impostare i turni
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ShiftManager;
