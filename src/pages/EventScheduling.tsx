
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { Event, EVENTS_STORAGE_KEY } from "@/types/event";
import { safeLocalStorage } from "@/utils/fileUtils";
import { format, addDays, differenceInDays } from "date-fns";
import { it } from "date-fns/locale";

interface DaySchedule {
  date: Date;
  startTime: string;
  endTime: string;
  lunchBreakStartTime: string;
  lunchBreakEndTime: string;
  dailyHours: number;
}

const EventScheduling = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [daySchedules, setDaySchedules] = useState<DaySchedule[]>([]);
  const [totalHours, setTotalHours] = useState(0);

  // Load event data
  useEffect(() => {
    if (!eventId) return;

    const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
    if (storedEvents) {
      try {
        const events: Event[] = JSON.parse(storedEvents).map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate)
        }));
        
        const foundEvent = events.find(e => e.id === Number(eventId));
        if (foundEvent) {
          setEvent(foundEvent);
          generateDaySchedules(foundEvent);
        } else {
          toast.error("Evento non trovato");
          navigate("/events");
        }
      } catch (error) {
        console.error("Errore nel caricamento dell'evento:", error);
        toast.error("Errore nel caricamento dell'evento");
        navigate("/events");
      }
    }
  }, [eventId, navigate]);

  const generateDaySchedules = (eventData: Event) => {
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.endDate);
    
    // Reset time to compare only dates
    const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    
    const daysDifference = differenceInDays(endDateOnly, startDateOnly);
    const schedules: DaySchedule[] = [];

    // Get default times from the event
    const defaultStartTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const defaultEndTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    for (let i = 0; i <= daysDifference; i++) {
      const currentDate = addDays(startDateOnly, i);
      const dailyHours = calculateDailyHours(defaultStartTime, defaultEndTime, "12:00", "13:00");
      
      schedules.push({
        date: currentDate,
        startTime: defaultStartTime,
        endTime: defaultEndTime,
        lunchBreakStartTime: "12:00",
        lunchBreakEndTime: "13:00",
        dailyHours
      });
    }

    setDaySchedules(schedules);
    updateTotalHours(schedules);
  };

  const calculateDailyHours = (startTime: string, endTime: string, lunchStart: string, lunchEnd: string): number => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const [lunchStartHour, lunchStartMinute] = lunchStart.split(':').map(Number);
    const [lunchEndHour, lunchEndMinute] = lunchEnd.split(':').map(Number);
    
    const startTimeMinutes = startHour * 60 + startMinute;
    const endTimeMinutes = endHour * 60 + endMinute;
    const lunchStartMinutes = lunchStartHour * 60 + lunchStartMinute;
    const lunchEndMinutes = lunchEndHour * 60 + lunchEndMinute;
    
    let dailyMinutes = endTimeMinutes - startTimeMinutes;
    if (dailyMinutes < 0) {
      dailyMinutes += 24 * 60; // Add 24 hours in minutes for next day
    }
    
    // Subtract lunch break duration
    const lunchBreakMinutes = lunchEndMinutes - lunchStartMinutes;
    dailyMinutes = Math.max(0, dailyMinutes - lunchBreakMinutes);
    
    return Math.max(0, dailyMinutes / 60);
  };

  const updateTotalHours = (schedules: DaySchedule[]) => {
    const total = schedules.reduce((sum, schedule) => sum + schedule.dailyHours, 0);
    setTotalHours(total);
  };

  const handleTimeChange = (index: number, field: keyof DaySchedule, value: string) => {
    const updatedSchedules = [...daySchedules];
    
    // Handle different field types properly
    if (field === 'date') {
      // This shouldn't happen in our current UI, but handle it for type safety
      return;
    } else {
      // All other fields are strings
      (updatedSchedules[index] as any)[field] = value;
    }
    
    // Recalculate daily hours for this day
    const schedule = updatedSchedules[index];
    const dailyHours = calculateDailyHours(
      schedule.startTime,
      schedule.endTime,
      schedule.lunchBreakStartTime,
      schedule.lunchBreakEndTime
    );
    updatedSchedules[index].dailyHours = dailyHours;
    
    setDaySchedules(updatedSchedules);
    updateTotalHours(updatedSchedules);
  };

  const handleSave = () => {
    if (!event) return;

    try {
      // Update event with new scheduling data
      const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
      if (storedEvents) {
        const events: Event[] = JSON.parse(storedEvents);
        const updatedEvents = events.map(e => {
          if (e.id === event.id) {
            return {
              ...e,
              daySchedules: daySchedules,
              totalScheduledHours: totalHours
            };
          }
          return e;
        });
        
        safeLocalStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
        toast.success("Programmazione evento salvata con successo!");
      }
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
      toast.error("Errore nel salvataggio della programmazione");
    }
  };

  if (!event) {
    return (
      <Layout>
        <div className="p-8 text-center">Caricamento evento...</div>
      </Layout>
    );
  }

  const eventDuration = differenceInDays(new Date(event.endDate), new Date(event.startDate)) + 1;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/events')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna agli eventi
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Programmazione evento
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              <p><strong>{event.title}</strong></p>
              <p>Cliente: {event.client}</p>
              <p>Durata: {eventDuration} {eventDuration === 1 ? 'giorno' : 'giorni'}</p>
            </div>
          </CardHeader>
          <CardContent>
            {eventDuration >= 2 ? (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {daySchedules.map((schedule, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-4">
                        <div className="font-medium">
                          {format(schedule.date, "EEEE d MMMM yyyy", { locale: it })}
                        </div>
                        
                        <div className="grid md:grid-cols-6 gap-4 items-end">
                          <div className="space-y-2">
                            <Label htmlFor={`start-${index}`}>Ora inizio</Label>
                            <Input
                              id={`start-${index}`}
                              type="time"
                              value={schedule.startTime}
                              onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`end-${index}`}>Ora fine</Label>
                            <Input
                              id={`end-${index}`}
                              type="time"
                              value={schedule.endTime}
                              onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`lunch-start-${index}`}>Pausa pranzo - Inizio</Label>
                            <Input
                              id={`lunch-start-${index}`}
                              type="time"
                              value={schedule.lunchBreakStartTime}
                              onChange={(e) => handleTimeChange(index, 'lunchBreakStartTime', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`lunch-end-${index}`}>Pausa pranzo - Fine</Label>
                            <Input
                              id={`lunch-end-${index}`}
                              type="time"
                              value={schedule.lunchBreakEndTime}
                              onChange={(e) => handleTimeChange(index, 'lunchBreakEndTime', e.target.value)}
                            />
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Clock className="h-4 w-4" />
                            {schedule.dailyHours.toFixed(1)} ore
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Monte ore totale:</span>
                    <span className="text-2xl font-bold text-primary">
                      {totalHours.toFixed(1)} ore
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    Salva programmazione
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  La programmazione dettagliata è disponibile solo per eventi di durata pari o superiore a 2 giorni.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Questo evento dura {eventDuration} giorno.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EventScheduling;
