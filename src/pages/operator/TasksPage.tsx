
import React from "react";
import OperatorLayout from "@/components/OperatorLayout";
import TaskCard from "@/components/operator/tasks/TaskCard";
import { useOperatorTasks } from "@/hooks/useOperatorTasks";
import { useAttendance } from "@/hooks/useAttendance";

const TasksPage: React.FC = () => {
  const { tasks, loading } = useOperatorTasks();
  
  // Se non ci sono attività disponibili, usa un evento mock per la dimostrazione
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
  
  const currentEvent = tasks.length > 0 ? tasks[0] : mockEvent;
  
  const {
    isCheckingIn,
    locationStatus,
    loadingLocation,
    lastCheckTime,
    locationAccuracy,
    handleCheckAction
  } = useAttendance({ eventId: currentEvent.id });

  return (
    <OperatorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Le tue attività di oggi</h1>
        
        {loading ? (
          <div className="p-8 text-center">Caricamento attività...</div>
        ) : tasks.length === 0 ? (
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
