import React from "react";
import { ExtendedOperator } from "@/types/operator";
import BasicInfoCard from "./BasicInfoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface PersonalInfoTabProps {
  operator: ExtendedOperator;
  imagePreviewUrls: Record<string, string>;
  onFieldChange: (field: keyof ExtendedOperator, value: any) => void;
  onServiceToggle: (service: string) => void;
  onAvailabilityToggle: (availability: string) => void;
  onLanguageToggle: (language: string, type: 'fluent' | 'basic') => void;
  onSizeToggle: (size: string) => void;
  onFileUpload: (field: keyof ExtendedOperator, fileNameField: keyof ExtendedOperator, file: File | null) => void;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  operator,
  imagePreviewUrls,
  onFieldChange,
  onServiceToggle,
  onAvailabilityToggle,
  onLanguageToggle,
  onSizeToggle,
  onFileUpload
}) => {
  const services = [
    "Security", "Steward", "Hostess", "Controllo Accessi", 
    "Vigilanza", "Antitaccheggio", "Bodyguard", "Altro"
  ];

  const availabilities = [
    "Mattina", "Pomeriggio", "Sera", "Notte", 
    "Weekend", "Festivi", "Disponibilità completa"
  ];

  const languages = [
    "Inglese", "Francese", "Spagnolo", "Tedesco", 
    "Russo", "Cinese", "Arabo", "Altro"
  ];

  const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  const handleFileChange = (field: keyof ExtendedOperator, fileNameField: keyof ExtendedOperator) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    onFileUpload(field, fileNameField, file);
  };

  const removeFile = (field: keyof ExtendedOperator, fileNameField: keyof ExtendedOperator) => {
    onFileUpload(field, fileNameField, null);
  };

  return (
    <div className="space-y-6">
      <BasicInfoCard 
        operator={operator}
        onFieldChange={onFieldChange}
      />

      {/* Photo Card */}
      <Card>
        <CardHeader>
          <CardTitle>Foto Profilo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {imagePreviewUrls.profilePhoto && (
              <div className="relative">
                <img 
                  src={imagePreviewUrls.profilePhoto} 
                  alt="Profile" 
                  className="w-24 h-24 object-cover rounded-full"
                />
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 w-6 h-6"
                  onClick={() => removeFile("profilePhoto", "profilePhotoName")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <div className="flex-1">
              <Label htmlFor="profilePhoto">Carica foto profilo</Label>
              <Input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={handleFileChange("profilePhoto", "profilePhotoName")}
                className="mt-1"
              />
              {operator.profilePhotoName && (
                <p className="text-sm text-muted-foreground mt-1">
                  File attuale: {operator.profilePhotoName}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle>Dati Personali</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Data di Nascita</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={operator.dateOfBirth || ""}
                onChange={(e) => onFieldChange("dateOfBirth", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeOfBirth">Luogo di Nascita</Label>
              <Input
                id="placeOfBirth"
                value={operator.placeOfBirth || ""}
                onChange={(e) => onFieldChange("placeOfBirth", e.target.value)}
                placeholder="Inserisci il luogo di nascita"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Genere</Label>
              <select
                id="gender"
                value={operator.gender || ""}
                onChange={(e) => onFieldChange("gender", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Seleziona genere</option>
                <option value="maschio">Maschio</option>
                <option value="femmina">Femmina</option>
                <option value="altro">Altro</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscalCode">Codice Fiscale</Label>
              <Input
                id="fiscalCode"
                value={operator.fiscalCode || ""}
                onChange={(e) => onFieldChange("fiscalCode", e.target.value)}
                placeholder="Inserisci il codice fiscale"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nazionalità</Label>
              <Input
                id="nationality"
                value={operator.nationality || ""}
                onChange={(e) => onFieldChange("nationality", e.target.value)}
                placeholder="Inserisci la nazionalità"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">Professione</Label>
              <Input
                id="profession"
                value={operator.profession || ""}
                onChange={(e) => onFieldChange("profession", e.target.value)}
                placeholder="Inserisci la professione"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Indirizzo Completo</Label>
            <Textarea
              id="address"
              value={operator.address || ""}
              onChange={(e) => onFieldChange("address", e.target.value)}
              placeholder="Inserisci l'indirizzo completo"
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle>Servizi Offerti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {services.map((service) => (
              <Badge
                key={service}
                variant={operator.services?.includes(service) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onServiceToggle(service)}
              >
                {service}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Disponibilità</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availabilities.map((availability) => (
              <Badge
                key={availability}
                variant={operator.availability?.includes(availability) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onAvailabilityToggle(availability)}
              >
                {availability}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle>Lingue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Lingue Fluenti</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {languages.map((language) => (
                <Badge
                  key={`fluent-${language}`}
                  variant={operator.fluentLanguages?.includes(language) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onLanguageToggle(language, 'fluent')}
                >
                  {language}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Lingue Base</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {languages.map((language) => (
                <Badge
                  key={`basic-${language}`}
                  variant={operator.basicLanguages?.includes(language) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onLanguageToggle(language, 'basic')}
                >
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clothing Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Taglie Abbigliamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Taglie</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {clothingSizes.map((size) => (
                <Badge
                  key={size}
                  variant={operator.clothingSizes?.includes(size) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onSizeToggle(size)}
                >
                  {size}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documenti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="idDocument">Documento d'Identità</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="idDocument"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange("idDocument", "idDocumentName")}
                />
                {operator.idDocumentName && (
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => removeFile("idDocument", "idDocumentName")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {operator.idDocumentName && (
                <p className="text-sm text-muted-foreground">
                  File: {operator.idDocumentName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">Curriculum Vitae</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange("resume", "resumeName")}
                />
                {operator.resumeName && (
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => removeFile("resume", "resumeName")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {operator.resumeName && (
                <p className="text-sm text-muted-foreground">
                  File: {operator.resumeName}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Note</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={operator.notes || ""}
            onChange={(e) => onFieldChange("notes", e.target.value)}
            placeholder="Inserisci note aggiuntive sull'operatore..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoTab;
