import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, UserCheck, UserX, CalendarClock } from "lucide-react";
import { Event } from "@/types/event";
import { Operator } from "@/types/operator";
import { formatGender } from "./utils/operatorDisplayUtils";
import OperatorProfileOverlay from "./OperatorProfileOverlay";
import { operatorToExtended } from "./utils/operatorConversionUtils";
import { Progress } from "@/components/ui/progress";

interface OperatorTableRowProps {
  operator: Operator;
  events: Event[];
  operators: Operator[];
  onStatusToggle: (id: number) => void;
  onEdit: (operator: Operator) => void;
  onDelete: (id: number) => void;
  profileCompletion?: number;
}

const OperatorTableRow: React.FC<OperatorTableRowProps> = ({
  operator,
  events,
  operators,
  onStatusToggle,
  onEdit,
  onDelete,
  profileCompletion
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

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOverlayOpen(true);
  };

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
        <TableCell>
          <div className="w-20 flex flex-col items-center">
            <Progress value={profileCompletion || 0} className="h-2 mb-1" />
            <span className="text-xs font-semibold">{profileCompletion || 0}%</span>
          </div>
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
