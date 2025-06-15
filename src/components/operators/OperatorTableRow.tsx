
import React from "react";
import { useNavigate } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, UserCheck, UserX, CalendarClock } from "lucide-react";
import { Event } from "@/types/event";
import { Operator } from "@/types/operator";
import { formatGender, formatDateRange } from "./utils/operatorDisplayUtils";

interface OperatorTableRowProps {
  operator: Operator;
  events: Event[];
  operators: Operator[];
  onStatusToggle: (id: number) => void;
  onEdit: (operator: Operator) => void;
  onDelete: (id: number) => void;
}

const OperatorTableRow: React.FC<OperatorTableRowProps> = ({
  operator,
  events,
  operators,
  onStatusToggle,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const getAssignedEvents = (operatorId: number) => {
    const operatorData = operators.find(op => op.id === operatorId);
    if (!operatorData || !operatorData.assignedEvents || operatorData.assignedEvents.length === 0) {
      return [];
    }
    
    return events.filter(event => operatorData.assignedEvents?.includes(event.id));
  };

  const handleAssignClick = (operator: Operator) => {
    navigate(`/event-planner/${operator.id}`);
  };

  const assignedEvents = getAssignedEvents(operator.id);

  return (
    <TableRow>
      <TableCell>{operator.name || '-'}</TableCell>
      <TableCell>{operator.surname || '-'}</TableCell>
      <TableCell>{operator.email || '-'}</TableCell>
      <TableCell>{operator.phone || '-'}</TableCell>
      <TableCell>{formatGender(operator.gender)}</TableCell>
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
        {assignedEvents.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {assignedEvents.map((event) => (
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
            onClick={() => handleAssignClick(operator)}
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
};

export default OperatorTableRow;
