
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ExtendedOperator } from "@/types/operator";

interface NotesCardProps {
  operator: ExtendedOperator;
  onFieldChange: (field: keyof ExtendedOperator, value: any) => void;
}

const NotesCard: React.FC<NotesCardProps> = ({ operator, onFieldChange }) => (
  <Textarea
    value={operator.notes || ""}
    onChange={(e) => onFieldChange("notes", e.target.value)}
    placeholder="Inserisci note aggiuntive sull'operatore..."
    className="min-h-[100px]"
  />
);

export default NotesCard;
