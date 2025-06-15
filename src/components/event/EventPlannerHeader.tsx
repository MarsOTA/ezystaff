
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventPlannerHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={() => navigate("/operators")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Torna alla Lista
      </Button>
      <h1 className="text-2xl font-bold">Event Planner</h1>
    </div>
  );
};

export default EventPlannerHeader;
