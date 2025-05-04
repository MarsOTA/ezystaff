
import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Loader2 } from "lucide-react";

interface TaskCheckButtonProps {
  isCheckingIn: boolean;
  loadingLocation: boolean;
  onCheck: () => void;
}

const TaskCheckButton: React.FC<TaskCheckButtonProps> = ({
  isCheckingIn,
  loadingLocation,
  onCheck
}) => {
  return (
    <Button 
      size="lg" 
      className="w-full"
      onClick={onCheck}
      disabled={loadingLocation}
    >
      {loadingLocation ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Rilevamento posizione...
        </>
      ) : isCheckingIn ? (
        <>
          <LogIn className="mr-2 h-5 w-5" />
          Check-in
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-5 w-5" />
          Check-out
        </>
      )}
    </Button>
  );
};

export default TaskCheckButton;
