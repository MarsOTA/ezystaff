
import React from "react";
import { MapPin } from "lucide-react";

interface TaskLocationProps {
  location: string;
}

const TaskLocation: React.FC<TaskLocationProps> = ({ location }) => {
  return (
    <div className="flex items-center space-x-2">
      <MapPin className="h-5 w-5 text-muted-foreground" />
      <span>{location}</span>
    </div>
  );
};

export default TaskLocation;
