
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
    nationality: string;
  };
  onFilterChange: (field: string, value: string) => void;
  nationalityOptions: string[];
}

const OperatorFilters: React.FC<OperatorFiltersProps> = ({
  filters,
  onFilterChange,
  nationalityOptions = [],
}) => {
  return (
    <div className="w-full mb-4">
      {/* Central search bar */}
      <div className="flex justify-center mb-3">
        <div className="w-full max-w-xl relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            id="filter-search"
            placeholder="Cerca per nome, cognome o cellulare..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-10 py-3 text-lg shadow-md"
          />
        </div>
      </div>

      {/* Quick filters below */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-stretch">
        <div className="flex-1">
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

        <div className="flex-1">
          <Label htmlFor="filter-profession">Attività</Label>
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

        {/* Filtro nazionalità */}
        <div className="flex-1">
          <Label htmlFor="filter-nationality">Nazionalità</Label>
          <Select
            value={filters.nationality}
            onValueChange={(value) => onFilterChange('nationality', value)}
          >
            <SelectTrigger id="filter-nationality">
              <SelectValue placeholder="Tutte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte</SelectItem>
              {nationalityOptions.map((nationality) => (
                <SelectItem key={nationality || 'N/A'} value={nationality}>{nationality || '-'}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default OperatorFilters;

