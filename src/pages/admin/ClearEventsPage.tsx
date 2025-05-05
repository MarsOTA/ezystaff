
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { clearAllOperatorEventAssignments } from "@/utils/operatorUtils";

const ClearEventsPage: React.FC = () => {
  const [isClearing, setIsClearing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const handleClearEvents = async () => {
    if (!confirmed) {
      setConfirmed(true);
      toast.warning("Conferma per procedere con l'eliminazione", {
        description: "Questa azione non può essere annullata"
      });
      return;
    }
    
    setIsClearing(true);
    
    try {
      const success = clearAllOperatorEventAssignments();
      
      if (success) {
        toast.success("Tutti gli eventi sono stati rimossi dagli operatori");
        setCompleted(true);
      } else {
        toast.error("Nessun operatore trovato o errore durante l'operazione");
      }
    } catch (error) {
      console.error("Error clearing events:", error);
      toast.error("Si è verificato un errore durante la rimozione degli eventi");
    } finally {
      setIsClearing(false);
    }
  };
  
  const resetState = () => {
    setConfirmed(false);
    setCompleted(false);
  };
  
  return (
    <Layout>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Cancellazione eventi assegnati agli operatori
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!completed ? (
            <div className="space-y-6">
              <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 rounded-md">
                <div className="flex gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-amber-800 dark:text-amber-300">Attenzione</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      Questa operazione rimuoverà tutti gli eventi attribuiti agli operatori.
                      L'azione è irreversibile e gli eventi dovranno essere riassegnati manualmente.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="destructive"
                onClick={handleClearEvents}
                disabled={isClearing}
                className="w-full"
              >
                {isClearing ? (
                  "Eliminazione in corso..."
                ) : confirmed ? (
                  "Conferma eliminazione"
                ) : (
                  "Cancella tutti gli eventi assegnati"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="py-8">
                <p className="text-green-600 dark:text-green-400 font-medium text-lg">
                  Operazione completata con successo
                </p>
                <p className="mt-2 text-muted-foreground">
                  Tutti gli eventi assegnati agli operatori sono stati rimossi.
                </p>
              </div>
              
              <Button onClick={resetState}>Torna indietro</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ClearEventsPage;
