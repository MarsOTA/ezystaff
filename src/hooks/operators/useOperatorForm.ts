
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Operator } from "@/types/operator";

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

  const handleStatusToggle = (id: number) => {
    setOperators((prev) =>
      prev.map((op) =>
        op.id === id
          ? { ...op, status: op.status === "active" ? "inactive" : "active" }
          : op
      )
    );
    toast.success("Stato operatore aggiornato con successo");
  };

  const handleDelete = (id: number) => {
    setOperators((prev) => prev.filter((op) => op.id !== id));
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
    
    if (editingOperator) {
      setOperators((prev) =>
        prev.map((op) =>
          op.id === editingOperator.id
            ? { ...op, ...formData }
            : op
        )
      );
      toast.success("Operatore aggiornato con successo");
    } else {
      const newId = Math.max(0, ...operators.map((op) => op.id)) + 1;
      setOperators((prev) => [
        ...prev,
        { id: newId, ...formData, assignedEvents: [] },
      ]);
      toast.success("Nuovo operatore aggiunto con successo");
    }
    
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
