
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CalendarClock } from "lucide-react";
import { Event } from "@/types/event";
import { Operator } from "@/types/operator";

interface OperatorsListProps {
  operators: Operator[];
  events: Event[];
  onStatusToggle: (id: number) => void;
  onEdit: (operator: Operator) => void;
  onDelete: (id: number) => void;
  onAssign: (operator: Operator) => void;
}

const OperatorsList: React.FC<OperatorsListProps> = ({
  operators,
  events,
  onStatusToggle,
  onEdit,
  onDelete,
  onAssign,
}) => {
  // Helper function to count assigned events for an operator
  const getAssignedEventCount = (operatorId: number) => {
    const operator = operators.find(op => op.id === operatorId);
    if (!operator || !operator.assignedEvents || operator.assignedEvents.length === 0) {
      return 0;
    }
    return operator.assignedEvents.length;
  };

  // Helper function to get first and last name
  const getFirstName = (fullName: string) => {
    const parts = fullName.split(' ');
    return parts[0] || '';
  };

  const getLastName = (fullName: string) => {
    const parts = fullName.split(' ');
    return parts.slice(1).join(' ') || '';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Cognome</TableHead>
          <TableHead>Telefono</TableHead>
          <TableHead>Tot. Eventi</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {operators.map((operator) => {
          const firstName = getFirstName(operator.name);
          const lastName = getLastName(operator.name);
          const eventCount = getAssignedEventCount(operator.id);

          return (
            <TableRow key={operator.id}>
              <TableCell>{firstName}</TableCell>
              <TableCell>{lastName}</TableCell>
              <TableCell>{operator.phone}</TableCell>
              <TableCell>{eventCount}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onEdit(operator)}
                    title="Modifica operatore"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onAssign(operator)}
                    title="Assegna a evento"
                  >
                    <CalendarClock className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(operator.id)}
                    title="Elimina operatore"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default OperatorsList;
