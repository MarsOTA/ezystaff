
import React, { useState, useEffect } from "react";
import { ExtendedOperator } from "@/types/operator";
import { CheckRecord, PayrollCalculation } from "./payroll/types";
import { exportToCSV } from "./payroll/payrollUtils";
import { usePayrollData } from "./payroll/hooks/usePayrollData";
import PayrollSummary from "./payroll/PayrollSummary";
import PayrollCharts from "./payroll/PayrollCharts";
import PayrollTable from "./payroll/PayrollTable";
import PayrollHeader from "./payroll/PayrollHeader";
import HoursAdjustmentDialog from "./payroll/HoursAdjustmentDialog";
import AttendanceTable from "./payroll/AttendanceTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAttendanceRecords } from "./payroll/api/payrollApi";
import { toast } from "sonner";

const PayrollTab: React.FC<{ operator: ExtendedOperator }> = ({ operator }) => {
  const [isHoursDialogOpen, setIsHoursDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<PayrollCalculation | null>(null);
  const [activeTab, setActiveTab] = useState<string>("payroll");
  const [attendanceRecords, setAttendanceRecords] = useState<CheckRecord[]>([]);
  
  const {
    events,
    calculations,
    summaryData,
    loading,
    updateActualHours,
    updateMealAllowance,
    updateTravelAllowance,
    refresh
  } = usePayrollData(operator);
  
  // Load attendance records
  const loadAttendanceRecords = useCallback(() => {
    const records = getAttendanceRecords();
    const operatorRecords = records.filter(record => record.operatorId === operator.email);
    setAttendanceRecords(operatorRecords);
  }, [operator.email]);
  
  // Load attendance records on mount and when active tab changes to attendance
  useEffect(() => {
    loadAttendanceRecords();
    
    // Set up interval to refresh data periodically
    const intervalId = setInterval(() => {
      refresh();
      loadAttendanceRecords();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, [operator.email, loadAttendanceRecords, refresh]);
  
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
        onRefresh={refresh}
      />
      
      {/* Tabs for Payroll and Attendance */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="attendance">Presenze</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payroll" className="space-y-6">
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
            onMealAllowanceChange={updateMealAllowance}
            onTravelAllowanceChange={updateTravelAllowance}
          />
        </TabsContent>
        
        <TabsContent value="attendance">
          <AttendanceTable 
            records={attendanceRecords} 
            events={events} 
            onRefresh={refresh}
          />
        </TabsContent>
      </Tabs>
      
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
