
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Client } from "@/pages/Clients";
import { toast } from "sonner";

interface ClientFormProps {
  formData: Omit<Client, "id">;
  isEdit: boolean;
  loading: boolean;
  onCancel: () => void;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ClientForm: React.FC<ClientFormProps> = ({
  formData,
  isEdit,
  loading,
  onCancel,
  onSave,
  onChange,
}) => {
  if (loading) {
    return <div className="text-center">Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Ragione Sociale *</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taxId">P.IVA/C.F. *</Label>
            <Input
              id="taxId"
              name="taxId"
              value={formData.taxId}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefono *</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Indirizzo</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={onChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Città</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={onChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zipCode">CAP</Label>
            <Input
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={onChange}
              maxLength={5}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="province">Provincia</Label>
            <Input
              id="province"
              name="province"
              value={formData.province}
              onChange={onChange}
              maxLength={2}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Persona di Contatto</Label>
            <Input
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={onChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactRole">Ruolo</Label>
            <Input
              id="contactRole"
              name="contactRole"
              value={formData.contactRole}
              onChange={onChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Note</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={onChange}
            rows={4}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Annulla
        </Button>
        <Button onClick={onSave}>
          {isEdit ? "Aggiorna" : "Crea"}
        </Button>
      </div>
    </div>
  );
};

export default ClientForm;
