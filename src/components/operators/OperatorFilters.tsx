
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface OperatorFiltersProps {
  filters: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    gender: string;
    profession: string;
  };
  onFilterChange: (field: string, value: string) => void;
}

const OperatorFilters: React.FC<OperatorFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
      <div className="space-y-2">
        <Label htmlFor="filter-name">Nome</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="filter-name"
            placeholder="Filtra per nome"
            value={filters.name}
            onChange={(e) => onFilterChange('name', e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-surname">Cognome</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="filter-surname"
            placeholder="Filtra per cognome"
            value={filters.surname}
            onChange={(e) => onFilterChange('surname', e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-email">Email</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="filter-email"
            placeholder="Filtra per email"
            value={filters.email}
            onChange={(e) => onFilterChange('email', e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-phone">Cell.</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="filter-phone"
            placeholder="Filtra per cellulare"
            value={filters.phone}
            onChange={(e) => onFilterChange('phone', e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-gender">Genere</Label>
        <Select value={filters.gender} onValueChange={(value) => onFilterChange('gender', value)}>
          <SelectTrigger id="filter-gender">
            <SelectValue placeholder="Tutti" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tutti</SelectItem>
            <SelectItem value="maschio">Maschio</SelectItem>
            <SelectItem value="femmina">Femmina</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-profession">Professione</Label>
        <Select value={filters.profession} onValueChange={(value) => onFilterChange('profession', value)}>
          <SelectTrigger id="filter-profession">
            <SelectValue placeholder="Tutte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tutte</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="doorman">Doorman</SelectItem>
            <SelectItem value="hostess">Hostess/Steward</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OperatorFilters;
