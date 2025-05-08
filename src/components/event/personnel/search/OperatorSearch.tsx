
import React from 'react';
import { Input } from "@/components/ui/input";

interface OperatorSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const OperatorSearch: React.FC<OperatorSearchProps> = ({ 
  searchQuery, 
  onSearchChange 
}) => {
  return (
    <Input 
      placeholder="Cerca operatore..." 
      className="max-w-xs"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
};

export default OperatorSearch;
