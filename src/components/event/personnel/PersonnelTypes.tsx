
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
  
  const handleCountChange = (e: React.MouseEvent, personnelId: string, newCount: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Don't allow negative counts
    if (newCount < 0) return;
    
    // Auto-update selectedPersonnel based on count
    if (newCount > 0 && !selectedPersonnel.includes(personnelId)) {
      onPersonnelChange(personnelId);
    } else if (newCount === 0 && selectedPersonnel.includes(personnelId)) {
      onPersonnelChange(personnelId);
    }
    
    onPersonnelCountChange(e, personnelId, newCount);
  };
  
  return (
    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
      <Label>Quantità di personale richiesto *</Label>
      <div className="space-y-4">
        {personnelTypes.map((type) => (
          <div key={type.id} className="flex items-center justify-between border p-3 rounded-md">
            <div className="flex items-center">
              <Label className="font-medium">
                {type.label}
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={(e) => handleCountChange(e, type.id, (personnelCounts[type.id] || 0) - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium text-lg">{personnelCounts[type.id] || 0}</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={(e) => handleCountChange(e, type.id, (personnelCounts[type.id] || 0) + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <div className="text-sm font-medium text-gray-700">
          Totale personale richiesto: <span className="text-lg font-bold text-blue-600">{totalPersonnelCount}</span>
        </div>
      </div>
    </div>
  );
};

export default PersonnelTypes;
