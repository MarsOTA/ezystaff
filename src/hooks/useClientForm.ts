
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Client } from "@/pages/Clients";
import { toast } from "sonner";
import { safeLocalStorage } from "@/utils/fileUtils";

const CLIENTS_STORAGE_KEY = "app_clients_data";

export const useClientForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("id");
  
  const [formData, setFormData] = useState<Omit<Client, "id">>({
    companyName: "",
    taxId: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    province: "",
    contactPerson: "",
    contactRole: "",
    notes: "",
  });
  
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(clientId ? true : false);
  
  useEffect(() => {
    if (clientId) {
      setIsEdit(true);
      
      try {
        const storedClients = safeLocalStorage.getItem(CLIENTS_STORAGE_KEY);
        if (!storedClients) {
          toast.error("Errore nel caricamento dei dati del cliente");
          navigate("/clients");
          return;
        }
        
        const clients = JSON.parse(storedClients);
        const client = clients.find((c: Client) => c.id.toString() === clientId);
        
        if (!client) {
          toast.error("Cliente non trovato");
          navigate("/clients");
          return;
        }
        
        const { id, ...clientData } = client;
        setFormData(clientData);
      } catch (error) {
        console.error("Errore nel caricamento del cliente:", error);
        toast.error("Errore nel caricamento dei dati del cliente");
      } finally {
        setLoading(false);
      }
    }
  }, [clientId, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = (): boolean => {
    if (!formData.companyName.trim()) {
      toast.error("La ragione sociale è obbligatoria");
      return false;
    }
    
    if (!formData.taxId.trim()) {
      toast.error("La P.IVA/C.F. è obbligatoria");
      return false;
    }
    
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Inserire una email valida");
      return false;
    }
    
    if (!formData.phone.trim()) {
      toast.error("Il numero di telefono è obbligatorio");
      return false;
    }
    
    return true;
  };
  
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      const storedClients = safeLocalStorage.getItem(CLIENTS_STORAGE_KEY);
      let clients = [];
      
      if (storedClients) {
        clients = JSON.parse(storedClients);
      }
      
      if (isEdit && clientId) {
        clients = clients.map((client: Client) => {
          if (client.id.toString() === clientId) {
            return { ...formData, id: client.id };
          }
          return client;
        });
        
        toast.success("Cliente aggiornato con successo");
      } else {
        const newId = clients.length > 0 
          ? Math.max(...clients.map((c: Client) => c.id)) + 1 
          : 1;
          
        clients.push({ ...formData, id: newId });
        toast.success("Nuovo cliente creato con successo");
      }
      
      safeLocalStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
      navigate("/clients");
    } catch (error) {
      console.error("Errore nel salvataggio del cliente:", error);
      toast.error("Errore nel salvataggio dei dati");
    }
  };
  
  const handleCancel = () => {
    navigate("/clients");
  };

  return {
    formData,
    isEdit,
    loading,
    handleChange,
    handleSave,
    handleCancel
  };
};
