
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
import { useOperatorStorage } from "@/hooks/operators/useOperatorStorage";
import { useOperatorForm } from "@/hooks/operators/useOperatorForm";
import { useOperatorEventAssignment } from "@/hooks/operators/useOperatorEventAssignment";

const Operators = () => {
  // Split the hooks for better organization
  const { operators, setOperators, events } = useOperatorStorage();
  const { 
    isDialogOpen, 
    setIsDialogOpen, 
    editingOperator, 
    formData, 
    setFormData,
    handleStatusToggle, 
    handleDelete, 
    openEditDialog, 
    handleNewOperator, 
    handleSubmit,
    handleEdit
  } = useOperatorForm(operators, setOperators);

  const {
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    assigningOperator,
    selectedEventId,
    setSelectedEventId,
    openAssignDialog,
    handleAssignSubmit,
    handleUnassignOperator
  } = useOperatorEventAssignment(operators, setOperators, events);

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
