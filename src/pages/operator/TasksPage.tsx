
import React from "react";
import OperatorLayout from "@/components/OperatorLayout";
import TaskCard from "@/components/operator/tasks/TaskCard";
import { useOperatorTasks } from "@/hooks/useOperatorTasks";
import { useOperatorAttendance } from "@/hooks/useOperatorAttendance";

// Helper function to safely convert to Date
const safeToDate = (dateValue: any): Date => {
  if (!dateValue) return new Date();
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? new Date() : date;
};

const TasksPage: React.FC = () => {
  const { tasks, loading } = useOperatorTasks();
  
  // Mock event for demonstration when no tasks are available
  const mockEvent = {
    id: 1,
    title: "Milano Security Conference",
    startDate: new Date("2025-05-05T09:00:00"),
    endDate: new Date("2025-05-06T18:00:00"),
    startTime: "09:00",
    endTime: "18:00",
    location: "Via Milano 123, Milano, MI",
    shifts: ["Mattina (09:00-13:00)", "Pomeriggio (14:00-18:00)"]
  };
  
  // Select the most relevant event to display using proper prioritization
  const today = new Date();
  
  // Ensure all task dates are properly converted
  const validTasks = tasks.map(task => ({
    ...task,
    startDate: safeToDate(task.startDate),
    endDate: safeToDate(task.endDate)
  }));
  
  // 1) Find event that includes today's date
  const todayEvent = validTasks.find(
    (e) => e.startDate <= today && e.endDate >= today
  );
  
  // 2) If no today event exists, find the first upcoming event sorted by start date
  const upcomingEvent = validTasks
    .filter((e) => e.startDate > today)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0];
  
  // Use today's event if available, otherwise upcoming event, finally fallback to mock
  const currentEvent = todayEvent ?? upcomingEvent ?? mockEvent;
  
  const {
    isCheckingIn,
    locationStatus,
    loadingLocation,
    lastCheckTime,
    locationAccuracy,
    handleCheckAction
  } = useOperatorAttendance({ eventId: currentEvent.id });

  return (
    <OperatorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Le tue attività di oggi</h1>
        
        {loading ? (
          <div className="p-8 text-center">Caricamento attività...</div>
        ) : validTasks.length === 0 ? (
          <TaskCard 
            event={mockEvent}
            isCheckingIn={isCheckingIn}
            loadingLocation={loadingLocation}
            lastCheckTime={lastCheckTime}
            locationStatus={locationStatus}
            locationAccuracy={locationAccuracy}
            onCheckAction={handleCheckAction}
          />
        ) : (
          <TaskCard 
            event={currentEvent}
            isCheckingIn={isCheckingIn}
            loadingLocation={loadingLocation}
            lastCheckTime={lastCheckTime}
            locationStatus={locationStatus}
            locationAccuracy={locationAccuracy}
            onCheckAction={handleCheckAction}
          />
        )}
      </div>
    </OperatorLayout>
  );
};

export default TasksPage;
