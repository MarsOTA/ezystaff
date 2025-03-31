
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { safeLocalStorage } from "@/utils/fileUtils";
import { Operator } from "@/types/operator";
import { Event } from "@/pages/Events";

export const EVENTS_STORAGE_KEY = "app_events_data";
export const OPERATORS_STORAGE_KEY = "app_operators_data";

export const useOperators = () => {
  const [operators, setOperators] = useState<Operator[]>([
    {
      id: 1,
      name: "Mario Rossi",
      email: "mario.rossi@example.com",
      phone: "+39 123 456 7890",
      status: "active",
      assignedEvents: [],
    },
    {
      id: 2,
      name: "Luigi Verdi",
      email: "luigi.verdi@example.com",
      phone: "+39 098 765 4321",
      status: "inactive",
      assignedEvents: [],
    },
  ]);

  const [events, setEvents] = useState<Event[]>([]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [assigningOperator, setAssigningOperator] = useState<Operator | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active" as "active" | "inactive",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
    if (storedOperators) {
      try {
        setOperators(JSON.parse(storedOperators));
      } catch (error) {
        console.error("Errore nel caricamento degli operatori:", error);
      }
    } else {
      safeLocalStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(operators));
    }
    
    const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate)
        }));
        setEvents(eventsWithDates);
      } catch (error) {
        console.error("Errore nel caricamento degli eventi:", error);
        setEvents([]);
      }
    } else {
      setEvents([]);
    }
  }, []);
  
  useEffect(() => {
    safeLocalStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(operators));
  }, [operators]);

  const handleStatusToggle = (id: number) => {
    setOperators((prev) =>
      prev.map((op) =>
        op.id === id
          ? { ...op, status: op.status === "active" ? "inactive" : "active" }
          : op
      )
    );
    toast.success("Stato operatore aggiornato con successo");
  };

  const handleDelete = (id: number) => {
    setOperators((prev) => prev.filter((op) => op.id !== id));
    toast.success("Operatore eliminato con successo");
  };

  const openEditDialog = (operator: Operator) => {
    setEditingOperator(operator);
    setFormData({
      name: operator.name,
      email: operator.email,
      phone: operator.phone,
      status: operator.status,
    });
    setIsDialogOpen(true);
  };

  const handleNewOperator = () => {
    setEditingOperator(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "active",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingOperator) {
      setOperators((prev) =>
        prev.map((op) =>
          op.id === editingOperator.id
            ? { ...op, ...formData }
            : op
        )
      );
      toast.success("Operatore aggiornato con successo");
    } else {
      const newId = Math.max(0, ...operators.map((op) => op.id)) + 1;
      setOperators((prev) => [
        ...prev,
        { id: newId, ...formData, assignedEvents: [] },
      ]);
      toast.success("Nuovo operatore aggiunto con successo");
    }
    
    setIsDialogOpen(false);
  };

  const openAssignDialog = (operator: Operator) => {
    setAssigningOperator(operator);
    setSelectedEventId("");
    setIsAssignDialogOpen(true);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assigningOperator || !selectedEventId) {
      toast.error("Seleziona un evento");
      return;
    }
    
    const eventId = parseInt(selectedEventId);
    
    setOperators((prev) =>
      prev.map((op) => {
        if (op.id === assigningOperator.id) {
          const currentAssignedEvents = op.assignedEvents || [];
          if (currentAssignedEvents.includes(eventId)) {
            toast.info("Operatore già assegnato a questo evento");
            return op;
          }
          
          return {
            ...op,
            assignedEvents: [...currentAssignedEvents, eventId]
          };
        }
        return op;
      })
    );
    
    const eventName = events.find(e => e.id === eventId)?.title || "Evento selezionato";
    
    toast.success(`${assigningOperator.name} assegnato a "${eventName}"`);
    setIsAssignDialogOpen(false);
  };

  const handleEdit = (operator: Operator) => {
    navigate(`/operator-profile/${operator.id}`);
  };

  return {
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
  };
};
