
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { personnelTypes } from '@/hooks/useEventForm';

interface EventPersonnelSelectProps {
  selectedPersonnel: string[];
  staffCount: Record<string, number>;
  onPersonnelChange: (personnelId: string) => void;
  onStaffCountChange: (personnelId: string, count: number) => void;
}

const EventPersonnelSelect: React.FC<EventPersonnelSelectProps> = ({
  selectedPersonnel,
  staffCount = {}, // Provide default empty object
  onPersonnelChange,
  onStaffCountChange
}) => {
  // Use safe check with nullish coalescing to ensure staffCount is an object
  const totalStaff = Object.values(staffCount || {}).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-4">
      <Label>Tipologia di personale richiesto *</Label>
      <div className="space-y-4">
        {personnelTypes.map((type) => (
          <div key={type.id} className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`personnel-${type.id}`} 
                checked={selectedPersonnel.includes(type.id)}
                onCheckedChange={() => onPersonnelChange(type.id)}
              />
              <Label htmlFor={`personnel-${type.id}`} className="cursor-pointer">
                {type.label}
              </Label>
            </div>
            {selectedPersonnel.includes(type.id) && (
              <div className="flex items-center gap-2">
                <Label htmlFor={`count-${type.id}`}>Numero:</Label>
                <Input
                  id={`count-${type.id}`}
                  type="number"
                  min="1"
                  value={staffCount[type.id] || ""}
                  onChange={(e) => onStaffCountChange(type.id, parseInt(e.target.value) || 0)}
                  className="w-20"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedPersonnel.length > 0 && (
        <div className="pt-2 text-sm font-medium">
          Totale personale richiesto: {totalStaff}
        </div>
      )}
    </div>
  );
};

export default EventPersonnelSelect;
