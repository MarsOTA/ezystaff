
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EventActionsProps {
  onCreateEvent: () => void;
}

const EventActions: React.FC<EventActionsProps> = ({ onCreateEvent }) => {
  return (
    <Button onClick={onCreateEvent}>
      <Plus className="mr-2 h-4 w-4" />
      Crea nuovo evento
    </Button>
  );
};

export default EventActions;
