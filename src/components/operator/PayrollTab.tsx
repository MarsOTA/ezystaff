
import React, { useState, useEffect } from "react";
import { ExtendedOperator } from "@/types/operator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Tipi per l'incarico/assegnazione per l'operatore
type AssignmentRow = {
  id: number;
  eventName: string;
  date: string;
  grossHours: number;
  actualHours: number;
  localActualHours?: number;
  saving?: boolean;
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

const getLocalEffectiveHours = (operatorId: string) => {
  try {
    const data = localStorage.getItem(`operator_${operatorId}_actual_hours`);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const setLocalEffectiveHours = (operatorId: string, data: Record<string, number>) => {
  try {
    localStorage.setItem(
      `operator_${operatorId}_actual_hours`,
      JSON.stringify(data)
    );
  } catch {
    //
  }
};

const PayrollTab: React.FC<{ operator: ExtendedOperator }> = ({ operator }) => {
  const [rows, setRows] = useState<AssignmentRow[]>([]);
  const [editHours, setEditHours] = useState<{ [id: number]: number | null }>({});
  const [savingRows, setSavingRows] = useState<{ [id: number]: boolean }>({});

  useEffect(() => {
    // Recupera eventi e calcola le ore
    const allEvents = getStoredEvents();
    if (!allEvents || !Array.isArray(allEvents)) return;
    const assignedIds = operator.assignedEvents || [];
    const attendanceRecords = getAttendance();
    const savedHoursLocal = getLocalEffectiveHours(operator.id?.toString() || operator.email);

    const result: AssignmentRow[] = allEvents
      .filter((ev: any) => assignedIds.includes(ev.id))
      .map((ev: any) => {
        // Ore lorde
        let gross = 0;
        if (ev.grossHours !== undefined) {
          gross = Number(ev.grossHours);
        } else if (Array.isArray(ev.shifts)) {
          gross = ev.shifts.reduce((sum: number, shift: any) => {
            const start = new Date(shift.startTime);
            const end = new Date(shift.endTime);
            return sum + ((end.getTime() - start.getTime()) / (1000 * 60 * 60));
          }, 0);
        } else {
          const start = new Date(ev.startDate);
          const end = new Date(ev.endDate);
          gross = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }

        // Ore effettive dal localStorage oppure attendance
        let effective = 0;
        const attendance = attendanceRecords.filter(
          (rec: any) => (rec.operatorId === (operator.email || operator.id) && rec.eventId === ev.id)
        );
        if (attendance.length > 0) {
          const checkIn = attendance.find((a: any) => a.type === "check-in");
          const checkOut = attendance.find((a: any) => a.type === "check-out");
          if (checkIn && checkOut) {
            const inDate = new Date(checkIn.timestamp);
            const outDate = new Date(checkOut.timestamp);
            effective = Math.max(0, (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60));
          }
        }

        // Usa se esiste il dato modificato localmente
        const localEffective =
          savedHoursLocal && savedHoursLocal[ev.id] != null
            ? Number(savedHoursLocal[ev.id])
            : Number(effective.toFixed(2));

        return {
          id: ev.id,
          eventName: ev.title,
          date: new Date(ev.startDate).toLocaleDateString("it-IT"),
          grossHours: Number(gross.toFixed(2)),
          actualHours: localEffective
        };
      });

    setRows(result);
  }, [operator, editHours]);

  // Gestione edit campo ore effettive
  const handleEdit = (id: number, value: string) => {
    const num = Number(value);
    if (isNaN(num) || num < 0) return;
    setEditHours((prev) => ({
      ...prev,
      [id]: num
    }));
  };

  // Funzione di salvataggio: locale + Supabase
  const handleSaveRow = async (row: AssignmentRow) => {
    setSavingRows((prev) => ({ ...prev, [row.id]: true }));

    // 1. Salva localmente
    const prev = getLocalEffectiveHours(operator.id?.toString() || operator.email);
    const updated = {
      ...prev,
      [row.id]: editHours[row.id] ?? row.actualHours
    };
    setLocalEffectiveHours(operator.id?.toString() || operator.email, updated);

    // 2. Aggiorna/inserisce Supabase tabella event_operators
    try {
      const { error } = await supabase
        .from("event_operators")
        .upsert([
          {
            operator_id: operator.email || operator.id?.toString(),
            event_id: row.id,
            net_hours: editHours[row.id] ?? row.actualHours
          }
        ], { onConflict: "operator_id,event_id" });
      if (error) {
        throw error;
      }
      toast.success("Ore effettive salvate con successo!");
    } catch (err) {
      toast.error("Errore nel salvataggio su Supabase");
      // fallback: già salvato su localStorage comunque
    } finally {
      setEditHours((prevEdit) => ({
        ...prevEdit,
        [row.id]: null
      }));
      setSavingRows((prev) => ({ ...prev, [row.id]: false }));
    }
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
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>Nessun incarico trovato.</TableCell>
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
                      value={
                        editHours[row.id] !== undefined && editHours[row.id] !== null
                          ? editHours[row.id]
                          : row.actualHours
                      }
                      onChange={e => handleEdit(row.id, e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <button
                      className="bg-blue-500 text-white rounded px-3 py-1 text-sm disabled:opacity-50"
                      onClick={() => handleSaveRow(row)}
                      disabled={savingRows[row.id] || (editHours[row.id] == null && row.actualHours == null)}
                    >
                      {savingRows[row.id] ? "Salvataggio..." : "Salva"}
                    </button>
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
