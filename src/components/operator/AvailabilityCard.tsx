
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ExtendedOperator } from "@/types/operator";

interface AvailabilityCardProps {
  operator: ExtendedOperator;
  onAvailabilityToggle: (availability: string) => void;
}

const availabilities = [
  "Mattina", "Pomeriggio", "Sera", "Notte", 
  "Weekend", "Festivi", "Disponibilità completa"
];

const AvailabilityCard: React.FC<AvailabilityCardProps> = ({ operator, onAvailabilityToggle }) => (
  <div className="flex flex-wrap gap-2">
    {availabilities.map((availability) => (
      <Badge
        key={availability}
        variant={operator.availability?.includes(availability) ? "default" : "outline"}
        className="cursor-pointer"
        onClick={() => onAvailabilityToggle(availability)}
      >
        {availability}
      </Badge>
    ))}
  </div>
);

export default AvailabilityCard;
