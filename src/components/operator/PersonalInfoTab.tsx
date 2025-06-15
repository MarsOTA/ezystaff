
import React, { useState } from "react";
import { ExtendedOperator } from "@/types/operator";
import BasicInfoCard from "./BasicInfoCard";
import PersonalDataCard from "./PersonalDataCard";
import ServicesCard from "./ServicesCard";
import AvailabilityCard from "./AvailabilityCard";
import LanguagesCard from "./LanguagesCard";
import SizesCard from "./SizesCard";
import DocumentsCard from "./DocumentsCard";
import NotesCard from "./NotesCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PersonalInfoTabProps {
  operator: ExtendedOperator;
  imagePreviewUrls: Record<string, string>;
  onFieldChange: (field: keyof ExtendedOperator, value: any) => void;
  onServiceToggle: (service: string) => void;
  onAvailabilityToggle: (availability: string) => void;
  onLanguageToggle: (language: string, type: 'fluent' | 'basic') => void;
  onSizeToggle: (size: string) => void;
  onFileUpload: (field: keyof ExtendedOperator, fileNameField: keyof ExtendedOperator, file: File | null) => void;
  onDelete?: (id: number) => void;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  operator,
  imagePreviewUrls,
  onFieldChange,
  onServiceToggle,
  onAvailabilityToggle,
  onLanguageToggle,
  onSizeToggle,
  onFileUpload,
  onDelete
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Gestione foto profilo solo in questa tab
  const handleProfileImageRemove = () => {
    onFileUpload("profileImage", "profileImageName", null);
  };
  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileUpload("profileImage", "profileImageName", file);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(operator.id);
    }
  };

  return (
    <div className="space-y-6">
      <BasicInfoCard 
        operator={operator}
        onFieldChange={onFieldChange}
      />

      {/* Foto Profilo */}
      <Card>
        <CardHeader>
          <CardTitle>Foto Profilo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {imagePreviewUrls.profileImage && (
              <div className="relative">
                <img 
                  src={imagePreviewUrls.profileImage} 
                  alt="Profile" 
                  className="w-24 h-24 object-cover rounded-full"
                />
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 w-6 h-6"
                  onClick={handleProfileImageRemove}
                >
                  &times;
                </Button>
              </div>
            )}
            <div className="flex-1">
              <label htmlFor="profileImage" className="block text-sm font-medium">Carica foto profilo</label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="mt-1"
              />
              {operator.profileImageName && (
                <p className="text-sm text-muted-foreground mt-1">
                  File attuale: {operator.profileImageName}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dati Personali */}
      <Card>
        <CardHeader>
          <CardTitle>Dati Personali</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PersonalDataCard operator={operator} onFieldChange={onFieldChange} />
        </CardContent>
      </Card>

      {/* Servizi Offerti */}
      <Card>
        <CardHeader>
          <CardTitle>Servizi Offerti</CardTitle>
        </CardHeader>
        <CardContent>
          <ServicesCard operator={operator} onServiceToggle={onServiceToggle}/>
        </CardContent>
      </Card>

      {/* Disponibilità */}
      <Card>
        <CardHeader>
          <CardTitle>Disponibilità</CardTitle>
        </CardHeader>
        <CardContent>
          <AvailabilityCard operator={operator} onAvailabilityToggle={onAvailabilityToggle}/>
        </CardContent>
      </Card>

      {/* Lingue */}
      <Card>
        <CardHeader>
          <CardTitle>Lingue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LanguagesCard operator={operator} onLanguageToggle={onLanguageToggle}/>
        </CardContent>
      </Card>

      {/* Taglie abbigliamento */}
      <Card>
        <CardHeader>
          <CardTitle>Taglie Abbigliamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SizesCard operator={operator} onSizeToggle={onSizeToggle}/>
        </CardContent>
      </Card>

      {/* Documenti */}
      <Card>
        <CardHeader>
          <CardTitle>Documenti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DocumentsCard operator={operator} onFileUpload={onFileUpload}/>
        </CardContent>
      </Card>

      {/* Note */}
      <Card>
        <CardHeader>
          <CardTitle>Note</CardTitle>
        </CardHeader>
        <CardContent>
          <NotesCard operator={operator} onFieldChange={onFieldChange}/>
        </CardContent>
      </Card>

      {/* Delete operator */}
      <div className="flex justify-start">
        {onDelete && (
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Cancella operatore
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sei sicuro di voler cancellare l'operatore?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tutti i dati e gli eventi a lui legati saranno persi! Questa azione non può essere annullata.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Cancella operatore
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoTab;
