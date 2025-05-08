
import React from "react";
import { ExtendedOperator, CONTRACT_TYPES, JOB_TYPES } from "@/types/operator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Download, CalendarIcon, Save, Upload } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface ContractTabProps {
  operator: ExtendedOperator;
  contractType: string;
  onContractTypeChange: (value: string) => void;
  onGenerateContract: () => void;
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

const ContractTab: React.FC<ContractTabProps> = ({
  operator,
  contractType,
  onContractTypeChange,
  onGenerateContract,
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
  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (onTemplateUpload) {
      onTemplateUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestione Contratto</CardTitle>
          <CardDescription>
            Seleziona il tipo di contratto e genera il documento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Contract Type */}
            <div>
              <Label htmlFor="contractType">Tipo di contratto</Label>
              <Select
                value={contractType}
                onValueChange={onContractTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona tipo di contratto" />
                </SelectTrigger>
                <SelectContent>
                  {CONTRACT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Job Type (Tipo mansione) */}
            <div>
              <Label htmlFor="jobType">Tipo mansione</Label>
              <Select
                value={jobType}
                onValueChange={setJobType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona tipo mansione" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CCNL applicato */}
            <div>
              <Label htmlFor="ccnl">CCNL applicato</Label>
              <Select
                value={ccnl}
                onValueChange={setCcnl}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona CCNL" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pulizia-multiservizi">Pulizia multiservizi - Conflavoro PMI</SelectItem>
                  <SelectItem value="altro">Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Livello inquadramento */}
            <div>
              <Label htmlFor="level">Livello inquadramento</Label>
              <Input
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="Es. 3° Livello"
              />
            </div>

            {/* Decorrenza rapporto di lavoro */}
            <div>
              <Label htmlFor="employmentType">Decorrenza rapporto di lavoro</Label>
              <Select
                value={employmentType}
                onValueChange={setEmploymentType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indeterminato">Indeterminato</SelectItem>
                  <SelectItem value="determinato">Determinato</SelectItem>
                  <SelectItem value="a-chiamata">A chiamata</SelectItem>
                  <SelectItem value="prestazione-occasionale">Prestazione occasionale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start and End Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data inizio contratto</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {(employmentType === "determinato" || employmentType === "prestazione-occasionale") && (
                <div className="space-y-2">
                  <Label>Data fine contratto</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                        disabled={(date) => 
                          (startDate ? date < startDate : false)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {/* Contract Sign Date */}
            <div className="space-y-2">
              <Label>Data firma contratto</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !contractSignDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {contractSignDate ? format(contractSignDate, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={contractSignDate}
                    onSelect={setContractSignDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Separator className="my-6" />
            <h3 className="text-lg font-medium">Orario di Lavoro</h3>

            {/* Working hours fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weeklyHours">Ore settimanali</Label>
                <Input
                  id="weeklyHours"
                  type="number"
                  min="0"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(e.target.value)}
                  placeholder="Es. 40"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="normalHoursPercentage">Percentuale dell'orario normale</Label>
                <Input
                  id="normalHoursPercentage"
                  value={normalHoursPercentage}
                  onChange={(e) => setNormalHoursPercentage(e.target.value)}
                  placeholder="Es. 100%"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workingHoursClause">Dicitura orario di lavoro</Label>
              <Textarea
                id="workingHoursClause"
                value={workingHoursClause}
                onChange={(e) => setWorkingHoursClause(e.target.value)}
                placeholder="Es. L'orario di lavoro è articolato su 5 giorni settimanali, dal lunedì al venerdì, per 8 ore giornaliere"
                className="min-h-[80px]"
              />
            </div>

            <Separator className="my-6" />
            <h3 className="text-lg font-medium">Sede di Lavoro</h3>

            {/* Work location fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workLocation">Sede di lavoro</Label>
                <Input
                  id="workLocation"
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  placeholder="Es. Milano"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workSite">Location di lavoro</Label>
                <Input
                  id="workSite"
                  value={workSite}
                  onChange={(e) => setWorkSite(e.target.value)}
                  placeholder="Es. Via Roma 123"
                />
              </div>
            </div>

            <Separator className="my-6" />
            <h3 className="text-lg font-medium">Retribuzione</h3>

            {/* Compensation fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePayAndContingency">Paga base e contingenza (€)</Label>
                <Input
                  id="basePayAndContingency"
                  type="number"
                  min="0"
                  step="0.01"
                  value={basePayAndContingency}
                  onChange={(e) => setBasePayAndContingency(e.target.value)}
                  placeholder="€ 0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edr">EDR (€)</Label>
                <Input
                  id="edr"
                  type="number"
                  min="0"
                  step="0.01"
                  value={edr}
                  onChange={(e) => setEdr(e.target.value)}
                  placeholder="€ 0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalMonthlyCompensation">Totale retribuzione mese (€)</Label>
                <Input
                  id="totalMonthlyCompensation"
                  type="number"
                  min="0"
                  step="0.01"
                  value={totalMonthlyCompensation}
                  onChange={(e) => setTotalMonthlyCompensation(e.target.value)}
                  placeholder="€ 0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totalAnnualCompensation">Totale annuo (x 13) (€)</Label>
                <Input
                  id="totalAnnualCompensation"
                  type="number"
                  min="0"
                  step="0.01"
                  value={totalAnnualCompensation}
                  onChange={(e) => setTotalAnnualCompensation(e.target.value)}
                  placeholder="€ 0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grossSalary">Retribuzione lorda (€)</Label>
                <Input
                  id="grossSalary"
                  type="number"
                  min="0"
                  step="0.01"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(e.target.value)}
                  placeholder="€ 0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="netSalary">Retribuzione netta (€)</Label>
                <Input
                  id="netSalary"
                  type="number"
                  min="0"
                  step="0.01"
                  value={netSalary}
                  onChange={(e) => setNetSalary(e.target.value)}
                  placeholder="€ 0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rebalancing">Riproporzionamento</Label>
              <Input
                id="rebalancing"
                value={rebalancing}
                onChange={(e) => setRebalancing(e.target.value)}
                placeholder="Es. Sulla base delle ore effettivamente lavorate"
              />
            </div>

            <Separator className="my-6" />
            <h3 className="text-lg font-medium">Formazione</h3>

            {/* Training fields */}
            <div className="space-y-2">
              <Label htmlFor="trainerName">Nominativo Formatore</Label>
              <Input
                id="trainerName"
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                placeholder="Es. Mario Rossi"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Inizio formazione</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !trainingStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {trainingStartDate ? format(trainingStartDate, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={trainingStartDate}
                      onSelect={setTrainingStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Fine formazione</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !trainingEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {trainingEndDate ? format(trainingEndDate, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={trainingEndDate}
                      onSelect={setTrainingEndDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      disabled={(date) => 
                        (trainingStartDate ? date < trainingStartDate : false)
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Separator className="my-6" />
            <h3 className="text-lg font-medium">Clausole Contrattuali</h3>

            {/* Contract clauses */}
            <div className="space-y-2">
              <Label htmlFor="contractClause">Dicitura contratto</Label>
              <Textarea
                id="contractClause"
                value={contractClause}
                onChange={(e) => setContractClause(e.target.value)}
                placeholder="Es. Il presente contratto è disciplinato dalle norme di legge in materia di lavoro"
                className="min-h-[100px]"
              />
            </div>

            {/* Template di contratto */}
            <div className="pt-4 space-y-2">
              <Label htmlFor="contractTemplate">Template Contratto (DOCX)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="contractTemplate"
                  type="file"
                  accept=".docx"
                  onChange={handleTemplateChange}
                  className="flex-1"
                />
                <div className="min-w-[160px]">
                  {templateFile && (
                    <p className="text-sm text-green-600 truncate">
                      {templateFile.name}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Carica un template DOCX con campi come {"{Nome}"}, {"{Cognome}"}, {"{CodiceFiscale}"}, ecc.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={onSave} variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Salva Dati
          </Button>
          
          <Button onClick={onGenerateContract}>
            <Download className="mr-2 h-4 w-4" />
            Genera Contratto
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ContractTab;
