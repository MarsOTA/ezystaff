
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
        
        // Get tasks from localStorage
        const storedEvents = localStorage.getItem("app_events_data");
        const storedOperators = localStorage.getItem("app_operators_data");
        
        if (!storedEvents || !storedOperators || !user) {
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
