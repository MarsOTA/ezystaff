
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
import { PayrollCalculation, PayrollSummary } from "./types";
import { format } from "date-fns";

interface PayrollTableProps {
  calculations: PayrollCalculation[];
  summaryData: PayrollSummary;
  loading: boolean;
  onClientClick: (event: PayrollCalculation) => void;
  attendanceRecords?: any[];
}

const PayrollTable: React.FC<PayrollTableProps> = ({ 
  calculations, 
  summaryData, 
  loading,
  onClientClick,
  attendanceRecords = [],
}) => {
  const formatCurrency = (value: number) => `€ ${value.toFixed(2)}`;
  
  // Helper function to determine attendance status based on records
  const getAttendanceStatus = (eventId: number) => {
    if (!attendanceRecords || attendanceRecords.length === 0) return null;
    
    const eventRecords = attendanceRecords.filter(
      (record) => record.eventId === eventId
    );
    
    if (eventRecords.length === 0) return null;
    
    // Check if there's a check-in record
    const hasCheckIn = eventRecords.some((record) => record.type === "check-in");
    // Check if there's a check-out record
    const hasCheckOut = eventRecords.some((record) => record.type === "check-out");
    
    if (hasCheckIn && hasCheckOut) return "present";
    if (hasCheckIn) return "late"; // Only checked in but not out
    return null;
  };
  
  // Helper function to render attendance status
  const renderAttendanceStatus = (eventId: number) => {
    const status = getAttendanceStatus(eventId);
    
    if (!status) return "-";
    
    const statusColor = status === "present" 
      ? "bg-green-100 text-green-800" 
      : "bg-yellow-100 text-yellow-800";
    
    const statusText = status === "present" ? "Presente" : "In corso";
    
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColor}`}>
        {statusText}
      </span>
    );
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
            <TableHead className="text-center">Presenza</TableHead>
            <TableHead className="text-right">Compenso</TableHead>
            <TableHead className="text-right">Rimborsi</TableHead>
            <TableHead className="text-right">Fatturato</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                Caricamento dati...
              </TableCell>
            </TableRow>
          ) : calculations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
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
                  <TableCell className="text-right">{calc.grossHours.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    {calc.actual_hours !== undefined ? calc.actual_hours.toFixed(2) : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {renderAttendanceStatus(calc.eventId)}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(calc.compensation)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(calc.mealAllowance + calc.travelAllowance)}
                    <div className="text-xs text-muted-foreground">
                      Pasti: {formatCurrency(calc.mealAllowance)} / Viaggio: {formatCurrency(calc.travelAllowance)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(calc.totalRevenue)}</TableCell>
                </TableRow>
              ))}
              
              {/* Summary Row */}
              <TableRow className="font-medium bg-muted/50">
                <TableCell colSpan={3}>TOTALE</TableCell>
                <TableCell className="text-right">{summaryData.totalGrossHours.toFixed(2)}</TableCell>
                <TableCell className="text-right">{summaryData.totalNetHours.toFixed(2)}</TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-right">{formatCurrency(summaryData.totalCompensation)}</TableCell>
                <TableCell className="text-right">{formatCurrency(summaryData.totalAllowances)}</TableCell>
                <TableCell className="text-right">{formatCurrency(summaryData.totalRevenue)}</TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayrollTable;
