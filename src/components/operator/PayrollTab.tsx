
import React, { useState, useEffect } from "react";
import { ExtendedOperator } from "@/types/operator";
import { attendanceOptions, PayrollCalculation } from "./payroll/types";
import { exportToCSV } from "./payroll/payrollUtils";
import { usePayrollData } from "./payroll/hooks/usePayrollData";
import PayrollSummary from "./payroll/PayrollSummary";
import PayrollCharts from "./payroll/PayrollCharts";
import PayrollTable from "./payroll/PayrollTable";
import PayrollHeader from "./payroll/PayrollHeader";
import HoursAdjustmentDialog from "./payroll/HoursAdjustmentDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const PayrollTab: React.FC<{ operator: ExtendedOperator }> = ({ operator }) => {
  const [isHoursDialogOpen, setIsHoursDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<PayrollCalculation | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  
  const {
    events,
    calculations,
    summaryData,
    loading,
    updateActualHours,
    refreshData
  } = usePayrollData(operator);

  // Load attendance records from localStorage
  useEffect(() => {
    const loadAttendanceRecords = () => {
      const records = localStorage.getItem("attendance_records");
      if (records) {
        try {
          const parsedRecords = JSON.parse(records);
          // Filter for this operator's records
          const operatorRecords = parsedRecords.filter(
            (record: any) => record.operatorId === operator.email
          );
          console.log("Loaded attendance records for operator:", operatorRecords);
          setAttendanceRecords(operatorRecords);
          
          // Refresh payroll calculations to include attendance data
          if (operatorRecords.length > 0) {
            refreshData();
          }
        } catch (error) {
          console.error("Error parsing attendance records:", error);
        }
      }
    };
    
    loadAttendanceRecords();
    
    // Set up a listener for localStorage changes to detect new check-ins/outs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "attendance_records") {
        loadAttendanceRecords();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [operator.email, refreshData]);
  
  const handleExportCSV = () => {
    exportToCSV(calculations, summaryData, operator.name);
  };
  
  const openHoursDialog = (event: PayrollCalculation) => {
    setSelectedEvent(event);
    setIsHoursDialogOpen(true);
  };
  
  const handleHoursSubmit = (eventId: number, actualHours: number) => {
    if (actualHours < 0) {
      toast.error("Le ore devono essere maggiori di zero");
      return;
    }
    
    const success = updateActualHours(eventId, actualHours);
    if (success) {
      setIsHoursDialogOpen(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <PayrollHeader 
        operatorName={operator.name}
        onExportCSV={handleExportCSV}
      />
      
      {/* Summary Cards */}
      <PayrollSummary 
        summaryData={summaryData} 
        eventCount={calculations.length}
      />
      
      {/* Charts */}
      <PayrollCharts 
        calculations={calculations} 
        totalCompensation={summaryData.totalCompensation} 
      />
      
      {/* Event Table */}
      <PayrollTable 
        calculations={calculations} 
        summaryData={summaryData} 
        loading={loading} 
        onClientClick={openHoursDialog}
        attendanceRecords={attendanceRecords}
      />
      
      {/* Hours Adjustment Dialog */}
      <HoursAdjustmentDialog
        isOpen={isHoursDialogOpen}
        onOpenChange={setIsHoursDialogOpen}
        selectedEvent={selectedEvent}
        onSubmit={handleHoursSubmit}
      />
    </div>
  );
};

export default PayrollTab;
