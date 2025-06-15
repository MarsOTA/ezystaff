
import { useState, useMemo } from "react";
import { Operator } from "@/types/operator";

interface UseOperatorsListProps {
  operators: Operator[];
}

const getNationalityOptions = (operators: Operator[]): string[] => {
  const unique = Array.from(new Set(operators.map(op => op.nationality).filter(Boolean)));
  unique.sort();
  return unique;
};

export const useOperatorsList = ({ operators }: UseOperatorsListProps) => {
  const [filters, setFilters] = useState({
    search: '',
    gender: 'all',
    profession: 'all',
    nationality: 'all'
  });

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({
    key: '',
    direction: null
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const nationalityOptions = useMemo(() => getNationalityOptions(operators), [operators]);

  const filteredAndSortedOperators = useMemo(() => {
    let filtered = operators.filter(operator => {
      // Search filter (searches in name, surname, and phone)
      const searchTerm = filters.search.toLowerCase();
      const searchMatch = searchTerm === '' ||
        operator.name?.toLowerCase().includes(searchTerm) ||
        operator.surname?.toLowerCase().includes(searchTerm) ||
        operator.phone?.includes(searchTerm);

      const genderMatch = filters.gender === 'all' || operator.gender === filters.gender;
      const professionMatch = filters.profession === 'all' || operator.profession === filters.profession;
      const nationalityMatch = filters.nationality === 'all' || (operator.nationality || '') === filters.nationality;

      return searchMatch && genderMatch && professionMatch && nationalityMatch;
    });

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key as keyof Operator];
        let bValue = b[sortConfig.key as keyof Operator];

        // Handle undefined values
        if (aValue === undefined) aValue = '';
        if (bValue === undefined) bValue = '';

        // Convert to string for comparison
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();

        if (sortConfig.direction === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    return filtered;
  }, [operators, filters, sortConfig]);

  return {
    filters,
    sortConfig,
    filteredAndSortedOperators,
    handleFilterChange,
    handleSort,
    nationalityOptions
  };
};
