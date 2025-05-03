
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { safeLocalStorage } from "@/utils/fileUtils";
import { Event } from "@/types/event";
import { Operator } from "@/types/operator";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  EVENTS_STORAGE_KEY, 
  OPERATORS_STORAGE_KEY, 
  loadOperators, 
  findOperatorByEmail,
  findOperatorByNameOrId,
  saveOperators,
  ATTENDANCE_RECORDS_KEY
} from "@/utils/operatorUtils";

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
        setTasks([]);
        setTodayTask(null);
        setUpcomingTasks([]);
        setPastTasks([]);
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
      
      // Load operators directly using the utility function
      const operators = loadOperators();
      console.log("All operators found:", operators.length);
      console.log("Current user:", user);
      
      // First try to find by email
      let currentOperator = findOperatorByEmail(operators, user.email);
      
      // If not found by email, try finding by name
      if (!currentOperator && user.name) {
        console.log("No email match, trying name match for:", user.name);
        currentOperator = findOperatorByNameOrId(operators, user.name);
        
        // If found by name, update the email for future logins
        if (currentOperator && user.email && (!currentOperator.email || currentOperator.email !== user.email)) {
          console.log(`Updating operator ${currentOperator.name}'s email from ${currentOperator.email || 'empty'} to ${user.email}`);
          currentOperator.email = user.email;
          // Save updated operators
          saveOperators(operators);
        }
      }
      
      // If still not found, show a friendlier error message
      if (!currentOperator) {
        console.log("Current operator not found for user:", user);
        setLoading(false);
        setError(`Operatore non trovato per ${user.name || user.email}. Controlla che l'operatore sia stato registrato.`);
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
        setError("Non hai eventi assegnati");
        return;
      }
      
      processOperatorEvents(currentOperator, events);
      
    } catch (error) {
      console.error("Error loading tasks:", error);
      setError("Errore nel caricamento delle attività");
      toast.error("Errore nel caricamento delle attività");
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Function to process operator's assigned events
  const processOperatorEvents = (currentOperator: Operator, events: Event[]) => {
    console.log("Processing events for operator:", currentOperator.name);
    console.log("Assigned event IDs:", currentOperator.assignedEvents);
    
    // Convert event IDs to numbers for proper comparison
    const assignedEventIds = currentOperator.assignedEvents.map((id: any) => 
      typeof id === 'string' ? parseInt(id, 10) : id
    );
    
    // Filter events assigned to the operator
    const assignedEvents = events.filter((event: any) => {
      const eventId = typeof event.id === 'string' ? parseInt(event.id, 10) : event.id;
      const isIncluded = assignedEventIds.includes(eventId);
      console.log(`Event ${event.id} (${event.title}) included for ${currentOperator.name}: ${isIncluded}`);
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
    
    // Find today's task
    const todayTasks = operatorTasks.filter(task => {
      const taskDate = new Date(task.startDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });
    
    console.log(`Today's date: ${today.toISOString()}, found ${todayTasks.length} tasks for today`);
    todayTasks.forEach((task, i) => {
      console.log(`Today's task ${i+1}: ${task.title}, date: ${task.startDate.toISOString()}`);
    });
    
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
  };

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
