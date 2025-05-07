
import React, { useState, useMemo } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, Plus, Minus } from "lucide-react";
import { personnelTypes } from '@/hooks/useEventForm';
import { Operator } from "@/types/operator";
import { useOperators } from "@/hooks/useOperators";

interface EventPlannerProps {
  selectedPersonnel: string[];
  onPersonnelChange: (personnelId: string) => void;
  personnelCounts: Record<string, number>;
  onPersonnelCountChange: (personnelId: string, count: number) => void;
  eventId: string | null;
}

const EventPlanner: React.FC<EventPlannerProps> = ({
  selectedPersonnel,
  onPersonnelChange,
  personnelCounts,
  onPersonnelCountChange,
  eventId
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { operators, handleAssignSubmit, openAssignDialog, handleUnassignOperator } = useOperators();
  
  // Calculate total personnel count
  const totalPersonnelCount = useMemo(() => {
    return Object.values(personnelCounts).reduce((sum, count) => sum + count, 0);
  }, [personnelCounts]);
  
  // Filter operators based on search query
  const filteredOperators = useMemo(() => {
    return operators.filter(operator => {
      const fullName = `${operator.name || ''}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
  }, [operators, searchQuery]);
  
  // Get assigned operators for this event (if eventId exists and is a number)
  const assignedOperators = useMemo(() => {
    if (!eventId) return [];
    const eventIdNum = parseInt(eventId);
    return operators.filter(op => 
      op.assignedEvents && op.assignedEvents.includes(eventIdNum)
    );
  }, [operators, eventId]);
  
  // Check operator availability for this event
  const checkAvailability = (operator: Operator): 'yes' | 'no' | 'partial' => {
    if (!eventId || !operator.assignedEvents || operator.assignedEvents.length === 0) {
      return 'yes';
    }
    
    // If already assigned to this event, they're at least partially available
    if (operator.assignedEvents.includes(parseInt(eventId))) {
      return 'partial';
    }
    
    // If assigned to other events, consider them partially available
    // For a real implementation, you'd need to check for actual schedule overlaps
    return operator.assignedEvents.length > 0 ? 'partial' : 'yes';
  };
  
  // Handle personnel count changes
  const handleIncrementCount = (personnelId: string) => {
    const currentCount = personnelCounts[personnelId] || 0;
    onPersonnelCountChange(personnelId, currentCount + 1);
  };
  
  const handleDecrementCount = (personnelId: string) => {
    const currentCount = personnelCounts[personnelId] || 0;
    if (currentCount > 0) {
      onPersonnelCountChange(personnelId, currentCount - 1);
    }
  };
  
  const handleAssignOperator = (operator: Operator) => {
    if (eventId) {
      openAssignDialog(operator);
    }
  };
  
  const getOperatorProfession = (operator: Operator): string => {
    // In a real implementation, this would come from the operator's profile
    // For this example, we'll return a placeholder
    return operator.profession || "security";
  };
  
  const getAvailabilityBadge = (availability: 'yes' | 'no' | 'partial') => {
    switch(availability) {
      case 'yes':
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">Disponibile</span>;
      case 'no':
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">Non Disponibile</span>;
      case 'partial':
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">Parziale</span>;
    }
  };
  
  const handleRemoveOperator = (operator: Operator) => {
    if (eventId) {
      handleUnassignOperator(operator.id, parseInt(eventId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Personnel Types Selection with Counters */}
      <div className="space-y-2">
        <Label>Tipologia di personale richiesto *</Label>
        <div className="space-y-4">
          {personnelTypes.map((type) => (
            <div key={type.id} className="flex items-center justify-between border p-2 rounded-md">
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
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => handleDecrementCount(type.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{personnelCounts[type.id] || 0}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => handleIncrementCount(type.id)}
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

      {/* Personnel Selection Table */}
      <div className="space-y-2 mt-8">
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
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveOperator(operator)}>
                            <X className="h-4 w-4 mr-1" />
                            Rimuovi
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleAssignOperator(operator)}>
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

      {/* Assigned Personnel List */}
      <div className="space-y-2 mt-8">
        <Label>Personale assegnato all'evento</Label>
        <div className="border rounded-md p-4">
          {assignedOperators.length > 0 ? (
            <ul className="divide-y">
              {assignedOperators.map((operator) => (
                <li key={operator.id} className="py-2 flex justify-between items-center">
                  <div>
                    <span className="font-medium">{operator.name}</span>
                    <span className="ml-2 text-sm text-gray-500">{getOperatorProfession(operator)}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleRemoveOperator(operator)}>
                    <X className="h-4 w-4 mr-1" />
                    Rimuovi
                  </Button>
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
    </div>
  );
};

export default EventPlanner;
