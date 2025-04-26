
import React, { useState, useEffect, useCallback } from "react";
import { ExtendedOperator } from "@/types/operator";
import { CheckRecord } from "./payroll/types";
import { exportToCSV } from "./payroll/payrollUtils";
import { usePayrollData } from "./payroll/hooks/usePayrollData";
import { useHoursAdjustment } from "./payroll/hooks/useHoursAdjustment";
import { getAttendanceRecords, setupAttendanceListener } from "./payroll/api/attendanceApi";
import PayrollHeader from "./payroll/PayrollHeader";
import HoursAdjustmentDialog from "./payroll/HoursAdjustmentDialog";
import PayrollTabsManager from "./payroll/components/PayrollTabsManager";
import PayrollLoading from "./payroll/components/PayrollLoading";

const PayrollTab: React.FC<{ operator: ExtendedOperator }> = ({ operator }) => {
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

  const {
    isHoursDialogOpen,
    setIsHoursDialogOpen,
    selectedEvent,
    openHoursDialog,
    handleHoursSubmit
  } = useHoursAdjustment(updateActualHours);

  const loadAttendanceRecords = useCallback(() => {
    const records = getAttendanceRecords();
    const operatorRecords = records.filter(record => record.operatorId === operator.email);
    setAttendanceRecords(operatorRecords);
  }, [operator.email]);

  useEffect(() => {
    loadAttendanceRecords();
    
    // Set up listener for attendance changes (when operators check in/out)
    const removeListener = setupAttendanceListener(() => {
      console.log("Attendance records updated, refreshing data...");
      loadAttendanceRecords();
      refresh();
    });
    
    // Set up interval for periodic refreshes
    const intervalId = setInterval(() => {
      refresh();
      loadAttendanceRecords();
    }, 60000);
    
    // Clean up
    return () => {
      removeListener();
      clearInterval(intervalId);
    };
  }, [operator.email, loadAttendanceRecords, refresh]);

  // Listen for storage events (when another tab updates attendance)
  useEffect(() => {
    const handleStorageEvent = () => {
      console.log("Storage event detected, refreshing attendance data...");
      loadAttendanceRecords();
      refresh();
    };
    
    window.addEventListener('storage', handleStorageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [loadAttendanceRecords, refresh]);

  const handleExportCSV = () => {
    exportToCSV(calculations, summaryData, operator.name);
  };

  if (loading) {
    return <PayrollLoading />;
  }

  return (
    <div className="space-y-6">
      <PayrollHeader 
        operatorName={operator.name}
        onExportCSV={handleExportCSV}
        onRefresh={refresh}
      />

      <PayrollTabsManager
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        calculations={calculations}
        summaryData={summaryData}
        loading={loading}
        attendanceRecords={attendanceRecords}
        events={events}
        onClientClick={openHoursDialog}
        onMealAllowanceChange={updateMealAllowance}
        onTravelAllowanceChange={updateTravelAllowance}
        onRefresh={refresh}
      />

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
