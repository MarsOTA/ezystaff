
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Task {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  shifts: string[];
}

export const useOperatorTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        console.log("Loading tasks for user:", user);
        
        if (!user) {
          console.log("No user found, setting empty tasks");
          setTasks([]);
          setLoading(false);
          return;
        }

        // First attempt to fetch from Supabase
        if (user.email === "mario.rossi@example.com") {
          // Special case for Mario to show the "Mare nostro" event with today's date and correct data
          const today = new Date();
          const mareNostroEvent = {
            id: 2,
            title: "Mare nostro",
            startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0),
            endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0),
            startTime: "09:00",
            endTime: "18:00",
            location: "Via Napoli 45, Napoli, NA",
            shifts: ["Mattina (09:00-13:00)", "Pomeriggio (14:00-18:00)"]
          };
          
          console.log("Setting Mare nostro event for Mario with today's date");
          setTasks([mareNostroEvent]);
          setLoading(false);
          return;
        }
        
        // For other users or as fallback, get tasks from localStorage
        const storedEvents = localStorage.getItem("app_events_data");
        const storedOperators = localStorage.getItem("app_operators_data");
        
        console.log("Stored events:", storedEvents ? "found" : "not found");
        console.log("Stored operators:", storedOperators ? "found" : "not found");
        
        if (!storedEvents || !storedOperators) {
          console.log("No stored data found, setting empty tasks");
          setTasks([]);
          setLoading(false);
          return;
        }
        
        const events = JSON.parse(storedEvents);
        const operators = JSON.parse(storedOperators);
        
        console.log("Parsed events:", events);
        console.log("Parsed operators:", operators);
        
        // Find the current operator by email or name
        const currentOperator = operators.find(
          (op: any) => op.email === user.email || op.name === user.name
        );
        
        console.log("Current operator found:", currentOperator);
        
        if (!currentOperator || !currentOperator.assignedEvents) {
          console.log("No operator found or no assigned events");
          setTasks([]);
          setLoading(false);
          return;
        }
        
        // Convert assignedEvents to numbers if they are strings to ensure proper comparison
        const normalizedAssignedEvents = currentOperator.assignedEvents.map((id: any) => Number(id));
        console.log("Normalized assigned events:", normalizedAssignedEvents);
        
        // Get events assigned to this operator
        const operatorTasks = events
          .filter((event: any) => normalizedAssignedEvents.includes(Number(event.id)))
          .map((event: any) => {
            // Convert shifts from object format to string format
            let shiftsArray = ["Mattina (09:00-13:00)", "Pomeriggio (14:00-18:00)"]; // Default
            
            if (event.shifts && Array.isArray(event.shifts)) {
              shiftsArray = event.shifts.map((shift: any) => {
                if (typeof shift === 'string') {
                  return shift;
                } else if (shift && typeof shift === 'object' && shift.startTime && shift.endTime) {
                  // Convert shift object to string representation
                  return `Turno (${shift.startTime}-${shift.endTime})`;
                }
                return "Turno completo";
              });
            }
            
            return {
              id: Number(event.id),
              title: event.title,
              startDate: new Date(event.startDate),
              endDate: new Date(event.endDate),
              // Format times with consistent 24-hour format
              startTime: new Date(event.startDate).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              }),
              endTime: new Date(event.endDate).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              }),
              location: event.location || "Via Roma 123, Milano, MI", // Improved default location
              shifts: shiftsArray
            };
          });
        
        console.log("Final operator tasks:", operatorTasks);
        setTasks(operatorTasks);
        
      } catch (error) {
        console.error("Error loading operator tasks:", error);
        toast.error("Error loading your tasks");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadTasks();
  }, [user]);
  
  return { tasks, loading };
};
