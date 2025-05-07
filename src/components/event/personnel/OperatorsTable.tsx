
import React, { useState, useMemo } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Plus, AlertCircle } from "lucide-react";
import { Operator } from "@/types/operator";
import { useOperators } from "@/hooks/useOperators";
import { EVENTS_STORAGE_KEY } from "@/types/event";
import { safeLocalStorage } from "@/utils/fileUtils";

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
  const { isOperatorAvailable } = useOperators();
  
  // Filter operators based on search query
  const filteredOperators = useMemo(() => {
    return operators.filter(operator => {
      const fullName = `${operator.name || ''}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
  }, [operators, searchQuery]);
  
  // Get any conflicting events for the operator
  const getConflictingEvents = (operator: Operator) => {
    if (!eventId || !operator.assignedEvents || operator.assignedEvents.length === 0) {
      return [];
    }
    
    try {
      const eventIdNum = parseInt(eventId);
      if (isNaN(eventIdNum)) return [];
      
      const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
      if (!storedEvents) return [];
      
      const events = JSON.parse(storedEvents);
      const currentEvent = events.find((e: any) => e.id === eventIdNum);
      if (!currentEvent) return [];
      
      const currentStart = new Date(currentEvent.startDate);
      const currentEnd = new Date(currentEvent.endDate);
      
      // Find conflicting events based on time overlap
      return events
        .filter((e: any) => {
          if (e.id === eventIdNum) return false;
          if (!operator.assignedEvents?.includes(e.id)) return false;
          
          const eventStart = new Date(e.startDate);
          const eventEnd = new Date(e.endDate);
          
          // Check for time overlap
          return (currentStart <= eventEnd && eventStart <= currentEnd);
        })
        .map((e: any) => e.title);
    } catch (error) {
      console.error("Error finding conflicting events:", error);
      return [];
    }
  };
  
  // Check operator availability for this event
  const checkAvailability = (operator: Operator): AvailabilityStatus => {
    if (!eventId) return 'yes';
    
    try {
      const eventIdNum = parseInt(eventId);
      if (isNaN(eventIdNum)) return 'yes';
      
      // If already assigned to this event, they're at least partially available
      if (operator.assignedEvents?.includes(eventIdNum)) {
        return 'partial';
      }
      
      // Check for conflicting events
      const conflicts = getConflictingEvents(operator);
      if (conflicts.length > 0) {
        return 'no';
      }
      
      // If assigned to other events but no conflicts, consider them partially available
      return operator.assignedEvents && operator.assignedEvents.length > 0 ? 'partial' : 'yes';
    } catch (error) {
      console.error("Error checking availability:", error);
      return 'yes';
    }
  };
  
  const getOperatorProfession = (operator: Operator): string => {
    return operator.profession || "security";
  };
  
  const getAvailabilityBadge = (availability: AvailabilityStatus, operator: Operator) => {
    const conflicts = eventId ? getConflictingEvents(operator) : [];
    
    switch(availability) {
      case 'yes':
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">Disponibile</span>;
      case 'no':
        return (
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
              Non Disponibile
            </span>
            {conflicts.length > 0 && (
              <span className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> 
                Conflitto: {conflicts.join(", ")}
              </span>
            )}
          </div>
        );
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
                    <TableCell>{getAvailabilityBadge(availability, operator)}</TableCell>
                    <TableCell>{getOperatorProfession(operator)}</TableCell>
                    <TableCell className="text-right">
                      {isAssigned ? (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            eventId && handleUnassignOperator(operator.id, parseInt(eventId));
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
                            openAssignDialog(operator);
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
