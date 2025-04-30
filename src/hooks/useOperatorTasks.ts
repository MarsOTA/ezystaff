
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { safeLocalStorage } from "@/utils/fileUtils";
import { Event } from "@/types/event";
import { Operator } from "@/types/operator";
import { toast } from "sonner";
import { format } from "date-fns";

export const EVENTS_STORAGE_KEY = "app_events_data";
export const OPERATORS_STORAGE_KEY = "app_operators_data";

interface OperatorTask {
  eventId: number;
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  address?: string;
  client: string;
  shifts: string[];
}

interface UseOperatorTasksResult {
  loading: boolean;
  tasks: OperatorTask[];
  todayTask: OperatorTask | null;
  upcomingTasks: OperatorTask[];
  pastTasks: OperatorTask[];
  operator: Operator | null;
  refreshTasks: () => void;
  error: string | null;
}

export const useOperatorTasks = (): UseOperatorTasksResult => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<OperatorTask[]>([]);
  const [todayTask, setTodayTask] = useState<OperatorTask | null>(null);
  const [upcomingTasks, setUpcomingTasks] = useState<OperatorTask[]>([]);
  const [pastTasks, setPastTasks] = useState<OperatorTask[]>([]);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(() => {
    if (!user) {
      console.log("No user found, cannot load tasks");
      setLoading(false);
      setError("Utente non autenticato");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Loading tasks for user:", user);
      
      // Get all events first
      const eventsData = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
      if (!eventsData) {
        console.log("No events data found");
        setLoading(false);
        setError("Nessun evento trovato");
        return;
      }
      
      // Parse all events 
      const eventsRaw = JSON.parse(eventsData);
      const events = eventsRaw.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
      }));
      console.log("All events found:", events.length);
      
      // Get operators data
      const operatorsData = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
      if (!operatorsData) {
        console.log("No operators data found");
        setLoading(false);
        setError("Nessun operatore trovato");
        return;
      }
      
      const operators = JSON.parse(operatorsData);
      console.log("All operators found:", operators.length);
      console.log("Current user:", user);
      
      // Improved operator matching strategy - first try exact email match, then try name match
      let currentOperator = operators.find((op: any) => op.email && op.email.toLowerCase() === user.email.toLowerCase());
      
      // If no match by email, try by name
      if (!currentOperator) {
        currentOperator = operators.find((op: any) => op.name === user.name);
      }
      
      // Debug each operator we're checking
      operators.forEach((op: any) => {
        console.log(`Operator: ${op.name}, email: ${op.email}`);
      });
      
      if (!currentOperator) {
        console.log("Current operator not found for user:", user);
        setLoading(false);
        setError("Operatore non trovato");
        return;
      }
      
      console.log("Found current operator:", currentOperator);
      setOperator(currentOperator);
      
      if (!currentOperator.assignedEvents || currentOperator.assignedEvents.length === 0) {
        console.log("No assigned events found for operator");
        setLoading(false);
        setTasks([]);
        setTodayTask(null);
        setUpcomingTasks([]);
        setPastTasks([]);
        return;
      }
      
      console.log("Assigned event IDs:", currentOperator.assignedEvents);
      
      // Convert event IDs to numbers for proper comparison
      const assignedEventIds = currentOperator.assignedEvents.map((id: any) => 
        typeof id === 'string' ? parseInt(id, 10) : id
      );
      
      // Filter events assigned to the operator
      const assignedEvents = events.filter((event: any) => {
        const eventId = typeof event.id === 'string' ? parseInt(event.id, 10) : event.id;
        const isIncluded = assignedEventIds.includes(eventId);
        console.log(`Event ${event.id} (${event.title}) included: ${isIncluded}`);
        return isIncluded;
      });
      
      console.log("Found assigned events:", assignedEvents.length);
      
      // Convert to tasks format
      const operatorTasks = assignedEvents.map((event: Event): OperatorTask => {
        // Create shifts based on start and end times
        const startTime = format(event.startDate, "HH:mm");
        const endTime = format(event.endDate, "HH:mm");
        
        let shifts = [`${startTime} - ${endTime}`];
        
        // If the event has break times, add an additional shift
        if (event.breakStartTime && event.breakEndTime) {
          shifts = [
            `${startTime} - ${event.breakStartTime}`,
            `${event.breakEndTime} - ${endTime}`
          ];
        }
        
        return {
          eventId: event.id,
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          address: event.address,
          client: event.client,
          shifts
        };
      });
      
      setTasks(operatorTasks);
      
      // Sort tasks by date
      operatorTasks.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
      
      // Categorize tasks
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Find today's task
      const todayTasks = operatorTasks.filter(task => {
        const taskDate = new Date(task.startDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      });
      
      console.log(`Today's date: ${today.toISOString()}, found ${todayTasks.length} tasks for today`);
      
      // Find upcoming tasks (future but not today)
      const upcoming = operatorTasks.filter(task => {
        const taskDate = new Date(task.startDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate > today;
      });
      
      // Find past tasks
      const past = operatorTasks.filter(task => {
        const taskDate = new Date(task.endDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate < today;
      });
      
      setTodayTask(todayTasks.length > 0 ? todayTasks[0] : null);
      setUpcomingTasks(upcoming);
      setPastTasks(past);
      
      console.log("Tasks processed:", {
        today: todayTasks.length,
        upcoming: upcoming.length,
        past: past.length
      });
      
    } catch (error) {
      console.error("Error loading tasks:", error);
      setError("Errore nel caricamento delle attività");
      toast.error("Errore nel caricamento delle attività");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load tasks on mount and when user changes
  useEffect(() => {
    loadTasks();
    
    // Set up storage event listener to detect changes from other tabs
    const handleStorageChange = () => {
      loadTasks();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up a periodic refresh every minute
    const intervalId = setInterval(loadTasks, 60000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [loadTasks]);

  return {
    loading,
    tasks,
    todayTask,
    upcomingTasks,
    pastTasks,
    operator,
    refreshTasks: loadTasks,
    error
  };
};
