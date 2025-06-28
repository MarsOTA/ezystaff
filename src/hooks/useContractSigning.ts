
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
      await ContractSigningAPI.sendToDocuSign({
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
      const status = await ContractSigningAPI.getSignatureStatus(operator.id);
      setSignatureStatus(status);
    } catch (error) {
      console.error('Error checking signature status:', error);
    }
  };

  const downloadSignedPdf = async () => {
    if (!signatureStatus.signedPdfUrl) return;

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

  return {
    isGeneratingPdf,
    isSendingToDocuSign,
    signatureStatus,
    contractPdfUrl,
    generateContractPdf,
    sendToDocuSign,
    checkSignatureStatus,
    downloadSignedPdf
  };
};
