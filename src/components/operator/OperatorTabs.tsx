
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, DollarSign } from "lucide-react";
import { ExtendedOperator } from "@/types/operator";
import PersonalInfoTab from "@/components/operator/PersonalInfoTab";
import ContractTab from "@/components/operator/ContractTab";
import PayrollTab from "@/components/operator/PayrollTab";

interface OperatorTabsProps {
  operator: ExtendedOperator;
  activeTab: string;
  setActiveTab: (value: string) => void;
  imagePreviewUrls: Record<string, string>;
  onFieldChange: (field: keyof ExtendedOperator, value: any) => void;
  onServiceToggle: (service: string) => void;
  onAvailabilityToggle: (availability: string) => void;
  onLanguageToggle: (language: string, type: 'fluent' | 'basic') => void;
  onSizeToggle: (size: string) => void;
  onFileUpload: (field: keyof ExtendedOperator, fileNameField: keyof ExtendedOperator, file: File | null) => void;
  onSave: () => void;
  onGenerateContract: () => void;
  contractType: string;
  setContractType: (value: string) => void;
  ccnl: string;
  setCcnl: (value: string) => void;
  level: string;
  setLevel: (value: string) => void;
  employmentType: string;
  setEmploymentType: (value: string) => void;
  jobType: string;
  setJobType: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  grossSalary: string;
  setGrossSalary: (value: string) => void;
  netSalary: string;
  setNetSalary: (value: string) => void;
  weeklyHours: string;
  setWeeklyHours: (value: string) => void;
  normalHoursPercentage: string;
  setNormalHoursPercentage: (value: string) => void;
  workLocation: string;
  setWorkLocation: (value: string) => void;
  workSite: string;
  setWorkSite: (value: string) => void;
  basePayAndContingency: string;
  setBasePayAndContingency: (value: string) => void;
  edr: string;
  setEdr: (value: string) => void;
  totalMonthlyCompensation: string;
  setTotalMonthlyCompensation: (value: string) => void;
  totalAnnualCompensation: string;
  setTotalAnnualCompensation: (value: string) => void;
  contractSignDate: Date | undefined;
  setContractSignDate: (date: Date | undefined) => void;
  contractClause: string;
  setContractClause: (value: string) => void;
  workingHoursClause: string;
  setWorkingHoursClause: (value: string) => void;
  rebalancing: string;
  setRebalancing: (value: string) => void;
  trainerName: string;
  setTrainerName: (value: string) => void;
  trainingStartDate: Date | undefined;
  setTrainingStartDate: (date: Date | undefined) => void;
  trainingEndDate: Date | undefined;
  setTrainingEndDate: (date: Date | undefined) => void;
  onTemplateUpload?: (file: File | null) => void;
  templateFile?: File | null;
}

const OperatorTabs: React.FC<OperatorTabsProps> = ({
  operator,
  activeTab,
  setActiveTab,
  imagePreviewUrls,
  onFieldChange,
  onServiceToggle,
  onAvailabilityToggle,
  onLanguageToggle,
  onSizeToggle,
  onFileUpload,
  onSave,
  onGenerateContract,
  contractType,
  setContractType,
  ccnl,
  setCcnl,
  level,
  setLevel,
  employmentType,
  setEmploymentType,
  jobType,
  setJobType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  grossSalary,
  setGrossSalary,
  netSalary,
  setNetSalary,
  weeklyHours,
  setWeeklyHours,
  normalHoursPercentage,
  setNormalHoursPercentage,
  workLocation,
  setWorkLocation,
  workSite,
  setWorkSite,
  basePayAndContingency,
  setBasePayAndContingency,
  edr,
  setEdr,
  totalMonthlyCompensation,
  setTotalMonthlyCompensation,
  totalAnnualCompensation,
  setTotalAnnualCompensation,
  contractSignDate,
  setContractSignDate,
  contractClause,
  setContractClause,
  workingHoursClause,
  setWorkingHoursClause,
  rebalancing,
  setRebalancing,
  trainerName,
  setTrainerName,
  trainingStartDate,
  setTrainingStartDate,
  trainingEndDate,
  setTrainingEndDate,
  onTemplateUpload,
  templateFile
}) => {
  return (
    <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="info" className="text-base py-3">
          <User className="mr-2 h-4 w-4" />
          Info Operatore
        </TabsTrigger>
        <TabsTrigger value="contract" className="text-base py-3">
          <FileText className="mr-2 h-4 w-4" />
          Contrattualistica
        </TabsTrigger>
        <TabsTrigger value="payroll" className="text-base py-3">
          <DollarSign className="mr-2 h-4 w-4" />
          Payroll
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="info" className="space-y-6 mt-6">
        <PersonalInfoTab
          operator={operator}
          imagePreviewUrls={imagePreviewUrls}
          onFieldChange={onFieldChange}
          onServiceToggle={onServiceToggle}
          onAvailabilityToggle={onAvailabilityToggle}
          onLanguageToggle={onLanguageToggle}
          onSizeToggle={onSizeToggle}
          onFileUpload={onFileUpload}
        />
      </TabsContent>
      
      <TabsContent value="contract" className="space-y-6 mt-6">
        <ContractTab
          operator={operator}
          contractType={contractType}
          onContractTypeChange={setContractType}
          onGenerateContract={onGenerateContract}
          ccnl={ccnl}
          setCcnl={setCcnl}
          level={level}
          setLevel={setLevel}
          employmentType={employmentType}
          setEmploymentType={setEmploymentType}
          jobType={jobType}
          setJobType={setJobType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          grossSalary={grossSalary}
          setGrossSalary={setGrossSalary}
          netSalary={netSalary}
          setNetSalary={setNetSalary}
          weeklyHours={weeklyHours}
          setWeeklyHours={setWeeklyHours}
          normalHoursPercentage={normalHoursPercentage}
          setNormalHoursPercentage={setNormalHoursPercentage}
          workLocation={workLocation}
          setWorkLocation={setWorkLocation}
          workSite={workSite}
          setWorkSite={setWorkSite}
          basePayAndContingency={basePayAndContingency}
          setBasePayAndContingency={setBasePayAndContingency}
          edr={edr}
          setEdr={setEdr}
          totalMonthlyCompensation={totalMonthlyCompensation}
          setTotalMonthlyCompensation={setTotalMonthlyCompensation}
          totalAnnualCompensation={totalAnnualCompensation}
          setTotalAnnualCompensation={setTotalAnnualCompensation}
          contractSignDate={contractSignDate}
          setContractSignDate={setContractSignDate}
          contractClause={contractClause}
          setContractClause={setContractClause}
          workingHoursClause={workingHoursClause}
          setWorkingHoursClause={setWorkingHoursClause}
          rebalancing={rebalancing}
          setRebalancing={setRebalancing}
          trainerName={trainerName}
          setTrainerName={setTrainerName}
          trainingStartDate={trainingStartDate}
          setTrainingStartDate={setTrainingStartDate}
          trainingEndDate={trainingEndDate}
          setTrainingEndDate={setTrainingEndDate}
          onSave={onSave}
          onTemplateUpload={onTemplateUpload}
          templateFile={templateFile}
        />
      </TabsContent>

      <TabsContent value="payroll" className="space-y-6 mt-6">
        <PayrollTab operator={operator} />
      </TabsContent>
    </Tabs>
  );
};

export default OperatorTabs;
