
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PayrollCalculation, PayrollSummary } from "./types";

interface PayrollTableProps {
  calculations: PayrollCalculation[];
  summaryData: PayrollSummary;
  loading: boolean;
  onClientClick: (event: PayrollCalculation) => void;
  onMealAllowanceChange?: (eventId: number, value: number) => void;
  onTravelAllowanceChange?: (eventId: number, value: number) => void;
}

const PayrollTable: React.FC<PayrollTableProps> = ({ 
  calculations, 
  summaryData, 
  loading,
  onClientClick,
  onMealAllowanceChange,
  onTravelAllowanceChange
}) => {
  const formatCurrency = (value: number) => `€ ${value.toFixed(2)}`;
  
  const handleMealAllowanceChange = (eventId: number, value: string) => {
    if (onMealAllowanceChange) {
      onMealAllowanceChange(eventId, parseFloat(value) || 0);
    }
  };

  const handleTravelAllowanceChange = (eventId: number, value: string) => {
    if (onTravelAllowanceChange) {
      onTravelAllowanceChange(eventId, parseFloat(value) || 0);
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ore Stimate</TableHead>
            <TableHead className="text-right">Ore Effettive</TableHead>
            <TableHead className="text-right">Compenso</TableHead>
            <TableHead className="text-right">Rimborsi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Caricamento dati...
              </TableCell>
            </TableRow>
          ) : calculations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nessun dato disponibile
              </TableCell>
            </TableRow>
          ) : (
            <>
              {calculations.map((calc) => (
                <TableRow key={calc.eventId}>
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
                          onChange={(e) => handleMealAllowanceChange(calc.eventId, e.target.value)}
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
                          onChange={(e) => handleTravelAllowanceChange(calc.eventId, e.target.value)}
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Summary Row */}
              <TableRow className="font-medium bg-muted/50">
                <TableCell colSpan={3}>TOTALE</TableCell>
                <TableCell className="text-right">{summaryData.totalNetHours.toFixed(2)}</TableCell>
                <TableCell className="text-right"></TableCell>
                <TableCell className="text-right">{formatCurrency(summaryData.totalCompensation)}</TableCell>
                <TableCell className="text-right">{formatCurrency(summaryData.totalAllowances)}</TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayrollTable;
