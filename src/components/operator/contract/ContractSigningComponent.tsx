
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Send, Download, Clock, CheckCircle, XCircle } from "lucide-react";
import { ExtendedOperator } from "@/types/operator";
import { useToast } from "@/hooks/use-toast";

interface ContractSigningComponentProps {
  operator: ExtendedOperator;
}

interface SignatureStatus {
  status: 'pending' | 'signed' | 'declined' | 'not_sent';
  signedPdfUrl?: string;
  lastUpdated?: string;
}

const ContractSigningComponent: React.FC<ContractSigningComponentProps> = ({ operator }) => {
  const { toast } = useToast();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingToDocuSign, setIsSendingToDocuSign] = useState(false);
  const [signatureStatus, setSignatureStatus] = useState<SignatureStatus>({ 
    status: 'not_sent' 
  });
  const [contractPdfUrl, setContractPdfUrl] = useState<string | null>(null);

  // Poll signature status if contract has been sent
  useEffect(() => {
    if (signatureStatus.status === 'pending') {
      const interval = setInterval(() => {
        checkSignatureStatus();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [signatureStatus.status]);

  const generateContractPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const response = await fetch('/api/generate-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operatorId: operator.id,
          operatorName: operator.name,
          operatorEmail: operator.email,
          contractData: operator.contractData,
          // Include signature placeholder
          includeSignatureField: true,
          signaturePlaceholder: '{{FirmaDipendente}}'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate contract PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setContractPdfUrl(url);
      
      toast({
        title: "PDF Generato",
        description: "Il contratto PDF è stato generato con successo.",
      });
    } catch (error) {
      console.error('Error generating contract PDF:', error);
      toast({
        title: "Errore",
        description: "Errore nella generazione del PDF del contratto.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const sendToDocuSign = async () => {
    if (!contractPdfUrl) {
      toast({
        title: "Errore",
        description: "Genera prima il PDF del contratto.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingToDocuSign(true);
    try {
      const response = await fetch('/api/send-docusign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operatorId: operator.id,
          operatorName: operator.name,
          operatorEmail: operator.email,
          contractPdfUrl: contractPdfUrl,
          signerName: operator.name,
          signerEmail: operator.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send to DocuSign');
      }

      const result = await response.json();
      
      setSignatureStatus({
        status: 'pending',
        lastUpdated: new Date().toISOString()
      });

      toast({
        title: "Inviato a DocuSign",
        description: `Il contratto è stato inviato a ${operator.email} per la firma.`,
      });
    } catch (error) {
      console.error('Error sending to DocuSign:', error);
      toast({
        title: "Errore",
        description: "Errore nell'invio del contratto per la firma.",
        variant: "destructive",
      });
    } finally {
      setIsSendingToDocuSign(false);
    }
  };

  const checkSignatureStatus = async () => {
    try {
      const response = await fetch(`/api/get-signature-status?operatorId=${operator.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to check signature status');
      }

      const status = await response.json();
      setSignatureStatus(status);
    } catch (error) {
      console.error('Error checking signature status:', error);
    }
  };

  const downloadSignedPdf = async () => {
    if (!signatureStatus.signedPdfUrl) return;

    try {
      const response = await fetch('/api/get-signed-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operatorId: operator.id,
          signedPdfUrl: signatureStatus.signedPdfUrl
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to download signed PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Contratto_Firmato_${operator.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Completato",
        description: "Il contratto firmato è stato scaricato con successo.",
      });
    } catch (error) {
      console.error('Error downloading signed PDF:', error);
      toast({
        title: "Errore",
        description: "Errore nel download del contratto firmato.",
        variant: "destructive",
      });
    }
  };

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
              onClick={sendToDocuSign}
              disabled={isSendingToDocuSign || !contractPdfUrl || signatureStatus.status === 'pending'}
              className="flex-1"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSendingToDocuSign ? "Inviando..." : "Invia a Firma"}
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
              2. Invia il contratto per la firma tramite DocuSign<br/>
              3. Il dipendente riceverà una email con il link per firmare
            </AlertDescription>
          </Alert>
        )}

        {signatureStatus.status === 'pending' && (
          <Alert>
            <AlertDescription>
              Il contratto è stato inviato a {operator.email}. 
              Il dipendente riceverà una notifica email per completare la firma.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractSigningComponent;
