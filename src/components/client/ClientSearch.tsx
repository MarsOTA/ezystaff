
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ClientSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="mb-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cerca per ragione sociale, P.IVA/C.F., email o telefono..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ClientSearch;
