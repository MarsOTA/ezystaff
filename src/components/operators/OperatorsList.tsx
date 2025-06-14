
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, UserCheck, UserX, CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Event } from "@/types/event";
import { Operator } from "@/types/operator";
import OperatorFilters from "./OperatorFilters";

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
  const [filters, setFilters] = useState({
    search: '',
    gender: 'all',
    profession: 'all'
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredOperators = useMemo(() => {
    return operators.filter(operator => {
      // Search filter (searches in name, surname, and phone)
      const searchTerm = filters.search.toLowerCase();
      const searchMatch = searchTerm === '' || 
        operator.name?.toLowerCase().includes(searchTerm) ||
        operator.surname?.toLowerCase().includes(searchTerm) ||
        operator.phone?.includes(searchTerm);
      
      const genderMatch = filters.gender === 'all' || operator.gender === filters.gender;
      const professionMatch = filters.profession === 'all' || operator.profession === filters.profession;
      
      return searchMatch && genderMatch && professionMatch;
    });
  }, [operators, filters]);

  const getAssignedEvents = (operatorId: number) => {
    const operator = operators.find(op => op.id === operatorId);
    if (!operator || !operator.assignedEvents || operator.assignedEvents.length === 0) {
      return [];
    }
    
    return events.filter(event => operator.assignedEvents?.includes(event.id));
  };

  const formatDateRange = (start: Date, end: Date) => {
    const sameDay = start.getDate() === end.getDate() && 
                    start.getMonth() === end.getMonth() && 
                    start.getFullYear() === end.getFullYear();
    
    const startDateStr = format(start, "d MMMM yyyy", { locale: it });
    const endDateStr = format(end, "d MMMM yyyy", { locale: it });
    const startTimeStr = format(start, "HH:mm");
    const endTimeStr = format(end, "HH:mm");
    
    if (sameDay) {
      return `${startDateStr}, ${startTimeStr} - ${endTimeStr}`;
    } else {
      return `Dal ${startDateStr}, ${startTimeStr} al ${endDateStr}, ${endTimeStr}`;
    }
  };

  return (
    <div className="space-y-4">
      <OperatorFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cognome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Cell.</TableHead>
            <TableHead>Genere</TableHead>
            <TableHead>Professione</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead>Eventi Assegnati</TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOperators.map((operator) => (
            <TableRow key={operator.id}>
              <TableCell>{operator.name || '-'}</TableCell>
              <TableCell>{operator.surname || '-'}</TableCell>
              <TableCell>{operator.email || '-'}</TableCell>
              <TableCell>{operator.phone || '-'}</TableCell>
              <TableCell className="capitalize">{operator.gender || '-'}</TableCell>
              <TableCell className="capitalize">{operator.profession || '-'}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    operator.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {operator.status === "active" ? "Attivo" : "Inattivo"}
                </span>
              </TableCell>
              <TableCell>
                {getAssignedEvents(operator.id).length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {getAssignedEvents(operator.id).map((event) => (
                      <span 
                        key={event.id}
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800"
                        title={formatDateRange(event.startDate, event.endDate)}
                      >
                        {event.title}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">Nessun evento</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onStatusToggle(operator.id)}
                    title={operator.status === "active" ? "Disattiva operatore" : "Attiva operatore"}
                  >
                    {operator.status === "active" ? (
                      <UserX className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                  </Button>
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
          ))}
          {filteredOperators.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                Nessun operatore trovato con i filtri applicati
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OperatorsList;
