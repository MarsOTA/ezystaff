import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Operator, OPERATORS_STORAGE_KEY } from "@/types/operator";
import { safeLocalStorage } from "@/utils/fileUtils";

export const useOperatorForm = (
  operators: Operator[], 
  setOperators: React.Dispatch<React.SetStateAction<Operator[]>>
) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    status: "active" as "active" | "inactive",
  });

  const navigate = useNavigate();

  const saveOperatorsToStorage = (updatedOperators: Operator[]) => {
    safeLocalStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(updatedOperators));
    setOperators(updatedOperators);
    
    // Dispatch events to notify other components
    window.dispatchEvent(new CustomEvent('operatorAssigned'));
    window.dispatchEvent(new StorageEvent('storage', {
      key: OPERATORS_STORAGE_KEY,
      newValue: JSON.stringify(updatedOperators)
    }));
  };

  const handleStatusToggle = (id: number) => {
    const updatedOperators = operators.map((op) =>
      op.id === id
        ? { ...op, status: (op.status === "active" ? "inactive" : "active") as "active" | "inactive" }
        : op
    );
    
    console.log("Toggling operator status:", { id, updatedOperators });
    saveOperatorsToStorage(updatedOperators);
    toast.success("Stato operatore aggiornato con successo");
  };

  const handleDelete = (id: number) => {
    const updatedOperators = operators.filter((op) => op.id !== id);
    saveOperatorsToStorage(updatedOperators);
    toast.success("Operatore eliminato con successo");
  };

  const openEditDialog = (operator: Operator) => {
    setEditingOperator(operator);
    setFormData({
      name: operator.name,
      surname: operator.surname,
      email: operator.email,
      phone: operator.phone,
      status: operator.status,
    });
    setIsDialogOpen(true);
  };

  const handleNewOperator = () => {
    setEditingOperator(null);
    setFormData({
      name: "",
      surname: "",
      email: "",
      phone: "",
      status: "active",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let updatedOperators;
    if (editingOperator) {
      updatedOperators = operators.map((op) =>
        op.id === editingOperator.id
          ? { ...op, ...formData }
          : op
      );
      toast.success("Operatore aggiornato con successo");
    } else {
      const newId = Math.max(0, ...operators.map((op) => op.id)) + 1;
      updatedOperators = [
        ...operators,
        { id: newId, ...formData, assignedEvents: [] },
      ];
      toast.success("Nuovo operatore aggiunto con successo");
    }
    
    saveOperatorsToStorage(updatedOperators);
    setIsDialogOpen(false);
  };

  const handleEdit = (operator: Operator) => {
    navigate(`/operator-profile/${operator.id}`);
  };

  return {
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
  };
};
