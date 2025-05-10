
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Operator } from "@/types/operator";

interface AssignedOperatorsListProps {
  assignedOperators: Operator[];
  eventId: string | null;
  handleUnassignOperator: (operatorId: number, eventId: number) => void;
}

const AssignedOperatorsList: React.FC<AssignedOperatorsListProps> = ({
  assignedOperators,
  eventId,
  handleUnassignOperator
}) => {
  const getOperatorProfession = (operator: Operator): string => {
    return operator.profession || operator.occupation || "security";
  };

  return (
    <div className="space-y-2">
      <Label>Personale assegnato all'evento ({assignedOperators.length})</Label>
      <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
        {assignedOperators.length > 0 ? (
          <ul className="divide-y">
            {assignedOperators.map((operator) => (
              <li key={operator.id} className="py-2 flex justify-between items-center">
                <div>
                  <span className="font-medium">{operator.name}</span>
                  <span className="ml-2 text-sm text-gray-500">{getOperatorProfession(operator)}</span>
                </div>
                {eventId && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500" 
                    onClick={() => handleUnassignOperator(operator.id, parseInt(eventId))}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Rimuovi
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Nessun operatore assegnato a questo evento
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedOperatorsList;
