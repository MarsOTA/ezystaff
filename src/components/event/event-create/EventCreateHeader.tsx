
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventCreateHeaderProps {
  isEditMode: boolean;
}

const EventCreateHeader: React.FC<EventCreateHeaderProps> = ({ isEditMode }) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-4">
      <Button 
        variant="outline" 
        onClick={() => navigate('/events')}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Torna agli eventi
      </Button>
    </div>
  );
};

export default EventCreateHeader;
