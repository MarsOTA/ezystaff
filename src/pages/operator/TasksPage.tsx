
import React from "react";
import OperatorLayout from "@/components/OperatorLayout";
import TaskCard from "@/components/operator/tasks/TaskCard";
import { useAttendance } from "@/hooks/useAttendance";

const TasksPage: React.FC = () => {
  // Mock event data - in a real application, this would be loaded from a backend
  const mockEvent = {
    id: 1,
    title: "Milano Security Conference",
    startDate: new Date("2025-04-15T09:00:00"),
    endDate: new Date("2025-04-16T18:00:00"),
    startTime: "09:00",
    endTime: "18:00",
    location: "Via Milano 123, Milano, MI",
    shifts: ["Mattina (09:00-13:00)", "Pomeriggio (14:00-18:00)"]
  };

  const {
    isCheckingIn,
    locationStatus,
    loadingLocation,
    lastCheckTime,
    locationAccuracy,
    handleCheckAction
  } = useAttendance({ eventId: mockEvent.id });

  return (
    <OperatorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Le tue attività di oggi</h1>
        
        <TaskCard 
          event={mockEvent}
          isCheckingIn={isCheckingIn}
          loadingLocation={loadingLocation}
          lastCheckTime={lastCheckTime}
          locationStatus={locationStatus}
          locationAccuracy={locationAccuracy}
          onCheckAction={handleCheckAction}
        />
      </div>
    </OperatorLayout>
  );
};

export default TasksPage;
