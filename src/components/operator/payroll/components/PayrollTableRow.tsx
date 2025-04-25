
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  return (
    <TableRow>
      <TableCell className="font-medium">{calc.eventTitle}</TableCell>
      <TableCell>
        <Button
          variant="link"
          onClick={() => onClientClick(calc)}
          className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800 underline"
        >
          {calc.client}
        </Button>
      </TableCell>
      <TableCell>{calc.date}</TableCell>
      <TableCell className="text-right">{calc.netHours.toFixed(2)}</TableCell>
      <TableCell className="text-right">
        {calc.actual_hours !== undefined ? calc.actual_hours.toFixed(2) : "-"}
      </TableCell>
      <TableCell className="text-right">{formatCurrency(calc.compensation)}</TableCell>
      <TableCell className="text-right">
        {formatCurrency(calc.mealAllowance + calc.travelAllowance)}
        <div className="text-xs text-muted-foreground space-y-1 mt-1">
          <div className="flex items-center gap-1">
            <span>Pasti:</span>
            <Input
              type="number"
              min="0"
              step="0.5"
              className="h-6 w-20 text-xs"
              value={calc.mealAllowance}
              onChange={(e) => onMealAllowanceChange?.(calc.eventId, e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1">
            <span>Viaggio:</span>
            <Input
              type="number"
              min="0"
              step="0.5"
              className="h-6 w-20 text-xs"
              value={calc.travelAllowance}
              onChange={(e) => onTravelAllowanceChange?.(calc.eventId, e.target.value)}
            />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
