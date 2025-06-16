
import React from "react";
import OperatorLayout from "@/components/OperatorLayout";
import { useOperatorTasks } from "@/hooks/useOperatorTasks";
import AssignmentCard from "@/components/operator/tasks/AssignmentCard";

const AllAssignmentsPage: React.FC = () => {
  const { tasks, loading } = useOperatorTasks();
  const sortedTasks = [...tasks].sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate));

  return (
    <OperatorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Tutti gli incarichi assegnati</h1>
        {loading ? (
          <div className="p-8 text-center">Caricamento incarichi...</div>
        ) : (
          <>
            {sortedTasks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">Nessun incarico trovato.</div>
            ) : (
              <div className="grid gap-4">
                {sortedTasks.map(event => (
                  <AssignmentCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </OperatorLayout>
  );
};

export default AllAssignmentsPage;
