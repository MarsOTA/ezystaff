
import React from "react";
import { MapPin } from "lucide-react";

interface TaskLocationProps {
  location: string;
}

const TaskLocation: React.FC<TaskLocationProps> = ({ location }) => {
  return (
    <div className="flex items-start space-x-3">
      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
      <div>
        <div className="font-medium">Luogo</div>
        <div className="text-sm text-muted-foreground">
          {location}
        </div>
      </div>
    </div>
  );
};

export default TaskLocation;
