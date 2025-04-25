
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { PayrollSummary } from "../types";

interface PayrollSummaryRowProps {
  summaryData: PayrollSummary;
  formatCurrency: (value: number) => string;
}

export const PayrollSummaryRow: React.FC<PayrollSummaryRowProps> = ({ 
  summaryData, 
  formatCurrency 
}) => {
  return (
    <TableRow className="font-medium bg-muted/50">
      <TableCell colSpan={3}>TOTALE</TableCell>
      <TableCell className="text-right">{summaryData.totalNetHours.toFixed(2)}</TableCell>
      <TableCell className="text-right"></TableCell>
      <TableCell className="text-right">{formatCurrency(summaryData.totalCompensation)}</TableCell>
      <TableCell className="text-right">{formatCurrency(summaryData.totalAllowances)}</TableCell>
    </TableRow>
  );
};
