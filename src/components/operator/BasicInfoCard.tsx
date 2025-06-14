
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExtendedOperator } from "@/types/operator";

interface BasicInfoCardProps {
  operator: ExtendedOperator;
  onFieldChange: (field: keyof ExtendedOperator, value: any) => void;
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  operator,
  onFieldChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informazioni di Base</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={operator.name || ""}
              onChange={(e) => onFieldChange("name", e.target.value)}
              placeholder="Inserisci il nome"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="surname">Cognome *</Label>
            <Input
              id="surname"
              value={operator.surname || ""}
              onChange={(e) => onFieldChange("surname", e.target.value)}
              placeholder="Inserisci il cognome"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={operator.email || ""}
              onChange={(e) => onFieldChange("email", e.target.value)}
              placeholder="Inserisci l'email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Cellulare *</Label>
            <Input
              id="phone"
              value={operator.phone || ""}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              placeholder="Inserisci il numero di cellulare"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
