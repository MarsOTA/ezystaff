
import React, { useState, useMemo } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Plus } from "lucide-react";
import { Operator } from "@/types/operator";

interface OperatorsTableProps {
  operators: Operator[];
  eventId: string | null;
  openAssignDialog: (operator: Operator) => void;
  handleUnassignOperator: (operatorId: number, eventId: number) => void;
}

// Availability types
type AvailabilityStatus = 'yes' | 'no' | 'partial';

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
  
  // Check operator availability for this event
  const checkAvailability = (operator: Operator): AvailabilityStatus => {
    if (!eventId || !operator.assignedEvents || operator.assignedEvents.length === 0) {
      return 'yes';
    }
    
    // If already assigned to this event, they're at least partially available
    if (operator.assignedEvents.includes(parseInt(eventId))) {
      return 'partial';
    }
    
    // If assigned to other events, consider them partially available
    return operator.assignedEvents.length > 0 ? 'partial' : 'yes';
  };
  
  const getOperatorProfession = (operator: Operator): string => {
    return operator.profession || "security";
  };
  
  const getAvailabilityBadge = (availability: AvailabilityStatus) => {
    switch(availability) {
      case 'yes':
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">Disponibile</span>;
      case 'no':
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">Non Disponibile</span>;
      case 'partial':
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">Parziale</span>;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Selezione del personale</Label>
        <Input 
          placeholder="Cerca operatore..." 
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
                // Split name into first and last name
                const nameParts = operator.name ? operator.name.split(' ') : ['', ''];
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';
                const availability = checkAvailability(operator);
                const isAssigned = eventId ? operator.assignedEvents?.includes(parseInt(eventId)) : false;
                
                return (
                  <TableRow key={operator.id}>
                    <TableCell>{firstName}</TableCell>
                    <TableCell>{lastName}</TableCell>
                    <TableCell>{operator.gender || 'N/A'}</TableCell>
                    <TableCell>{getAvailabilityBadge(availability)}</TableCell>
                    <TableCell>{getOperatorProfession(operator)}</TableCell>
                    <TableCell className="text-right">
                      {isAssigned ? (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => eventId && handleUnassignOperator(operator.id, parseInt(eventId))}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rimuovi
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => openAssignDialog(operator)}>
                          <Plus className="h-4 w-4 mr-1" />
                          Assegna
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
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
