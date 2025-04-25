
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PayrollCalculation, PayrollSummary } from "./types";
import { PayrollTableStates } from "./components/PayrollTableStates";
import { PayrollTableRow } from "./components/PayrollTableRow";
import { PayrollSummaryRow } from "./components/PayrollSummaryRow";

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
          <PayrollTableStates 
            loading={loading} 
            isEmpty={calculations.length === 0} 
          />
          
          {!loading && calculations.length > 0 && (
            <>
              {calculations.map((calc) => (
                <PayrollTableRow
                  key={calc.eventId}
                  calc={calc}
                  formatCurrency={formatCurrency}
                  onClientClick={onClientClick}
                  onMealAllowanceChange={handleMealAllowanceChange}
                  onTravelAllowanceChange={handleTravelAllowanceChange}
                />
              ))}
              
              <PayrollSummaryRow 
                summaryData={summaryData}
                formatCurrency={formatCurrency}
              />
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayrollTable;
