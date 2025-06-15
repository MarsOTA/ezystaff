
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ExtendedOperator } from "@/types/operator";

interface ServicesCardProps {
  operator: ExtendedOperator;
  onServiceToggle: (service: string) => void;
}

const occupations = [
  "Security", "Steward", "Hostess", "Controllo Accessi", 
  "Vigilanza", "Antitaccheggio", "Bodyguard", "Altro"
];

// "service" is the field used in logic. Ensure we're using "service" array.
const ServicesCard: React.FC<ServicesCardProps> = ({ operator, onServiceToggle }) => {
  const selectedServices = operator.service || [];

  return (
    <div className="flex flex-wrap gap-2">
      {occupations.map((mansione) => (
        <Badge
          key={mansione}
          variant={selectedServices.includes(mansione) ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onServiceToggle(mansione)}
        >
          {mansione}
        </Badge>
      ))}
    </div>
  );
};

export default ServicesCard;
