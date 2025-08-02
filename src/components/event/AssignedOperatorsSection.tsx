import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { X, Mail } from "lucide-react";
import { toast } from "sonner";
import { useOperators } from "@/hooks/useOperators";

interface AssignedOperatorsSectionProps {
  assignedOperators: number[];
  onRemoveOperator: (operatorId: number) => void;
}

const AssignedOperatorsSection: React.FC<AssignedOperatorsSectionProps> = ({
  assignedOperators,
  onRemoveOperator
}) => {
  const { operators } = useOperators();

  const getOperatorById = (id: number) => {
    return operators.find(op => op.id === id);
  };

  const handleSendEmail = async (operatorId: number) => {
    const operator = getOperatorById(operatorId);
    if (!operator?.email) {
      toast.error("Email dell'operatore non disponibile");
      return;
    }

    // Simulazione invio email - qui si può integrare con un'API reale
    try {
      // Simulazione del delay dell'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Email di conferma inviata a ${operator.name} ${operator.surname}`);
    } catch (error) {
      toast.error("Errore nell'invio dell'email");
    }
  };

  if (!assignedOperators || assignedOperators.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="assigned-operators">
          <AccordionTrigger className="text-left">
            <span className="font-medium">
              Operatori selezionati ({assignedOperators.length})
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {assignedOperators.map((operatorId) => {
                const operator = getOperatorById(operatorId);
                if (!operator) return null;

                return (
                  <div
                    key={operatorId}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <span className="font-medium">
                        {operator.name} {operator.surname}
                      </span>
                      {operator.email && (
                        <div className="text-sm text-muted-foreground">
                          {operator.email}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendEmail(operatorId)}
                        className="h-8 w-8 p-0"
                        title="Invia email di conferma"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveOperator(operatorId)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title="Rimuovi operatore"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AssignedOperatorsSection;