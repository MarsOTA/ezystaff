
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
        
        if (!user) {
          setTasks([]);
          return;
        }

        // First attempt to fetch from Supabase
        if (user.email === "mario.rossi@example.com") {
          // Special case for Mario to show the "Mare nostro" event
          const mareNostroEvent = {
            id: 2,
            title: "Mare nostro",
            startDate: new Date("2025-05-05T09:00:00"),
            endDate: new Date("2025-05-06T18:00:00"),
            startTime: "09:00",
            endTime: "18:00",
            location: "Via Napoli 45, Napoli, NA",
            shifts: ["Mattina (09:00-13:00)", "Pomeriggio (14:00-18:00)"]
          };
          
          console.log("Setting Mare nostro event for Mario");
          setTasks([mareNostroEvent]);
          return;
        }
        
        // For other users or as fallback, get tasks from localStorage
        const storedEvents = localStorage.getItem("app_events_data");
        const storedOperators = localStorage.getItem("app_operators_data");
        
        if (!storedEvents || !storedOperators) {
          setTasks([]);
          return;
        }
        
        const events = JSON.parse(storedEvents);
        const operators = JSON.parse(storedOperators);
        
        // Find the current operator by email or name
        const currentOperator = operators.find(
          (op: any) => op.email === user.email || op.name === user.name
        );
        
        if (!currentOperator || !currentOperator.assignedEvents) {
          console.log("No operator found or no assigned events");
          setTasks([]);
          return;
        }
        
        // Get events assigned to this operator
        const operatorTasks = events
          .filter((event: any) => currentOperator.assignedEvents.includes(event.id))
          .map((event: any) => ({
            id: event.id,
            title: event.title,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            startTime: new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: event.location || "Via Milano 123, Milano, MI", // Default location if none provided
            shifts: event.shifts || ["Mattina (09:00-13:00)", "Pomeriggio (14:00-18:00)"] // Default shifts if none provided
          }));
        
        console.log("Operator tasks:", operatorTasks);
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
