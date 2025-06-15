
import React from "react";
import { Event } from "@/types/event";
import { Operator } from "@/types/operator";
import OperatorFilters from "./OperatorFilters";
import OperatorsTable from "./OperatorsTable";
import { useOperatorsList } from "./hooks/useOperatorsList";

interface OperatorsListProps {
  operators: Operator[];
  events: Event[];
  onStatusToggle: (id: number) => void;
  onEdit: (operator: Operator) => void;
  onDelete: (id: number) => void;
  onAssign: (operator: Operator) => void;
}

const OperatorsList: React.FC<OperatorsListProps> = ({
  operators,
  events,
  onStatusToggle,
  onEdit,
  onDelete,
  onAssign,
}) => {
  const {
    filters,
    sortConfig,
    filteredAndSortedOperators,
    handleFilterChange,
    handleSort,
    nationalityOptions
  } = useOperatorsList({ operators });

  return (
    <div className="space-y-4">
      <OperatorFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        nationalityOptions={nationalityOptions}
      />

      <OperatorsTable
        operators={filteredAndSortedOperators}
        events={events}
        allOperators={operators}
        sortConfig={sortConfig}
        onSort={handleSort}
        onStatusToggle={onStatusToggle}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default OperatorsList;
