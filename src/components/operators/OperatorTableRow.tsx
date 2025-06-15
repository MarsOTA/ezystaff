
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, UserCheck, UserX, CalendarClock } from "lucide-react";
import { Event } from "@/types/event";
import { Operator, ExtendedOperator } from "@/types/operator";
import { formatGender } from "./utils/operatorDisplayUtils";
import OperatorProfileOverlay from "./OperatorProfileOverlay";

// Smart conversion from Operator to ExtendedOperator (best effort for display)
const operatorToExtended = (operator: Operator): ExtendedOperator => {
  return {
    ...operator,
    name: operator.name,
    surname: operator.surname,
    email: operator.email,
    phone: operator.phone,
    gender: (operator as any).gender,
    profession: (operator as any).profession,
    nationality: (operator as any).nationality,
    fiscalCode: (operator as any).fiscalCode,
    birthDate: (operator as any).birthDate,
    address: (operator as any).address,
    profileImage: (operator as any).profileImage,
    // Potrebbero esserci altri campi, ma prendiamo solo i principali se già salvati
  };
};

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
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const getAssignedEventsCount = (operatorId: number) => {
    const operatorData = operators.find(op => op.id === operatorId);
    if (!operatorData || !operatorData.assignedEvents) {
      return 0;
    }
    return operatorData.assignedEvents.length;
  };

  const handleAssignClick = (operator: Operator) => {
    navigate(`/event-planner/${operator.id}`);
  };

  const assignedEventsCount = getAssignedEventsCount(operator.id);

  // Nuovo handler: al click sul nome, apri overlay con profilo
  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOverlayOpen(true);
  };

  // Porta alla pagina dettaglio operatore già presente
  const handleGoToProfileEdit = (operatorId: number) => {
    setIsOverlayOpen(false);
    navigate(`/operator-profile/${operatorId}`);
  };

  return (
    <>
      <OperatorProfileOverlay
        open={isOverlayOpen}
        onOpenChange={setIsOverlayOpen}
        operator={operatorToExtended(operator)}
        onEditProfile={handleGoToProfileEdit}
      />
      <TableRow>
        <TableCell>
          <span 
            onClick={handleProfileClick} 
            className="text-primary underline cursor-pointer hover:text-primary/80">
            {operator.name || '-'}
          </span>
        </TableCell>
        <TableCell>{operator.surname || '-'}</TableCell>
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
          <span className="text-sm font-medium">
            {assignedEventsCount}
          </span>
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
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default OperatorTableRow;
