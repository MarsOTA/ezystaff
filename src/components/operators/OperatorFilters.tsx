
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface OperatorFiltersProps {
  filters: {
    search: string;
    gender: string;
    profession: string;
  };
  onFilterChange: (field: string, value: string) => void;
}

const OperatorFilters: React.FC<OperatorFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
      <div className="space-y-2">
        <Label htmlFor="filter-search">Cerca</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="filter-search"
            placeholder="Cerca per nome, cognome o cellulare..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
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
            <SelectItem value="all">Tutti</SelectItem>
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
            <SelectItem value="all">Tutte</SelectItem>
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
