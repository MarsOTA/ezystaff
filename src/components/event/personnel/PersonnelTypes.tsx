
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus } from "lucide-react";
import { personnelTypes } from '@/types/eventForm';

interface PersonnelTypesProps {
  selectedPersonnel: string[];
  onPersonnelChange: (personnelId: string) => void;
  personnelCounts: Record<string, number>;
  onPersonnelCountChange: (e: React.MouseEvent, personnelId: string, count: number) => void;
}

const PersonnelTypes: React.FC<PersonnelTypesProps> = ({
  selectedPersonnel,
  onPersonnelChange,
  personnelCounts,
  onPersonnelCountChange
}) => {
  // Calculate total personnel count
  const totalPersonnelCount = Object.values(personnelCounts).reduce((sum, count) => sum + count, 0);
  
  const handlePersonnelChange = (e: React.MouseEvent, personnelId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onPersonnelChange(personnelId);
  };
  
  return (
    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
      <Label>Quantità di personale richiesto *</Label>
      <div className="space-y-4">
        {personnelTypes.map((type) => (
          <div key={type.id} className="flex items-center justify-between border p-2 rounded-md">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`personnel-${type.id}`} 
                checked={selectedPersonnel.includes(type.id)}
                onCheckedChange={(checked) => {
                  // Prevent form submission
                  const e = window.event;
                  if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                  onPersonnelChange(type.id);
                }}
              />
              <Label 
                htmlFor={`personnel-${type.id}`} 
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {type.label}
              </Label>
            </div>
            {selectedPersonnel.includes(type.id) && (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={(e) => onPersonnelCountChange(e, type.id, (personnelCounts[type.id] || 0) - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{personnelCounts[type.id] || 0}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={(e) => onPersonnelCountChange(e, type.id, (personnelCounts[type.id] || 0) + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm font-medium">
        Totale personale richiesto: {totalPersonnelCount}
      </div>
    </div>
  );
};

export default PersonnelTypes;
