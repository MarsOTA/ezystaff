import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { Operator } from "@/types/operator";
import { useOperators } from "@/hooks/useOperators";

interface OperatorSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedOperatorIds: number[]) => void;
  preSelectedOperators?: number[];
  date: Date;
}

const OperatorSelectionModal: React.FC<OperatorSelectionModalProps> = ({
  open,
  onClose,
  onConfirm,
  preSelectedOperators = [],
  date
}) => {
  const { operators } = useOperators();
  const [selectedOperators, setSelectedOperators] = useState<number[]>(preSelectedOperators);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedOperators([...preSelectedOperators]);
    }
  }, [preSelectedOperators, open]);

  const filteredOperators = operators.filter(operator => {
    const fullName = `${operator.name} ${operator.surname}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) && operator.status === 'active';
  });

  const handleOperatorToggle = (operatorId: number) => {
    setSelectedOperators(prev => 
      prev.includes(operatorId) 
        ? prev.filter(id => id !== operatorId)
        : [...prev, operatorId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOperators.length === filteredOperators.length) {
      setSelectedOperators([]);
    } else {
      setSelectedOperators(filteredOperators.map(op => op.id));
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedOperators);
    onClose();
  };

  const handleCancel = () => {
    setSelectedOperators(preSelectedOperators);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Seleziona operatori per {date.toLocaleDateString('it-IT')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca operatori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedOperators.length === filteredOperators.length ? 'Deseleziona tutti' : 'Seleziona tutti'}
            </Button>
          </div>

          <div className="border rounded-md flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedOperators.length === filteredOperators.length && filteredOperators.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cognome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefono</TableHead>
                  <TableHead>Professione</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOperators.length > 0 ? (
                  filteredOperators.map((operator) => (
                    <TableRow key={operator.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedOperators.includes(operator.id)}
                          onCheckedChange={() => handleOperatorToggle(operator.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{operator.name}</TableCell>
                      <TableCell>{operator.surname}</TableCell>
                      <TableCell>{operator.email}</TableCell>
                      <TableCell>{operator.phone}</TableCell>
                      <TableCell>{operator.profession || '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Nessun operatore trovato
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="text-sm text-muted-foreground">
            {selectedOperators.length} operatori selezionati su {filteredOperators.length} disponibili
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Annulla
          </Button>
          <Button onClick={handleConfirm}>
            Conferma selezione ({selectedOperators.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OperatorSelectionModal;