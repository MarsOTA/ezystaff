
import { toast } from "sonner";
import { Operator } from "@/types/operator";
import { saveOperators } from "@/utils/operatorUtils";

export const useOperatorStatus = (initialOperators: Operator[], setOperators: React.Dispatch<React.SetStateAction<Operator[]>>) => {
  
  /**
   * Toggle an operator's status between active and inactive
   */
  const handleStatusToggle = (id: number) => {
    setOperators((prev) => {
      const updated = prev.map((op) =>
        op.id === id
          ? { ...op, status: op.status === "active" ? "inactive" : "active" }
          : op
      );
      saveOperators(updated);
      return updated;
    });
    toast.success("Stato operatore aggiornato con successo");
  };

  /**
   * Delete an operator
   */
  const handleDelete = (id: number) => {
    setOperators((prev) => {
      const updated = prev.filter((op) => op.id !== id);
      saveOperators(updated);
      return updated;
    });
    toast.success("Operatore eliminato con successo");
  };

  return {
    handleStatusToggle,
    handleDelete,
  };
};
