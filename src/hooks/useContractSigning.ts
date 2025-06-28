
import { useState, useEffect } from 'react';
import { ExtendedOperator } from '@/types/operator';
import { ContractSigningAPI } from '@/utils/contractSigningApi';
import { useToast } from '@/hooks/use-toast';

interface SignatureStatus {
  status: 'pending' | 'signed' | 'declined' | 'not_sent';
  signedPdfUrl?: string;
  lastUpdated?: string;
}

export const useContractSigning = (operator: ExtendedOperator) => {
  const { toast } = useToast();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingToYousign, setIsSendingToYousign] = useState(false);
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
    console.log('🔵 Starting contract PDF generation for operator:', operator.name);
    setIsGeneratingPdf(true);
    
    try {
      const blob = await ContractSigningAPI.generateContract({
        operatorId: operator.id,
        operatorName: operator.name,
        operatorEmail: operator.email,
        contractData: operator.contractData,
        includeSignatureField: true,
        signaturePlaceholder: '{{FirmaDipendente}}'
      });

      const url = URL.createObjectURL(blob);
      setContractPdfUrl(url);
      console.log('🟢 Contract PDF generated and URL created');
      
      toast({
        title: "PDF Generato",
        description: "Il contratto PDF è stato generato con successo.",
      });
    } catch (error: any) {
      console.error('🔴 Error generating contract PDF:', error);
      toast({
        title: "Errore Generazione PDF",
        description: error.message || "Errore nella generazione del PDF del contratto.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const sendToYousign = async () => {
    console.log('🔵 Starting Yousign sending process');
    console.log('🔵 Contract PDF URL exists:', !!contractPdfUrl);
    console.log('🔵 Operator data:', { id: operator.id, name: operator.name, email: operator.email });
    
    if (!contractPdfUrl) {
      console.log('🔴 No contract PDF URL available');
      toast({
        title: "Errore",
        description: "Genera prima il PDF del contratto.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingToYousign(true);
    
    try {
      await ContractSigningAPI.sendToYousign({
        operatorId: operator.id,
        operatorName: operator.name,
        operatorEmail: operator.email,
        contractPdfUrl: contractPdfUrl,
        signerName: operator.name,
        signerEmail: operator.email
      });
      
      setSignatureStatus({
        status: 'pending',
        lastUpdated: new Date().toISOString()
      });

      console.log('🟢 Contract sent to Yousign successfully');
      toast({
        title: "Inviato a Yousign",
        description: `Il contratto è stato inviato a ${operator.email} per la firma tramite Yousign.`,
      });
    } catch (error: any) {
      console.error('🔴 Error sending to Yousign:', error);
      
      // Messaggio di errore più dettagliato
      let errorMessage = "Errore nell'invio del contratto per la firma tramite Yousign.";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Errore Invio Yousign",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSendingToYousign(false);
    }
  };

  const checkSignatureStatus = async () => {
    console.log('🔵 Checking signature status for operator:', operator.id);
    
    try {
      const status = await ContractSigningAPI.getSignatureStatus(operator.id);
      setSignatureStatus(status);
      console.log('🟢 Signature status updated:', status);
    } catch (error: any) {
      console.error('🔴 Error checking signature status:', error);
    }
  };

  const downloadSignedPdf = async () => {
    if (!signatureStatus.signedPdfUrl) {
      console.log('🔴 No signed PDF URL available');
      return;
    }

    console.log('🔵 Starting signed PDF download');
    
    try {
      const blob = await ContractSigningAPI.getSignedPdf(operator.id, signatureStatus.signedPdfUrl);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Contratto_Firmato_${operator.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('🟢 Signed PDF downloaded successfully');
      toast({
        title: "Download Completato",
        description: "Il contratto firmato è stato scaricato con successo.",
      });
    } catch (error: any) {
      console.error('🔴 Error downloading signed PDF:', error);
      toast({
        title: "Errore Download",
        description: error.message || "Errore nel download del contratto firmato.",
        variant: "destructive",
      });
    }
  };

  return {
    isGeneratingPdf,
    isSendingToYousign,
    signatureStatus,
    contractPdfUrl,
    generateContractPdf,
    sendToYousign,
    checkSignatureStatus,
    downloadSignedPdf
  };
};
