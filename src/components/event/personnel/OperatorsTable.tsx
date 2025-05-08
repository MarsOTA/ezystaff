
import React, { useState, useMemo } from 'react';
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Operator } from "@/types/operator";

// Import custom components
import OperatorSearch from "./search/OperatorSearch";
import OperatorTableRow from "./rows/OperatorTableRow";
import { checkAvailability, getConflictingEvents } from "./utils/operatorAvailability";

interface OperatorsTableProps {
  operators: Operator[];
  eventId: string | null;
  openAssignDialog: (operator: Operator) => void;
  handleUnassignOperator: (operatorId: number, eventId: number) => void;
}

const OperatorsTable: React.FC<OperatorsTableProps> = ({
  operators,
  eventId,
  openAssignDialog,
  handleUnassignOperator
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter operators based on search query
  const filteredOperators = useMemo(() => {
    return operators.filter(operator => {
      const fullName = `${operator.name || ''}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
  }, [operators, searchQuery]);
  
  const handleAssign = (e: React.MouseEvent, operator: Operator) => {
    e.stopPropagation();
    e.preventDefault();
    openAssignDialog(operator);
  };
  
  const handleUnassign = (e: React.MouseEvent, operatorId: number, eventIdNum: number) => {
    e.stopPropagation();
    e.preventDefault();
    handleUnassignOperator(operatorId, eventIdNum);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Selezione del personale</Label>
        <OperatorSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cognome</TableHead>
              <TableHead>Sesso</TableHead>
              <TableHead>Disponibile</TableHead>
              <TableHead>Professione</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOperators.length > 0 ? (
              filteredOperators.map((operator) => {
                const availability = checkAvailability(operator, eventId);
                const conflicts = getConflictingEvents(operator, eventId);
                const isAssigned = eventId ? operator.assignedEvents?.includes(parseInt(eventId)) : false;
                
                return (
                  <OperatorTableRow
                    key={operator.id}
                    operator={operator}
                    eventId={eventId}
                    availability={availability}
                    conflicts={conflicts}
                    isAssigned={isAssigned}
                    onAssign={handleAssign}
                    onUnassign={handleUnassign}
                  />
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Nessun operatore trovato
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OperatorsTable;
