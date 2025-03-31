
import React from "react";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyClientStateProps {
  searchTerm: string;
  onCreateClient: () => void;
}

const EmptyClientState: React.FC<EmptyClientStateProps> = ({
  searchTerm,
  onCreateClient,
}) => {
  return (
    <div className="text-center py-8">
      <Users className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-lg font-semibold">Nessun cliente</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {searchTerm ? "Nessun cliente trovato per la ricerca effettuata." : "Non ci sono clienti registrati. Inizia creando un nuovo cliente."}
      </p>
      {!searchTerm && (
        <Button onClick={onCreateClient} className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Crea nuovo cliente
        </Button>
      )}
    </div>
  );
};

export default EmptyClientState;
