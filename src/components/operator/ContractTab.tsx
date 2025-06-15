
import React from "react";
import { Button } from "@/components/ui/button";
import { ExtendedOperator } from "@/types/operator";
// Subfields
import ContractTypeSelect from "./contract/ContractTypeSelect";
import ContractSalaryFields from "./contract/ContractSalaryFields";
import ContractDatesFields from "./contract/ContractDatesFields";
import ContractClauseFields from "./contract/ContractClauseFields";
import ContractTrainerFields from "./contract/ContractTrainerFields";
import ContractFileUpload from "./contract/ContractFileUpload";

interface ContractTabProps {
  operator: ExtendedOperator;
  onContractTypeChange: (value: string) => void;
  onGenerateContract: () => void;
  contractType: string;
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
  onSave: () => void;
  onTemplateUpload?: (file: File | null) => void;
  templateFile?: File | null;
}

const ContractTab: React.FC<ContractTabProps> = (props) => {
  // Local states for signed contract/unilav are managed in below
  const [signedContractFile, setSignedContractFile] = React.useState<File | null>(null);
  const [unilavFile, setUnilavFile] = React.useState<File | null>(null);

  return (
    <div className="space-y-6">
      <ContractTypeSelect
        contractType={props.contractType}
        onContractTypeChange={props.onContractTypeChange}
      />
      <ContractSalaryFields {...props} />
      <ContractDatesFields
        startDate={props.startDate}
        setStartDate={props.setStartDate}
        endDate={props.endDate}
        setEndDate={props.setEndDate}
        contractSignDate={props.contractSignDate}
        setContractSignDate={props.setContractSignDate}
      />
      <ContractClauseFields
        contractClause={props.contractClause}
        setContractClause={props.setContractClause}
        workingHoursClause={props.workingHoursClause}
        setWorkingHoursClause={props.setWorkingHoursClause}
        rebalancing={props.rebalancing}
        setRebalancing={props.setRebalancing}
      />
      <ContractTrainerFields
        trainerName={props.trainerName}
        setTrainerName={props.setTrainerName}
        trainingStartDate={props.trainingStartDate}
        setTrainingStartDate={props.setTrainingStartDate}
        trainingEndDate={props.trainingEndDate}
        setTrainingEndDate={props.setTrainingEndDate}
      />
      <ContractFileUpload
        signedContractFile={signedContractFile}
        setSignedContractFile={setSignedContractFile}
        onTemplateUpload={props.onTemplateUpload}
        unilavFile={unilavFile}
        setUnilavFile={setUnilavFile}
      />
      <div className="flex gap-2">
        <Button variant="secondary" onClick={props.onGenerateContract}>
          Genera Contratto
        </Button>
        <Button onClick={props.onSave}>Salva</Button>
      </div>
    </div>
  );
};

export default ContractTab;
