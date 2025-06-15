
import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableCell } from "@/components/ui/table";
import { Event } from "@/types/event";
import { Operator } from "@/types/operator";
import SortableTableHeader from "./SortableTableHeader";
import OperatorTableRow from "./OperatorTableRow";
import { getOperatorProfileCompletion } from "./utils/operatorProfileCompletion";
import { Progress } from "@/components/ui/progress";

interface OperatorsTableProps {
  operators: Operator[];
  events: Event[];
  allOperators: Operator[];
  sortConfig: { key: string; direction: 'asc' | 'desc' | null };
  onSort: (key: string) => void;
  onStatusToggle: (id: number) => void;
  onEdit: (operator: Operator) => void;
  onDelete: (id: number) => void;
}

const OperatorsTable: React.FC<OperatorsTableProps> = ({
  operators,
  events,
  allOperators,
  sortConfig,
  onSort,
  onStatusToggle,
  onEdit,
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableTableHeader sortKey="name" currentSort={sortConfig} onSort={onSort}>
            Nome
          </SortableTableHeader>
          <SortableTableHeader sortKey="surname" currentSort={sortConfig} onSort={onSort}>
            Cognome
          </SortableTableHeader>
          <TableHead>Cell.</TableHead>
          <SortableTableHeader sortKey="gender" currentSort={sortConfig} onSort={onSort}>
            Genere
          </SortableTableHeader>
          <SortableTableHeader sortKey="profession" currentSort={sortConfig} onSort={onSort}>
            Professione
          </SortableTableHeader>
          <SortableTableHeader sortKey="status" currentSort={sortConfig} onSort={onSort}>
            Stato
          </SortableTableHeader>
          <TableHead>Eventi Assegnati</TableHead>
          <TableHead>%Profilo</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {operators.map((operator) => {
          const { percent } = getOperatorProfileCompletion(operator as any);
          return (
            <OperatorTableRow
              key={operator.id}
              operator={operator}
              events={events}
              operators={allOperators}
              onStatusToggle={onStatusToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              profileCompletion={percent}
            />
          );
        })}
        {operators.length === 0 && (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-4">
              Nessun operatore trovato con i filtri applicati
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default OperatorsTable;
