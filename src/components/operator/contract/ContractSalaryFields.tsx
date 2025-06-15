
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ContractSalaryFields = ({
  ccnl,
  setCcnl,
  level,
  setLevel,
  employmentType,
  setEmploymentType,
  jobType,
  setJobType,
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
}) => (
  <>
    <div>
      <Label htmlFor="ccnl">CCNL</Label>
      <Input type="text" id="ccnl" value={ccnl} onChange={e => setCcnl(e.target.value)} />
    </div>
    <div>
      <Label htmlFor="level">Livello</Label>
      <Input type="text" id="level" value={level} onChange={e => setLevel(e.target.value)} />
    </div>
    <div>
      <Label htmlFor="employmentType">Tipologia di Impiego</Label>
      <Input type="text" id="employmentType" value={employmentType} onChange={e => setEmploymentType(e.target.value)} />
    </div>
    <div>
      <Label htmlFor="jobType">Tipo di Lavoro</Label>
      <Input type="text" id="jobType" value={jobType} onChange={e => setJobType(e.target.value)} />
    </div>
    <div>
      <Label htmlFor="grossSalary">Retribuzione Lorda</Label>
      <Input type="text" id="grossSalary" value={grossSalary} onChange={e => setGrossSalary(e.target.value)} />
    </div>
    <div>
      <Label htmlFor="netSalary">Retribuzione Netta</Label>
      <Input type="text" id="netSalary" value={netSalary} onChange={e => setNetSalary(e.target.value)} />
    </div>
    <div>
      <Label htmlFor="weeklyHours">Ore Settimanali</Label>
      <Input type="text" id="weeklyHours" value={weeklyHours} onChange={e => setWeeklyHours(e.target.value)} />
    </div>
    <div>
      <Label htmlFor="normalHoursPercentage">Percentuale Orario Normale</Label>
      <Input type="text" id="normalHoursPercentage" value={normalHoursPercentage} onChange={e => setNormalHoursPercentage(e.target.value)} />
    </div>
    <div>
      <Label htmlFor="workLocation">Sede di Lavoro</Label>
      <Input type="text" id="workLocation" value={workLocation} onChange={e => setWorkLocation(e.target.value)} />
    </div>
    <div>
      <Label htmlFor="workSite">Luogo di Lavoro</Label>
      <Input type="text" id="workSite" value={workSite} onChange={e => setWorkSite(e.target.value)} />
    </div>
    <div>
      <Label htmlFor="basePayAndContingency">Paga Base e Contingenze</Label>
      <Input type="text" id="basePayAndContingency" value={basePayAndContingency} onChange={e => setBasePayAndContingency(e.target.value)} />
    </div>
    <div>
      <Label htmlFor="edr">EDR</Label>
      <Input type="text" id="edr" value={edr} onChange={e => setEdr(e.target.value)} />
    </div>
    <div>
      <Label htmlFor="totalMonthlyCompensation">Totale Retribuzione Mensile</Label>
      <Input type="text" id="totalMonthlyCompensation" value={totalMonthlyCompensation} onChange={e => setTotalMonthlyCompensation(e.target.value)} />
    </div>
    <div>
      <Label htmlFor="totalAnnualCompensation">Totale Annuo</Label>
      <Input type="text" id="totalAnnualCompensation" value={totalAnnualCompensation} onChange={e => setTotalAnnualCompensation(e.target.value)} />
    </div>
  </>
);

export default ContractSalaryFields;
