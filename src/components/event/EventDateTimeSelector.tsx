
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { it } from "date-fns/locale";

interface EventDateTimeSelectorProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  startTime: string;
  endTime: string;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

const EventDateTimeSelector: React.FC<EventDateTimeSelectorProps> = ({
  startDate,
  endDate,
  startTime,
  endTime,
  onStartDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange
}) => {
  // Ensure dates are valid Date objects or undefined
  const validStartDate = startDate && !isNaN(startDate.getTime()) ? startDate : undefined;
  const validEndDate = endDate && !isNaN(endDate.getTime()) ? endDate : undefined;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label>Data inizio *</Label>
        <div className="border rounded-md p-4">
          <Calendar
            mode="single"
            selected={validStartDate}
            onSelect={onStartDateChange}
            locale={it}
            className="mx-auto"
          />
          <div className="mt-4">
            <Label htmlFor="start-time">Ora inizio *</Label>
            <Input 
              id="start-time" 
              type="time" 
              value={startTime || "09:00"}
              onChange={(e) => onStartTimeChange(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Data fine *</Label>
        <div className="border rounded-md p-4">
          <Calendar
            mode="single"
            selected={validEndDate}
            onSelect={onEndDateChange}
            locale={it}
            className="mx-auto"
          />
          <div className="mt-4">
            <Label htmlFor="end-time">Ora fine *</Label>
            <Input 
              id="end-time" 
              type="time" 
              value={endTime || "18:00"}
              onChange={(e) => onEndTimeChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDateTimeSelector;
