
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { Operator } from "@/types/operator";
import AvailabilityBadge, { AvailabilityStatus } from "../availability/AvailabilityBadge";

interface OperatorTableRowProps {
  operator: Operator;
  eventId: string | null;
  availability: AvailabilityStatus;
  conflicts: string[];
  isAssigned: boolean;
  onAssign: (e: React.MouseEvent, operator: Operator) => void;
  onUnassign: (e: React.MouseEvent, operatorId: number, eventIdNum: number) => void;
}

const OperatorTableRow: React.FC<OperatorTableRowProps> = ({
  operator,
  eventId,
  availability,
  conflicts,
  isAssigned,
  onAssign,
  onUnassign
}) => {
  // Split name into first and last name
  const nameParts = operator.name ? operator.name.split(' ') : ['', ''];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const getOperatorProfession = (operator: Operator): string => {
    return operator.profession || "security";
  };

  return (
    <TableRow>
      <TableCell>{firstName}</TableCell>
      <TableCell>{lastName}</TableCell>
      <TableCell>{operator.gender || 'N/A'}</TableCell>
      <TableCell><AvailabilityBadge availability={availability} conflicts={conflicts} /></TableCell>
      <TableCell>{getOperatorProfession(operator)}</TableCell>
      <TableCell className="text-right">
        {isAssigned ? (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              eventId && onUnassign(e, operator.id, parseInt(eventId));
            }}
          >
            <X className="h-4 w-4 mr-1" />
            Rimuovi
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onAssign(e, operator);
            }}
            disabled={availability === 'no'}
          >
            <Plus className="h-4 w-4 mr-1" />
            Assegna
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default OperatorTableRow;
