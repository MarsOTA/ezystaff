
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EventPlannerActionsProps {
  selectedEventId: string;
  onAssign: () => void;
}

const EventPlannerActions: React.FC<EventPlannerActionsProps> = ({
  selectedEventId,
  onAssign
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 justify-end">
      <Button variant="outline" onClick={() => navigate("/operators")}>
        Annulla
      </Button>
      <Button onClick={onAssign} disabled={!selectedEventId}>
        Assegna Operatore
      </Button>
    </div>
  );
};

export default EventPlannerActions;
