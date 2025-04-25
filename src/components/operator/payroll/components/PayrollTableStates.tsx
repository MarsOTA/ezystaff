
import { TableRow, TableCell } from "@/components/ui/table";

interface PayrollTableStatesProps {
  loading: boolean;
  isEmpty: boolean;
}

export const PayrollTableStates: React.FC<PayrollTableStatesProps> = ({ loading, isEmpty }) => {
  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="h-24 text-center">
          Caricamento dati...
        </TableCell>
      </TableRow>
    );
  }

  if (isEmpty) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="h-24 text-center">
          Nessun dato disponibile
        </TableCell>
      </TableRow>
    );
  }

  return null;
};
