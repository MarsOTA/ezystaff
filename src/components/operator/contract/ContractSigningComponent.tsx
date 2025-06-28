
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Send, Download, Clock, CheckCircle, XCircle } from "lucide-react";
import { ExtendedOperator } from "@/types/operator";
import { useContractSigning } from "@/hooks/useContractSigning";

interface ContractSigningComponentProps {
  operator: ExtendedOperator;
}

const ContractSigningComponent: React.FC<ContractSigningComponentProps> = ({ operator }) => {
  const {
    isGeneratingPdf,
    isSendingToYousign,
    signatureStatus,
    contractPdfUrl,
    generateContractPdf,
    sendToYousign,
    downloadSignedPdf
  } = useContractSigning(operator);

  const getStatusBadge = () => {
    switch (signatureStatus.status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            In Attesa
          </Badge>
        );
      case 'signed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Firmato
          </Badge>
        );
      case 'declined':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Rifiutato
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Non Inviato
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Firma Contratto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Employee Info */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Informazioni Dipendente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Nome:</span>
              <p className="font-medium">{operator.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <p className="font-medium">{operator.email}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={generateContractPdf}
              disabled={isGeneratingPdf}
              variant="outline"
              className="flex-1"
            >
              <FileText className="mr-2 h-4 w-4" />
              {isGeneratingPdf ? "Generando..." : "Genera PDF"}
            </Button>
            
            <Button
              onClick={sendToYousign}
              disabled={isSendingToYousign || !contractPdfUrl || signatureStatus.status === 'pending'}
              className="flex-1"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSendingToYousign ? "Inviando..." : "Invia a Firma"}
            </Button>
          </div>

          {/* Status Display */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-sm font-medium">Stato Firma</p>
              <div className="mt-1">
                {getStatusBadge()}
              </div>
            </div>
            
            {signatureStatus.status === 'signed' && signatureStatus.signedPdfUrl && (
              <Button
                onClick={downloadSignedPdf}
                variant="outline"
                size="sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Scarica PDF Firmato
              </Button>
            )}
          </div>

          {/* Last Updated */}
          {signatureStatus.lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Ultimo aggiornamento: {new Date(signatureStatus.lastUpdated).toLocaleString('it-IT')}
            </p>
          )}
        </div>

        {/* Instructions */}
        {signatureStatus.status === 'not_sent' && (
          <Alert>
            <AlertDescription>
              1. Genera il PDF del contratto<br/>
              2. Invia il contratto per la firma tramite Yousign<br/>
              3. Il dipendente riceverà una email con il link per firmare
            </AlertDescription>
          </Alert>
        )}

        {signatureStatus.status === 'pending' && (
          <Alert>
            <AlertDescription>
              Il contratto è stato inviato a {operator.email} tramite Yousign. 
              Il dipendente riceverà una notifica email per completare la firma.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractSigningComponent;
