
import React from "react";
import { TableHead } from "@/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface SortableTableHeaderProps {
  children: React.ReactNode;
  sortKey: string;
  currentSort: { key: string; direction: 'asc' | 'desc' | null };
  onSort: (key: string) => void;
  className?: string;
}

const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
  children,
  sortKey,
  currentSort,
  onSort,
  className
}) => {
  const getSortIcon = () => {
    if (currentSort.key !== sortKey || currentSort.direction === null) {
      return <ChevronsUpDown className="h-4 w-4" />;
    }
    return currentSort.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <TableHead 
      className={`cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        {children}
        {getSortIcon()}
      </div>
    </TableHead>
  );
};

export default SortableTableHeader;
