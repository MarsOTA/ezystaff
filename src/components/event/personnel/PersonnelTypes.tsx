
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

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
  // Use a single "personnel" key for the counter
  const personnelCount = personnelCounts['personnel'] || 0;
  
  const handleCountChange = (e: React.MouseEvent, newCount: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Don't allow negative counts
    if (newCount < 0) return;
    
    onPersonnelCountChange(e, 'personnel', newCount);
  };
  
  return (
    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
      <Label>Numero Personale *</Label>
      <div className="flex items-center justify-between border p-3 rounded-md">
        <div className="flex items-center">
          <Label className="font-medium">
            Numero Personale
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={(e) => handleCountChange(e, personnelCount - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium text-lg">{personnelCount}</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={(e) => handleCountChange(e, personnelCount + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <div className="text-sm font-medium text-gray-700">
          Totale personale richiesto: <span className="text-lg font-bold text-blue-600">{personnelCount}</span>
        </div>
      </div>
    </div>
  );
};

export default PersonnelTypes;
