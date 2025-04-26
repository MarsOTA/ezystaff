
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PayrollCalculation, CheckRecord } from "../types";
import { PayrollSummary as PayrollSummaryType } from "../types";
import PayrollSummary from "../PayrollSummary";
import PayrollCharts from "../PayrollCharts";
import PayrollTable from "../PayrollTable";
import AttendanceTable from "../AttendanceTable";

interface PayrollTabsManagerProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  calculations: PayrollCalculation[];
  summaryData: PayrollSummaryType;
  loading: boolean;
  attendanceRecords: CheckRecord[];
  events: any[];
  onClientClick: (event: PayrollCalculation) => void;
  onMealAllowanceChange: (eventId: number, value: number) => void;
  onTravelAllowanceChange: (eventId: number, value: number) => void;
  onRefresh: () => void;
}

const PayrollTabsManager: React.FC<PayrollTabsManagerProps> = ({
  activeTab,
  setActiveTab,
  calculations,
  summaryData,
  loading,
  attendanceRecords,
  events,
  onClientClick,
  onMealAllowanceChange,
  onTravelAllowanceChange,
  onRefresh
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="payroll">Payroll</TabsTrigger>
        <TabsTrigger value="attendance">Presenze</TabsTrigger>
      </TabsList>

      <TabsContent value="payroll" className="space-y-6">
        <PayrollSummary summaryData={summaryData} eventCount={calculations.length} />
        <PayrollTable 
          calculations={calculations}
          summaryData={summaryData}
          loading={loading}
          onClientClick={onClientClick}
          onMealAllowanceChange={onMealAllowanceChange}
          onTravelAllowanceChange={onTravelAllowanceChange}
        />
      </TabsContent>

      <TabsContent value="attendance">
        <AttendanceTable 
          records={attendanceRecords}
          events={events}
          onRefresh={onRefresh}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PayrollTabsManager;
