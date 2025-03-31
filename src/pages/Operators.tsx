
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Layout from "@/components/Layout";
import OperatorsList from "@/components/operators/OperatorsList";
import OperatorFormDialog from "@/components/operators/OperatorFormDialog";
import AssignEventDialog from "@/components/operators/AssignEventDialog";
import { useOperators } from "@/hooks/useOperators";

const Operators = () => {
  const {
    operators,
    events,
    isDialogOpen,
    setIsDialogOpen,
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    editingOperator,
    assigningOperator,
    selectedEventId,
    setSelectedEventId,
    formData,
    setFormData,
    handleStatusToggle,
    handleDelete,
    openEditDialog,
    handleNewOperator,
    handleSubmit,
    openAssignDialog,
    handleAssignSubmit,
    handleEdit
  } = useOperators();

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista Operatori</CardTitle>
          <Button onClick={handleNewOperator}>
            <Plus className="mr-2 h-4 w-4" />
            Nuovo Operatore
          </Button>
        </CardHeader>
        <CardContent>
          <OperatorsList 
            operators={operators}
            events={events}
            onStatusToggle={handleStatusToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAssign={openAssignDialog}
          />
        </CardContent>
      </Card>

      <OperatorFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formData={formData}
        setFormData={setFormData}
        editingOperator={editingOperator}
        onSubmit={handleSubmit}
      />

      <AssignEventDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        assigningOperator={assigningOperator}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
        events={events}
        onSubmit={handleAssignSubmit}
      />
    </Layout>
  );
};

export default Operators;
