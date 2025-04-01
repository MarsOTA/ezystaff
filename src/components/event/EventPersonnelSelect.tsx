
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { personnelTypes } from '@/hooks/useEventForm';

interface EventPersonnelSelectProps {
  selectedPersonnel: string[];
  onPersonnelChange: (personnelId: string) => void;
}

const EventPersonnelSelect: React.FC<EventPersonnelSelectProps> = ({
  selectedPersonnel,
  onPersonnelChange
}) => {
  return (
    <div className="space-y-2">
      <Label>Tipologia di personale richiesto *</Label>
      <div className="space-y-2">
        {personnelTypes.map((type) => (
          <div key={type.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`personnel-${type.id}`} 
              checked={selectedPersonnel.includes(type.id)}
              onCheckedChange={() => onPersonnelChange(type.id)}
            />
            <Label htmlFor={`personnel-${type.id}`} className="cursor-pointer">
              {type.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventPersonnelSelect;
