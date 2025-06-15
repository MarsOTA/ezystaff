
import React, { useState, useEffect } from "react";
import { ExtendedOperator } from "@/types/operator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

// Tipi per l'incarico/assegnazione per l'operatore
type AssignmentRow = {
  id: number;
  eventName: string;
  date: string;
  grossHours: number;
  actualHours: number;
};

const getStoredEvents = () => {
  try {
    const events = JSON.parse(localStorage.getItem("app_events_data") || "[]");
    return events;
  } catch {
    return [];
  }
};

const getAttendance = () => {
  try {
    const attendance = JSON.parse(localStorage.getItem("attendance_records") || "[]");
    return attendance;
  } catch {
    return [];
  }
};

const PayrollTab: React.FC<{ operator: ExtendedOperator }> = ({ operator }) => {
  const [rows, setRows] = useState<AssignmentRow[]>([]);
  const [editHours, setEditHours] = useState<{ [id: number]: number | null }>({});

  useEffect(() => {
    // Recupera gli eventi assegnati all'operatore
    const allEvents = getStoredEvents();
    if (!allEvents || !Array.isArray(allEvents)) return;
    // trova le assegnazioni dell'operatore
    const assignedIds = operator.assignedEvents || [];
    const attendanceRecords = getAttendance();

    const result: AssignmentRow[] = allEvents
      .filter((ev: any) => assignedIds.includes(ev.id))
      .map((ev: any) => {
        // Ore lorde calcolate dalla durata dell'evento o dai turni
        let gross = 0;
        // Può essere fornito direttamente dagli eventi
        if (ev.grossHours !== undefined) {
          gross = Number(ev.grossHours);
        } else if (Array.isArray(ev.shifts)) {
          gross = ev.shifts.reduce((sum: number, shift: any) => {
            const start = new Date(shift.startTime);
            const end = new Date(shift.endTime);
            return sum + ((end.getTime() - start.getTime()) / (1000 * 60 * 60));
          }, 0);
        } else {
          // fallback: differenza fra date evento
          const start = new Date(ev.startDate);
          const end = new Date(ev.endDate);
          gross = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }

        // Ore effettive calcolate da check-in/out
        const attendance = attendanceRecords.filter(
          (rec: any) => rec.operatorId === operator.email && rec.eventId === ev.id
        );
        let effective = 0;
        if (attendance.length > 0) {
          // Cerco un check-in e un check-out
          const checkIn = attendance.find((a: any) => a.type === "check-in");
          const checkOut = attendance.find((a: any) => a.type === "check-out");
          if (checkIn && checkOut) {
            const inDate = new Date(checkIn.timestamp);
            const outDate = new Date(checkOut.timestamp);
            effective = Math.max(0, (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60));
          } else if (checkIn) {
            // Solo checkin
            effective = 0;
          }
        }

        return {
          id: ev.id,
          eventName: ev.title,
          date: new Date(ev.startDate).toLocaleDateString("it-IT"),
          grossHours: Number(gross.toFixed(2)),
          actualHours: editHours[ev.id] !== undefined && editHours[ev.id] !== null 
            ? Number(editHours[ev.id])
            : Number(effective.toFixed(2))
        };
      });

    setRows(result);
  }, [operator, editHours]);

  const handleEdit = (id: number, value: string) => {
    const num = Number(value);
    if (isNaN(num) || num < 0) return;
    setEditHours(prev => ({ ...prev, [id]: num }));
  };

  const handleBlur = (id: number) => {
    toast.success("Ore effettive aggiornate!");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Payroll</h2>
      <div className="rounded-lg border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome evento</TableHead>
              <TableHead>Data evento</TableHead>
              <TableHead className="text-right">Ore lorde</TableHead>
              <TableHead className="text-right">Ore effettive (modificabili)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>Nessun incarico trovato.</TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.eventName}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell className="text-right">{row.grossHours}</TableCell>
                  <TableCell className="text-right">
                    <input
                      className="border rounded px-2 py-1 w-20 text-right"
                      type="number"
                      step="0.01"
                      min={0}
                      value={row.actualHours}
                      onChange={e => handleEdit(row.id, e.target.value)}
                      onBlur={() => handleBlur(row.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PayrollTab;
