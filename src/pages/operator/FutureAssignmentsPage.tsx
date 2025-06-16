
import React from "react";
import OperatorLayout from "@/components/OperatorLayout";
import { useOperatorTasks } from "@/hooks/useOperatorTasks";
import AssignmentCard from "@/components/operator/tasks/AssignmentCard";

// Utility per la data "oggi" senza ora/minuti
const isFutureEvent = (startDate: Date) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  return startDate > today;
};

const FutureAssignmentsPage: React.FC = () => {
  const { tasks, loading } = useOperatorTasks();
  const futureTasks = tasks
    .filter(t => isFutureEvent(new Date(t.startDate)))
    .sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate));

  return (
    <OperatorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Incarichi Futuri</h1>
        {loading ? (
          <div className="p-8 text-center">Caricamento incarichi...</div>
        ) : (
          <>
            {futureTasks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">Nessun incarico futuro assegnato.</div>
            ) : (
              <div className="grid gap-4">
                {futureTasks.map(event => (
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

export default FutureAssignmentsPage;
