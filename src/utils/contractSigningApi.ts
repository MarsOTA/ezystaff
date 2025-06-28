
import { supabase } from "@/integrations/supabase/client";

interface GenerateContractRequest {
  operatorId: number;
  operatorName: string;
  operatorEmail: string;
  contractData: any;
  includeSignatureField: boolean;
  signaturePlaceholder: string;
}

interface SendYousignRequest {
  operatorId: number;
  operatorName: string;
  operatorEmail: string;
  contractPdfUrl: string;
  signerName: string;
  signerEmail: string;
}

interface SignatureStatusResponse {
  status: 'pending' | 'signed' | 'declined' | 'not_sent';
  signedPdfUrl?: string;
  lastUpdated?: string;
}

const YOUSIGN_API_KEY = '5FHKNCViD3U0KiqJRWiSBCiCXrtBl5Gr';

export class ContractSigningAPI {
  static async generateContract(data: GenerateContractRequest): Promise<Blob> {
    console.log('🔵 Generating contract with data:', data);
    
    try {
      const { data: response, error } = await supabase.functions.invoke('generate-contract', {
        body: data,
      });

      if (error) {
        console.error('🔴 Generate contract error:', error);
        throw new Error(`Errore generazione contratto: ${error.message}`);
      }

      console.log('🟢 Contract PDF generated successfully');
      return new Blob([response]);
    } catch (error) {
      console.error('🔴 Error in generateContract:', error);
      throw error;
    }
  }

  static async sendToYousign(data: SendYousignRequest): Promise<any> {
    console.log('🔵 Sending to Yousign with data:', {
      ...data,
      contractPdfUrl: data.contractPdfUrl ? 'PDF URL present' : 'No PDF URL'
    });
    
    try {
      const { data: response, error } = await supabase.functions.invoke('send-yousign', {
        body: data,
        headers: {
          'Authorization': `Bearer ${YOUSIGN_API_KEY}`,
        }
      });

      if (error) {
        console.error('🔴 Send to Yousign error:', error);
        throw new Error(`Errore invio Yousign: ${error.message}`);
      }

      console.log('🟢 Sent to Yousign successfully:', response);
      return response;
    } catch (error) {
      console.error('🔴 Error in sendToYousign:', error);
      throw error;
    }
  }

  static async getSignatureStatus(operatorId: number): Promise<SignatureStatusResponse> {
    console.log('🔵 Getting signature status for operator:', operatorId);
    
    try {
      const { data: response, error } = await supabase.functions.invoke('get-signature-status', {
        body: { operatorId },
        headers: {
          'Authorization': `Bearer ${YOUSIGN_API_KEY}`,
        }
      });

      if (error) {
        console.error('🔴 Get signature status error:', error);
        throw new Error(`Errore verifica stato firma: ${error.message}`);
      }

      console.log('🟢 Signature status retrieved:', response);
      return response;
    } catch (error) {
      console.error('🔴 Error in getSignatureStatus:', error);
      throw error;
    }
  }

  static async getSignedPdf(operatorId: number, signedPdfUrl: string): Promise<Blob> {
    console.log('🔵 Getting signed PDF for operator:', operatorId);
    
    try {
      const { data: response, error } = await supabase.functions.invoke('get-signed-pdf', {
        body: {
          operatorId,
          signedPdfUrl
        },
        headers: {
          'Authorization': `Bearer ${YOUSIGN_API_KEY}`,
        }
      });

      if (error) {
        console.error('🔴 Get signed PDF error:', error);
        throw new Error(`Errore download PDF firmato: ${error.message}`);
      }

      console.log('🟢 Signed PDF downloaded successfully');
      return new Blob([response]);
    } catch (error) {
      console.error('🔴 Error in getSignedPdf:', error);
      throw error;
    }
  }
}
