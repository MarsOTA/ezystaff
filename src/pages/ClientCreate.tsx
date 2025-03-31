
import React from "react";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save } from "lucide-react";
import ClientForm from "@/components/client/ClientForm";
import { useClientForm } from "@/hooks/useClientForm";

const ClientCreate = () => {
  const {
    formData,
    isEdit,
    loading,
    handleChange,
    handleSave,
    handleCancel
  } = useClientForm();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Torna alla lista
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {isEdit ? "Aggiorna cliente" : "Crea cliente"}
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? "Modifica Cliente" : "Nuovo Cliente"}</CardTitle>
            <CardDescription>
              {isEdit 
                ? "Modifica i dati del cliente esistente" 
                : "Inserisci i dati per creare un nuovo cliente"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientForm
              formData={formData}
              isEdit={isEdit}
              loading={loading}
              onChange={handleChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ClientCreate;
