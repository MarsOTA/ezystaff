
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { PayrollCalculation } from "../types";

interface PayrollTableRowProps {
  calc: PayrollCalculation;
  formatCurrency: (value: number) => string;
  onClientClick: (event: PayrollCalculation) => void;
  onMealAllowanceChange?: (eventId: number, value: string) => void;
  onTravelAllowanceChange?: (eventId: number, value: string) => void;
}

export const PayrollTableRow: React.FC<PayrollTableRowProps> = ({
  calc,
  formatCurrency,
  onClientClick,
  onMealAllowanceChange,
  onTravelAllowanceChange
}) => {
  const isPastEvent = new Date(calc.end_date || calc.date) < new Date();
  
  // Calculate total allowances with null safety
  const totalAllowances = (calc.mealAllowance || 0) + (calc.travelAllowance || 0);
  
  // For displaying hours in "Ore Effettive" column:
  // If actual_hours is available, use it; otherwise use the netHours value
  const displayHours = calc.actual_hours !== undefined && calc.actual_hours !== null 
    ? calc.actual_hours 
    : calc.netHours || 0;
  
  const handleMealAllowanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onMealAllowanceChange) {
      onMealAllowanceChange(calc.eventId, e.target.value);
    }
  };
  
  const handleTravelAllowanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onTravelAllowanceChange) {
      onTravelAllowanceChange(calc.eventId, e.target.value);
    }
  };
  
  const handleHoursClick = () => {
    console.log("Opening hours adjustment dialog for event:", calc);
    onClientClick(calc);
  };
  
  return (
    <TableRow key={calc.eventId}>
      <TableCell>{calc.eventTitle}</TableCell>
      <TableCell>
        <button
          onClick={() => onClientClick(calc)}
          className="text-blue-600 hover:underline text-left"
        >
          {calc.client}
        </button>
      </TableCell>
      <TableCell>
        {typeof calc.date === "string" ? calc.date : format(calc.date, "dd/MM/yyyy")}
      </TableCell>
      <TableCell className="text-right">
        {calc.estimated_hours !== undefined && calc.estimated_hours !== null 
          ? calc.estimated_hours.toFixed(1) 
          : (calc.grossHours || 0).toFixed(1)}
      </TableCell>
      <TableCell className="text-right">
        <span 
          className={`px-2 py-1 rounded cursor-pointer ${
            (calc.actual_hours !== undefined && calc.actual_hours !== null) ? "bg-green-100 hover:bg-green-200" : "hover:bg-gray-100"
          }`}
          onClick={handleHoursClick}
        >
          {displayHours.toFixed(1)}
        </span>
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(calc.compensation || 0)}
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Diaria:</span>
            <Input
              type="number"
              min="0"
              value={calc.mealAllowance || 0}
              onChange={handleMealAllowanceChange}
              className="w-20 h-8 text-right"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Trasferta:</span>
            <Input
              type="number"
              min="0"
              value={calc.travelAllowance || 0}
              onChange={handleTravelAllowanceChange}
              className="w-20 h-8 text-right"
            />
          </div>
          <div className="text-right text-sm font-medium pt-1">
            Tot: {formatCurrency(totalAllowances)}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
