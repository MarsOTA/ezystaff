
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
const ContractTrainerFields = ({
  trainerName,
  setTrainerName,
  trainingStartDate,
  setTrainingStartDate,
  trainingEndDate,
  setTrainingEndDate
}) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="trainerName">Nominativo Formatore</Label>
      <input
        type="text"
        id="trainerName"
        className="w-full border rounded px-3 py-2"
        value={trainerName}
        onChange={e => setTrainerName(e.target.value)}
      />
    </div>
    <div>
      <Label>Inizio Formazione</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !trainingStartDate && "text-muted-foreground"
            )}
          >
            {trainingStartDate ? format(trainingStartDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={trainingStartDate}
            onSelect={setTrainingStartDate}
            disabled={date =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
    <div>
      <Label>Fine Formazione</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !trainingEndDate && "text-muted-foreground"
            )}
          >
            {trainingEndDate ? format(trainingEndDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={trainingEndDate}
            onSelect={setTrainingEndDate}
            disabled={date =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  </div>
);

export default ContractTrainerFields;
