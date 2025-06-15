import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ExtendedOperator } from "@/types/operator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const contractTypes = [
  { value: "a-chiamata", label: "A chiamata" },
  { value: "determinato", label: "A tempo determinato" },
  { value: "indeterminato", label: "A tempo indeterminato" },
  { value: "prestazione-occasionale", label: "Prestazione occasionale" }
];

const ContractTab: React.FC<ContractTabProps> = ({
  operator,
  onContractTypeChange,
  onGenerateContract,
  contractType,
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
  onSave,
  onTemplateUpload,
  templateFile
}) => {
  // Stato per il contratto firmato
  const [signedContractFile, setSignedContractFile] = React.useState<File | null>(null);
  // Stato per il file UNILAV
  const [unilavFile, setUnilavFile] = React.useState<File | null>(null);

  // Callback caricamento contratto firmato
  const handleSignedContractUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSignedContractFile(file);
    if (file && typeof window !== "undefined") {
      if (typeof onTemplateUpload === "function") {
        onTemplateUpload(file);
      }
    }
  };

  // Callback caricamento UNILAV
  const handleUnilavUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUnilavFile(file);
    // Eventuale logica di gestione upload va qui
    // Se vuoi salvare nel profilo operatore, devi estendere la logica di salvataggio!
    // Per ora solo locale/preview.
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="contractType">Tipo di Contratto</Label>
        <Select value={contractType} onValueChange={onContractTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona tipo di contratto" />
          </SelectTrigger>
          <SelectContent>
            {contractTypes.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="ccnl">CCNL</Label>
        <Input
          type="text"
          id="ccnl"
          value={ccnl}
          onChange={(e) => setCcnl(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="level">Livello</Label>
        <Input
          type="text"
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="employmentType">Tipologia di Impiego</Label>
        <Input
          type="text"
          id="employmentType"
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="jobType">Tipo di Lavoro</Label>
        <Input
          type="text"
          id="jobType"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Data Inizio</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                {startDate ? format(startDate, "PPP") : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Data Fine</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                {endDate ? format(endDate, "PPP") : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label htmlFor="grossSalary">Retribuzione Lorda</Label>
        <Input
          type="text"
          id="grossSalary"
          value={grossSalary}
          onChange={(e) => setGrossSalary(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="netSalary">Retribuzione Netta</Label>
        <Input
          type="text"
          id="netSalary"
          value={netSalary}
          onChange={(e) => setNetSalary(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="weeklyHours">Ore Settimanali</Label>
        <Input
          type="text"
          id="weeklyHours"
          value={weeklyHours}
          onChange={(e) => setWeeklyHours(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="normalHoursPercentage">Percentuale Orario Normale</Label>
        <Input
          type="text"
          id="normalHoursPercentage"
          value={normalHoursPercentage}
          onChange={(e) => setNormalHoursPercentage(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="workLocation">Sede di Lavoro</Label>
        <Input
          type="text"
          id="workLocation"
          value={workLocation}
          onChange={(e) => setWorkLocation(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="workSite">Luogo di Lavoro</Label>
        <Input
          type="text"
          id="workSite"
          value={workSite}
          onChange={(e) => setWorkSite(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="basePayAndContingency">Paga Base e Contingenze</Label>
        <Input
          type="text"
          id="basePayAndContingency"
          value={basePayAndContingency}
          onChange={(e) => setBasePayAndContingency(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="edr">EDR</Label>
        <Input
          type="text"
          id="edr"
          value={edr}
          onChange={(e) => setEdr(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="totalMonthlyCompensation">
          Totale Retribuzione Mensile
        </Label>
        <Input
          type="text"
          id="totalMonthlyCompensation"
          value={totalMonthlyCompensation}
          onChange={(e) => setTotalMonthlyCompensation(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="totalAnnualCompensation">Totale Annuo</Label>
        <Input
          type="text"
          id="totalAnnualCompensation"
          value={totalAnnualCompensation}
          onChange={(e) => setTotalAnnualCompensation(e.target.value)}
        />
      </div>

      <div>
        <Label>Data Firma Contratto</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !contractSignDate && "text-muted-foreground"
              )}
            >
              {contractSignDate ? format(contractSignDate, "PPP") : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={contractSignDate}
              onSelect={setContractSignDate}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="contractClause">Dicitura Contratto</Label>
        <Textarea
          id="contractClause"
          value={contractClause}
          onChange={(e) => setContractClause(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="workingHoursClause">Dicitura Orario di Lavoro</Label>
        <Textarea
          id="workingHoursClause"
          value={workingHoursClause}
          onChange={(e) => setWorkingHoursClause(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="rebalancing">Riproporzionamento</Label>
        <Input
          type="text"
          id="rebalancing"
          value={rebalancing}
          onChange={(e) => setRebalancing(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="trainerName">Nominativo Formatore</Label>
        <Input
          type="text"
          id="trainerName"
          value={trainerName}
          onChange={(e) => setTrainerName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Inizio Formazione</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !trainingStartDate && "text-muted-foreground"
                )}
              >
                {trainingStartDate ? format(trainingStartDate, "PPP") : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={trainingStartDate}
                onSelect={setTrainingStartDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Fine Formazione</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !trainingEndDate && "text-muted-foreground"
                )}
              >
                {trainingEndDate ? format(trainingEndDate, "PPP") : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={trainingEndDate}
                onSelect={setTrainingEndDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Contratto firmato */}
      <div>
        <label className="block mb-1 font-semibold">
          Carica contratto firmato (.pdf)
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleSignedContractUpload}
        />
        {signedContractFile && (
          <span className="ml-2 text-sm text-primary">{signedContractFile.name}</span>
        )}
      </div>

      {/* Upload campo UNILAV */}
      <div>
        <label className="block mb-1 font-semibold">
          Carica UNILAV (.pdf)
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleUnilavUpload}
        />
        {unilavFile && (
          <span className="ml-2 text-sm text-primary">{unilavFile.name}</span>
        )}
      </div>

      <Button variant="secondary" onClick={onGenerateContract}>
        Genera Contratto
      </Button>
      <Button onClick={onSave}>Salva</Button>
    </div>
  );
};

export default ContractTab;
