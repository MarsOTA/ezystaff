import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { safeLocalStorage } from "@/utils/fileUtils";
import { supabase } from "@/integrations/supabase/client";

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface CheckRecord {
  operatorId: string;
  timestamp: string;
  type: "check-in" | "check-out";
  location: Location;
  eventId: number;
}

interface Task {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  shifts: string[];
  lastCheckTime?: Date | null;
  isCheckedIn?: boolean;
}

const ATTENDANCE_RECORDS_KEY = "attendance_records";

export const useOperatorTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.email) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching tasks for operator:", user);
        
        // Try to fetch operator data from local storage
        const storedOperators = localStorage.getItem("app_operators_data");
        let operatorId: string | null = null;
        
        if (storedOperators) {
          const operators = JSON.parse(storedOperators);
          // Try to find by email first
          const operator = operators.find((op: any) => 
            op.email?.toLowerCase() === user.email?.toLowerCase()
          );
          
          if (operator) {
            operatorId = operator.id.toString();
            console.log("Found operator by email:", operator);
          } else {
            // If not found by email, try by name
            const operatorByName = operators.find((op: any) => 
              op.name?.toLowerCase() === user.name?.toLowerCase()
            );
            
            if (operatorByName) {
              operatorId = operatorByName.id.toString();
              console.log("Found operator by name:", operatorByName);
            }
          }
        }
        
        if (!operatorId) {
          setError("Operatore non trovato nel sistema");
          setLoading(false);
          return;
        }
        
        console.log("Using operator ID:", operatorId);
        
        // First try to get events from Supabase
        const { data: eventOperators, error: eventOperatorsError } = await supabase
          .from('event_operators')
          .select(`
            event_id,
            events(
              id,
              title,
              start_date,
              end_date,
              location,
              status
            )
          `)
          .eq('operator_id', operatorId);
        
        if (eventOperatorsError) {
          console.error("Error fetching events from Supabase:", eventOperatorsError);
        }
        
        let operatorTasks: Task[] = [];
        
        // If we have events from Supabase, use those
        if (eventOperators && eventOperators.length > 0) {
          console.log("Found events in Supabase:", eventOperators);
          
          operatorTasks = eventOperators
            .filter(item => item.events) // Filter out items without events
            .map(item => {
              const event = item.events as any;
              const startDate = new Date(event.start_date);
              const endDate = new Date(event.end_date);
              
              return {
                id: event.id,
                title: event.title,
                startDate,
                endDate,
                startTime: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                endTime: endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                location: event.location || "Location not specified",
                shifts: [`${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}-${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`]
              };
            });
        } else {
          // Otherwise, try to get events from local storage
          console.log("No events found in Supabase, checking local storage");
          
          const storedEvents = localStorage.getItem("app_events_data");
          if (storedEvents) {
            const allEvents = JSON.parse(storedEvents);
            
            // Find the operator to get their assigned events
            const storedOperators = localStorage.getItem("app_operators_data");
            if (storedOperators) {
              const operators = JSON.parse(storedOperators);
              const operator = operators.find((op: any) => op.id.toString() === operatorId);
              
              if (operator && operator.assignedEvents) {
                console.log("Operator assigned events:", operator.assignedEvents);
                
                // Filter events assigned to this operator
                operatorTasks = allEvents
                  .filter((event: any) => operator.assignedEvents.includes(event.id))
                  .map((event: any) => {
                    const startDate = new Date(event.startDate);
                    const endDate = new Date(event.endDate);
                    
                    return {
                      id: event.id,
                      title: event.title,
                      startDate,
                      endDate,
                      startTime: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      endTime: endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      location: event.location || "Location not specified",
                      shifts: [`${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}-${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`]
                    };
                  });
              }
            }
          }
        }
        
        if (operatorTasks.length === 0) {
          // If still no tasks, create a mock event for development/testing
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          
          operatorTasks = [{
            id: 1,
            title: "Milano Security Conference",
            startDate: tomorrow,
            endDate: new Date(tomorrow.getTime() + 9 * 60 * 60 * 1000), // 9 hours later
            startTime: "09:00",
            endTime: "18:00",
            location: "Via Milano 123, Milano, MI",
            shifts: ["Mattina (09:00-13:00)", "Pomeriggio (14:00-18:00)"]
          }];
          
          console.log("Created mock event for testing:", operatorTasks);
        }
        
        // Check attendance records for each task
        const attendanceRecords = getAttendanceRecords();
        
        operatorTasks = operatorTasks.map(task => {
          const taskRecords = attendanceRecords.filter(record => 
            record.operatorId === user.email && 
            record.eventId === task.id &&
            new Date(record.timestamp).toDateString() === new Date().toDateString()
          );
          
          if (taskRecords.length > 0) {
            const lastRecord = taskRecords[taskRecords.length - 1];
            return {
              ...task,
              lastCheckTime: new Date(lastRecord.timestamp),
              isCheckedIn: lastRecord.type === "check-in"
            };
          }
          
          return task;
        });
        
        setTasks(operatorTasks);
      } catch (error) {
        console.error("Error fetching operator tasks:", error);
        setError("Error loading tasks");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [user]);
  
  const getAttendanceRecords = (): CheckRecord[] => {
    const records = safeLocalStorage.getItem(ATTENDANCE_RECORDS_KEY);
    return records ? JSON.parse(records) : [];
  };
  
  const saveAttendanceRecord = (record: CheckRecord) => {
    const records = getAttendanceRecords();
    records.push(record);
    safeLocalStorage.setItem(ATTENDANCE_RECORDS_KEY, JSON.stringify(records));
  };
  
  return {
    tasks,
    loading,
    error,
    getAttendanceRecords,
    saveAttendanceRecord
  };
};
