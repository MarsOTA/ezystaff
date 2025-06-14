
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Plus, X, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import { Operator, OPERATORS_STORAGE_KEY } from "@/types/operator";
import { Event, EVENTS_STORAGE_KEY } from "@/types/event";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { safeLocalStorage } from "@/utils/fileUtils";

interface Shift {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
}

const EventPlanner = () => {
  const { operatorId } = useParams<{ operatorId: string }>();
  const navigate = useNavigate();
  
  const [operators, setOperators] = useState<Operator[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [notes, setNotes] = useState("");
  
  // New shift form state
  const [shiftDate, setShiftDate] = useState<Date | undefined>(undefined);
  const [shiftStartTime, setShiftStartTime] = useState("09:00");
  const [shiftEndTime, setShiftEndTime] = useState("18:00");

  // Load operators and events from localStorage
  useEffect(() => {
    const loadOperators = () => {
      const storedOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
      if (storedOperators) {
        try {
          const parsedOperators = JSON.parse(storedOperators);
          setOperators(parsedOperators);
        } catch (error) {
          console.error("Error loading operators:", error);
          setOperators([]);
        }
      }
    };

    const loadEvents = () => {
      const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
      if (storedEvents) {
        try {
          const parsedEvents = JSON.parse(storedEvents);
          const eventsWithDates = parsedEvents.map((event: any) => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
          }));
          setEvents(eventsWithDates);
        } catch (error) {
          console.error("Error loading events:", error);
          setEvents([]);
        }
      }
    };

    loadOperators();
    loadEvents();
  }, []);

  useEffect(() => {
    if (operatorId && operators.length > 0) {
      const operator = operators.find(op => op.id === parseInt(operatorId));
      setSelectedOperator(operator || null);
    }
  }, [operatorId, operators]);

  // Update selected event and auto-populate shift date when event is selected
  useEffect(() => {
    if (selectedEventId && events.length > 0) {
      const event = events.find(e => e.id === parseInt(selectedEventId));
      if (event) {
        setSelectedEvent(event);
        // Auto-populate shift date with event start date
        setShiftDate(event.startDate);
        // Set default times based on event times
        const startTime = format(event.startDate, "HH:mm");
        const endTime = format(event.endDate, "HH:mm");
        setShiftStartTime(startTime);
        setShiftEndTime(endTime);
      }
    } else {
      setSelectedEvent(null);
      setShiftDate(undefined);
    }
  }, [selectedEventId, events]);

  const getAssignedEvents = () => {
    if (!selectedOperator || !selectedOperator.assignedEvents) return [];
    
    return events.filter(event => 
      selectedOperator.assignedEvents?.includes(event.id)
    );
  };

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

  const isDateInEventRange = (date: Date, event: Event) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    // Reset time for date comparison
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    eventStart.setHours(0, 0, 0, 0);
    eventEnd.setHours(0, 0, 0, 0);
    
    return checkDate >= eventStart && checkDate <= eventEnd;
  };

  const addShift = () => {
    if (!shiftDate || !selectedEvent) return;
    
    // Validate that shift date is within event date range
    if (!isDateInEventRange(shiftDate, selectedEvent)) {
      toast.error("La data del turno deve essere compresa nel periodo dell'evento");
      return;
    }
    
    const newShift: Shift = {
      id: Date.now().toString(),
      date: shiftDate,
      startTime: shiftStartTime,
      endTime: shiftEndTime
    };
    
    setShifts([...shifts, newShift]);
    toast.success("Turno aggiunto con successo");
  };

  const removeShift = (shiftId: string) => {
    setShifts(shifts.filter(shift => shift.id !== shiftId));
    toast.success("Turno rimosso");
  };

  const handleAssign = () => {
    if (!selectedOperator || !selectedEventId) {
      toast.error("Seleziona un evento per continuare");
      return;
    }

    const eventId = parseInt(selectedEventId);
    
    // Update operators with new assignment
    const updatedOperators = operators.map(operator => {
      if (operator.id === selectedOperator.id) {
        const currentEvents = operator.assignedEvents || [];
        
        if (!currentEvents.includes(eventId)) {
          return {
            ...operator,
            assignedEvents: [...currentEvents, eventId]
          };
        } else {
          toast.info("Operatore già assegnato a questo evento");
          return operator;
        }
      }
      return operator;
    });

    // Save updated operators to localStorage
    setOperators(updatedOperators);
    safeLocalStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(updatedOperators));
    
    console.log("Operators updated and saved:", updatedOperators);
    
    toast.success(`${selectedOperator.name} ${selectedOperator.surname} assegnato con successo all'evento`);
    
    // Navigate back to operators list
    navigate("/operators");
  };

  if (!selectedOperator) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p>Operatore non trovato</p>
          <Button onClick={() => navigate("/operators")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla Lista Operatori
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/operators")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla Lista
          </Button>
          <h1 className="text-2xl font-bold">Event Planner</h1>
        </div>

        {/* Event Selection */}
        <Card>
          <CardHeader>
            <CardTitle>
              Seleziona l'evento a cui vuoi assegnare {selectedOperator.name} {selectedOperator.surname}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un evento" />
              </SelectTrigger>
              <SelectContent>
                {events.length > 0 ? (
                  events.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.title} - {event.client}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-events" disabled>
                    Nessun evento disponibile
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Already Assigned Events */}
        <Card>
          <CardHeader>
            <CardTitle>Eventi già assegnati</CardTitle>
          </CardHeader>
          <CardContent>
            {getAssignedEvents().length > 0 ? (
              <div className="space-y-3">
                {getAssignedEvents().map((event) => (
                  <div key={event.id} className="p-3 bg-muted rounded-md">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDateRange(event.startDate, event.endDate)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nessun evento assegnato</p>
            )}
          </CardContent>
        </Card>

        {/* Shifts Management */}
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

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Note</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Scrivi eventuali note per questo operatore..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={() => navigate("/operators")}>
            Annulla
          </Button>
          <Button onClick={handleAssign} disabled={!selectedEventId}>
            Assegna Operatore
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default EventPlanner;
