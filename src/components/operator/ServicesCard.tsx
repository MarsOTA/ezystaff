
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ExtendedOperator } from "@/types/operator";

interface ServicesCardProps {
  operator: ExtendedOperator;
  onServiceToggle: (service: string) => void;
}

const services = [
  "Security", "Steward", "Hostess", "Controllo Accessi", 
  "Vigilanza", "Antitaccheggio", "Bodyguard", "Altro"
];

const ServicesCard: React.FC<ServicesCardProps> = ({ operator, onServiceToggle }) => (
  <div className="flex flex-wrap gap-2">
    {services.map((service) => (
      <Badge
        key={service}
        variant={operator.services?.includes(service) ? "default" : "outline"}
        className="cursor-pointer"
        onClick={() => onServiceToggle(service)}
      >
        {service}
      </Badge>
    ))}
  </div>
);

export default ServicesCard;
