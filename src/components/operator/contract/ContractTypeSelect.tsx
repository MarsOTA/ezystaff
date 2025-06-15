
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const contractTypes = [
  { value: "a-chiamata", label: "A chiamata" },
  { value: "determinato", label: "A tempo determinato" },
  { value: "indeterminato", label: "A tempo indeterminato" },
  { value: "prestazione-occasionale", label: "Prestazione occasionale" },
];

interface ContractTypeSelectProps {
  contractType: string;
  onContractTypeChange: (value: string) => void;
}

const ContractTypeSelect: React.FC<ContractTypeSelectProps> = ({
  contractType,
  onContractTypeChange,
}) => (
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
);

export default ContractTypeSelect;
