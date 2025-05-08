
import React from 'react';
import { AlertCircle } from "lucide-react";

export type AvailabilityStatus = 'yes' | 'no' | 'partial';

interface AvailabilityBadgeProps {
  availability: AvailabilityStatus;
  conflicts: string[];
}

const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ availability, conflicts }) => {
  switch(availability) {
    case 'yes':
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">Disponibile</span>;
    case 'no':
      return (
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
            Non Disponibile
          </span>
          {conflicts.length > 0 && (
            <span className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> 
              Conflitto: {conflicts.join(", ")}
            </span>
          )}
        </div>
      );
    case 'partial':
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">Parziale</span>;
    default:
      return <span>N/A</span>;
  }
};

export default AvailabilityBadge;
