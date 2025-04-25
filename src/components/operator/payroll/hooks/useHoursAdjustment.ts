
import { useState } from "react";
import { PayrollCalculation } from "../types";
import { toast } from "sonner";

export const useHoursAdjustment = (updateActualHours: (eventId: number, actualHours: number) => boolean) => {
  const [isHoursDialogOpen, setIsHoursDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<PayrollCalculation | null>(null);

  const openHoursDialog = (event: PayrollCalculation) => {
    setSelectedEvent(event);
    setIsHoursDialogOpen(true);
  };

  const handleHoursSubmit = (eventId: number, actualHours: number) => {
    if (actualHours < 0) {
      toast.error("Le ore devono essere maggiori di zero");
      return;
    }

    const success = updateActualHours(eventId, actualHours);
    if (success) {
      setIsHoursDialogOpen(false);
    }
  };

  return {
    isHoursDialogOpen,
    setIsHoursDialogOpen,
    selectedEvent,
    openHoursDialog,
    handleHoursSubmit
  };
};
