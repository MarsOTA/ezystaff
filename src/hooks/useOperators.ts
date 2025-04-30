
import { useState, useEffect } from "react";
import { Operator } from "@/types/operator";
import { Event } from "@/types/event";
import { loadOperators, loadEvents } from "@/utils/operatorUtils";
import { useOperatorStatus } from "@/hooks/useOperatorStatus";
import { useOperatorForm } from "@/hooks/useOperatorForm";
import { useOperatorAssignment } from "@/hooks/useOperatorAssignment";

export const useOperators = () => {
  // State for operators and events
  const [operators, setOperators] = useState<Operator[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  
  // Load data from local storage on mount
  useEffect(() => {
    setOperators(loadOperators());
    setEvents(loadEvents());
  }, []);
  
  // Import functionality from smaller hooks
  const { 
    handleStatusToggle, 
    handleDelete 
  } = useOperatorStatus(operators, setOperators);
  
  const {
    isDialogOpen,
    setIsDialogOpen,
    editingOperator,
    formData,
    setFormData,
    openEditDialog,
    handleNewOperator,
    handleSubmit,
  } = useOperatorForm(operators, setOperators);
  
  const {
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    assigningOperator,
    selectedEventId,
    setSelectedEventId,
    openAssignDialog,
    handleAssignSubmit,
    handleEdit,
  } = useOperatorAssignment(operators, setOperators, events, setEvents);

  // Return all the functionality
  return {
    operators,
    events,
    isDialogOpen,
    setIsDialogOpen,
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    editingOperator,
    assigningOperator,
    selectedEventId,
    setSelectedEventId,
    formData,
    setFormData,
    handleStatusToggle,
    handleDelete,
    openEditDialog,
    handleNewOperator,
    handleSubmit,
    openAssignDialog,
    handleAssignSubmit,
    handleEdit
  };
};
