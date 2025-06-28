
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
      const response = await fetch('/api/generate-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('🔵 Generate contract response status:', response.status);
      console.log('🔵 Generate contract response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔴 Generate contract error response:', errorText);
        throw new Error(`Errore generazione contratto (${response.status}): ${errorText}`);
      }

      const blob = await response.blob();
      console.log('🟢 Contract PDF generated successfully, size:', blob.size);
      return blob;
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
      const response = await fetch('/api/send-yousign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${YOUSIGN_API_KEY}`,
        },
        body: JSON.stringify(data),
      });

      console.log('🔵 Send to Yousign response status:', response.status);
      console.log('🔵 Send to Yousign response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔴 Send to Yousign error response:', errorText);
        throw new Error(`Errore invio Yousign (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log('🟢 Sent to Yousign successfully:', result);
      return result;
    } catch (error) {
      console.error('🔴 Error in sendToYousign:', error);
      throw error;
    }
  }

  static async getSignatureStatus(operatorId: number): Promise<SignatureStatusResponse> {
    console.log('🔵 Getting signature status for operator:', operatorId);
    
    try {
      const response = await fetch(`/api/get-signature-status?operatorId=${operatorId}`, {
        headers: {
          'Authorization': `Bearer ${YOUSIGN_API_KEY}`,
        }
      });

      console.log('🔵 Get signature status response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔴 Get signature status error:', errorText);
        throw new Error(`Errore verifica stato firma (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log('🟢 Signature status retrieved:', result);
      return result;
    } catch (error) {
      console.error('🔴 Error in getSignatureStatus:', error);
      throw error;
    }
  }

  static async getSignedPdf(operatorId: number, signedPdfUrl: string): Promise<Blob> {
    console.log('🔵 Getting signed PDF for operator:', operatorId);
    
    try {
      const response = await fetch('/api/get-signed-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${YOUSIGN_API_KEY}`,
        },
        body: JSON.stringify({
          operatorId,
          signedPdfUrl
        }),
      });

      console.log('🔵 Get signed PDF response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔴 Get signed PDF error:', errorText);
        throw new Error(`Errore download PDF firmato (${response.status}): ${errorText}`);
      }

      const blob = await response.blob();
      console.log('🟢 Signed PDF downloaded successfully, size:', blob.size);
      return blob;
    } catch (error) {
      console.error('🔴 Error in getSignedPdf:', error);
      throw error;
    }
  }
}
