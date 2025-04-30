
import { useState } from "react";
import { toast } from "sonner";
import { Operator } from "@/types/operator";
import { generateNewOperatorId, saveOperators } from "@/utils/operatorUtils";

export type OperatorFormData = {
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
};

export const useOperatorForm = (operators: Operator[], setOperators: React.Dispatch<React.SetStateAction<Operator[]>>) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [formData, setFormData] = useState<OperatorFormData>({
    name: "",
    email: "",
    phone: "",
    status: "active",
  });

  /**
   * Open dialog to edit an operator
   */
  const openEditDialog = (operator: Operator) => {
    setEditingOperator(operator);
    setFormData({
      name: operator.name,
      email: operator.email,
      phone: operator.phone,
      status: operator.status,
    });
    setIsDialogOpen(true);
  };

  /**
   * Open dialog to create a new operator
   */
  const handleNewOperator = () => {
    setEditingOperator(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "active",
    });
    setIsDialogOpen(true);
  };

  /**
   * Handle form submission for create/edit operator
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingOperator) {
      setOperators((prev) => {
        const updated = prev.map((op) =>
          op.id === editingOperator.id
            ? { ...op, ...formData }
            : op
        );
        saveOperators(updated);
        return updated;
      });
      toast.success("Operatore aggiornato con successo");
    } else {
      const newId = generateNewOperatorId(operators);
      setOperators((prev) => {
        const updated = [
          ...prev,
          { id: newId, ...formData, assignedEvents: [] },
        ];
        saveOperators(updated);
        return updated;
      });
      toast.success("Nuovo operatore aggiunto con successo");
    }
    
    setIsDialogOpen(false);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingOperator,
    setEditingOperator,
    formData,
    setFormData,
    openEditDialog,
    handleNewOperator,
    handleSubmit,
  };
};
