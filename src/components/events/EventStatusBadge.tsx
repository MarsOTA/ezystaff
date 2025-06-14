
import React from 'react';
import { getStatusClass, getStatusText } from "@/utils/eventTableUtils";

interface EventStatusBadgeProps {
  status?: string;
}

const EventStatusBadge = ({ status }: EventStatusBadgeProps) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(status)}`}>
      {getStatusText(status)}
    </span>
  );
};

export default EventStatusBadge;
