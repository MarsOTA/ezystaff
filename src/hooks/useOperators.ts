
import { useOperatorStorage } from "./operators/useOperatorStorage";
import { useOperatorForm } from "./operators/useOperatorForm";
import { useOperatorEventAssignment } from "./operators/useOperatorEventAssignment";

export const EVENTS_STORAGE_KEY = "app_events_data";
export const OPERATORS_STORAGE_KEY = "app_operators_data";

export const useOperators = () => {
  // Get operators storage and state management
  const { operators, setOperators, events } = useOperatorStorage();
  
  // Get form handling functionality
  const {
    isDialogOpen,
    setIsDialogOpen,
    editingOperator,
    formData,
    setFormData,
    handleStatusToggle,
    handleDelete,
    openEditDialog,
    handleNewOperator,
    handleSubmit,
    handleEdit
  } = useOperatorForm(operators, setOperators);
  
  // Get event assignment functionality
  const {
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    assigningOperator,
    selectedEventId,
    setSelectedEventId,
    openAssignDialog,
    handleAssignSubmit
  } = useOperatorEventAssignment(operators, setOperators, events);

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
