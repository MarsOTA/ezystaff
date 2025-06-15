
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ExtendedOperator } from "@/types/operator";

interface DocumentsCardProps {
  operator: ExtendedOperator;
  onFileUpload: (field: keyof ExtendedOperator, fileNameField: keyof ExtendedOperator, file: File | null) => void;
}

const DocumentsCard: React.FC<DocumentsCardProps> = ({ operator, onFileUpload }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="idCardFrontImage">Documento d'Identità</Label>
        <div className="flex items-center gap-2">
          <Input
            id="idCardFrontImage"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange("idCardFrontImage", "idCardFrontFileName")}
          />
          {operator.idCardFrontFileName && (
            <Button 
              size="icon" 
              variant="outline"
              onClick={() => removeFile("idCardFrontImage", "idCardFrontFileName")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {operator.idCardFrontFileName && (
          <p className="text-sm text-muted-foreground">
            File: {operator.idCardFrontFileName}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="resumeFile">Curriculum Vitae</Label>
        <div className="flex items-center gap-2">
          <Input
            id="resumeFile"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange("resumeFile", "resumeFileName")}
          />
          {operator.resumeFileName && (
            <Button 
              size="icon" 
              variant="outline"
              onClick={() => removeFile("resumeFile", "resumeFileName")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {operator.resumeFileName && (
          <p className="text-sm text-muted-foreground">
            File: {operator.resumeFileName}
          </p>
        )}
      </div>
    </div>
  );
};

export default DocumentsCard;
