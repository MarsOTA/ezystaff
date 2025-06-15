
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ExtendedOperator } from "@/types/operator";

interface ServicesCardProps {
  operator: ExtendedOperator;
  onServiceToggle: (service: string) => void;
}

// Cambiamo l'etichetta in "Mansione" con servizi aggiornati?
const occupations = [
  "Security", "Steward", "Hostess", "Controllo Accessi", 
  "Vigilanza", "Antitaccheggio", "Bodyguard", "Altro"
];

const ServicesCard: React.FC<ServicesCardProps> = ({ operator, onServiceToggle }) => (
  <div className="flex flex-wrap gap-2">
    {occupations.map((mansione) => (
      <Badge
        key={mansione}
        variant={operator.services?.includes(mansione) ? "default" : "outline"}
        className="cursor-pointer"
        onClick={() => onServiceToggle(mansione)}
      >
        {mansione}
      </Badge>
    ))}
  </div>
);

export default ServicesCard;
