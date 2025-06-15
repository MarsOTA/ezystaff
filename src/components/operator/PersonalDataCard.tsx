
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ExtendedOperator } from "@/types/operator";

interface PersonalDataCardProps {
  operator: ExtendedOperator;
  onFieldChange: (field: keyof ExtendedOperator, value: any) => void;
}

const calculateAge = (birthDate?: string) => {
  if (!birthDate) return "-";
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const PersonalDataCard: React.FC<PersonalDataCardProps> = ({ operator, onFieldChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="space-y-2">
      <Label htmlFor="birthDate">Data di Nascita</Label>
      <Input
        id="birthDate"
        type="date"
        value={operator.birthDate || ""}
        onChange={(e) => onFieldChange("birthDate", e.target.value)}
      />
      <span className="text-xs text-muted-foreground">Età: {calculateAge(operator.birthDate)}</span>
    </div>
    <div className="space-y-2">
      <Label htmlFor="birthCountry">Luogo di Nascita</Label>
      <Input
        id="birthCountry"
        value={operator.birthCountry || ""}
        onChange={(e) => onFieldChange("birthCountry", e.target.value)}
        placeholder="Inserisci il luogo di nascita"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="gender">Genere</Label>
      <select
        id="gender"
        value={operator.gender || ""}
        onChange={(e) => onFieldChange("gender", e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="">Seleziona genere</option>
        <option value="maschio">Maschio</option>
        <option value="femmina">Femmina</option>
        <option value="altro">Altro</option>
      </select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="fiscalCode">Codice Fiscale</Label>
      <Input
        id="fiscalCode"
        value={operator.fiscalCode || ""}
        onChange={(e) => onFieldChange("fiscalCode", e.target.value)}
        placeholder="Inserisci il codice fiscale"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="nationality">Nazionalità</Label>
      <Input
        id="nationality"
        value={operator.nationality || ""}
        onChange={(e) => onFieldChange("nationality", e.target.value)}
        placeholder="Inserisci la nazionalità"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="profession">Professione</Label>
      <Input
        id="profession"
        value={operator.profession || ""}
        onChange={(e) => onFieldChange("profession", e.target.value)}
        placeholder="Inserisci la professione"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="height">Altezza (cm)</Label>
      <Input
        id="height"
        type="number"
        min={0}
        value={operator.height || ""}
        onChange={(e) => onFieldChange("height", e.target.value ? Number(e.target.value) : "")}
        placeholder="Es: 180"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="weight">Peso (kg)</Label>
      <Input
        id="weight"
        type="number"
        min={0}
        value={operator.weight || ""}
        onChange={(e) => onFieldChange("weight", e.target.value ? Number(e.target.value) : "")}
        placeholder="Es: 75"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="shoeSize">N° di Scarpe</Label>
      <Input
        id="shoeSize"
        type="number"
        min={0}
        value={operator.shoeSize || ""}
        onChange={(e) => onFieldChange("shoeSize", e.target.value ? Number(e.target.value) : "")}
        placeholder="Es: 43"
      />
    </div>
    <div className="space-y-2 flex items-center gap-2 mt-6">
      <Checkbox
        id="visibleTattoos"
        checked={!!operator.visibleTattoos}
        onCheckedChange={(checked) => onFieldChange("visibleTattoos", checked === true)}
      />
      <Label htmlFor="visibleTattoos" className="mb-0">
        Presenza di tatuaggi visibili
      </Label>
    </div>
    <div className="space-y-2 md:col-span-3">
      <Label htmlFor="address">Indirizzo Completo</Label>
      <Textarea
        id="address"
        value={operator.address || ""}
        onChange={(e) => onFieldChange("address", e.target.value)}
        placeholder="Inserisci l'indirizzo completo"
        className="min-h-[80px]"
      />
    </div>
  </div>
);

export default PersonalDataCard;
