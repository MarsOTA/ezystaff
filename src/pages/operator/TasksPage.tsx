
import React from "react";
import OperatorLayout from "@/components/OperatorLayout";
import TaskCard from "@/components/operator/tasks/TaskCard";
import { useOperatorTasks } from "@/hooks/useOperatorTasks";
import { useOperatorAttendance } from "@/hooks/useOperatorAttendance";
import { useAuth } from "@/contexts/AuthContext";
import { Operator } from "@/types/operator";

// Helper function to safely convert to Date
const safeToDate = (dateValue: any): Date => {
  if (!dateValue) return new Date();
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? new Date() : date;
};

const TasksPage: React.FC = () => {
  const { tasks, loading } = useOperatorTasks();
  const { user } = useAuth();
  
  console.log("useOperatorTasks result:", { tasks, loading, tasksLength: tasks?.length });
  
  // Mock event for demonstration when no tasks are available - SET FOR TODAY with correct data
  const today = new Date();
  const mockEvent = {
    id: 1,
    title: "Conferenza Sicurezza Milano",
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0),
    startTime: "09:00",
    endTime: "18:00",
    location: "Centro Congressi Milano, Via Conferenze 15, Milano, MI",
    shifts: ["Mattina (09:00-13:00)", "Pomeriggio (14:00-18:00)"],
    eventReferentName: "Marco",
    eventReferentSurname: "Bianchi",
    eventReferentPhone: "+39 333 987 6543",
    teamLeaderId: 1
  };
  
  // Select the most relevant event to display using proper prioritization
  
  // Ensure all task dates are properly converted
  const validTasks = Array.isArray(tasks) ? tasks.map(task => ({
    ...task,
    startDate: safeToDate(task.startDate),
    endDate: safeToDate(task.endDate)
  })) : [];
  
  console.log("Valid tasks after processing:", validTasks);
  
  // 1) Find event that includes today's date
  const todayEvent = validTasks.find(
    (e) => {
      const eventStart = new Date(e.startDate.getFullYear(), e.startDate.getMonth(), e.startDate.getDate());
      const eventEnd = new Date(e.endDate.getFullYear(), e.endDate.getMonth(), e.endDate.getDate());
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      return todayDate >= eventStart && todayDate <= eventEnd;
    }
  );
  
  // 2) If no today event exists, find the first upcoming event sorted by start date
  const upcomingEvent = validTasks
    .filter((e) => e.startDate > today)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0];
  
  // Use today's event if available, otherwise upcoming event, finally fallback to mock
  const currentEvent = todayEvent ?? upcomingEvent ?? mockEvent;
  
  console.log("Selected event:", {
    todayEvent: !!todayEvent,
    upcomingEvent: !!upcomingEvent,
    usingMock: !todayEvent && !upcomingEvent,
    currentEvent: {
      id: currentEvent.id,
      title: currentEvent.title,
      startDate: currentEvent.startDate,
      endDate: currentEvent.endDate,
      location: currentEvent.location
    }
  });
  
  const {
    isCheckingIn,
    locationStatus,
    loadingLocation,
    lastCheckTime,
    locationAccuracy,
    handleCheckAction,
    isCurrentlyCheckedIn
  } = useOperatorAttendance({ eventId: currentEvent.id });

  console.log("Attendance hook result:", {
    isCheckingIn,
    locationStatus,
    loadingLocation,
    lastCheckTime,
    locationAccuracy,
    isCurrentlyCheckedIn
  });

  // Get operators data to show colleagues and team leader
  const getOperatorsData = () => {
    try {
      const storedOperators = localStorage.getItem("app_operators_data");
      const storedEvents = localStorage.getItem("app_events_data");
      
      if (!storedOperators || !storedEvents) {
        return { assignedOperators: [], teamLeader: null };
      }
      
      const operators = JSON.parse(storedOperators);
      const events = JSON.parse(storedEvents);
      
      // Find the current event in stored events
      const eventData = events.find((e: any) => e.id === currentEvent.id);
      
      // Get all operators assigned to this event (excluding current user)
      const assignedOperators = operators.filter((op: Operator) => {
        if (!op.assignedEvents) return false;
        const isAssigned = op.assignedEvents.includes(currentEvent.id);
        const isCurrentUser = op.email === user?.email || op.name === user?.name;
        return isAssigned && !isCurrentUser;
      });
      
      // Get team leader if specified
      const teamLeader = eventData?.teamLeaderId 
        ? operators.find((op: Operator) => op.id === eventData.teamLeaderId)
        : null;
      
      return { assignedOperators, teamLeader };
    } catch (error) {
      console.error("Error getting operators data:", error);
      return { assignedOperators: [], teamLeader: null };
    }
  };

  const { assignedOperators, teamLeader } = getOperatorsData();

  if (loading) {
    console.log("Showing loading state");
    return (
      <OperatorLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Le tue attività di oggi</h1>
          <div className="p-8 text-center">Caricamento attività...</div>
        </div>
      </OperatorLayout>
    );
  }

  console.log("Rendering TaskCard with:", { currentEvent, assignedOperators, teamLeader });

  return (
    <OperatorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Le tue attività di oggi</h1>
        
        <TaskCard 
          event={currentEvent}
          isCheckingIn={isCheckingIn}
          loadingLocation={loadingLocation}
          lastCheckTime={lastCheckTime}
          locationStatus={locationStatus}
          locationAccuracy={locationAccuracy}
          onCheckAction={handleCheckAction}
          assignedOperators={assignedOperators}
          teamLeader={teamLeader}
        />
      </div>
    </OperatorLayout>
  );
};

export default TasksPage;
