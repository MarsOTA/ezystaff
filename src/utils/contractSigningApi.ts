
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
    const response = await fetch('/api/generate-contract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate contract: ${response.statusText}`);
    }

    return response.blob();
  }

  static async sendToYousign(data: SendYousignRequest): Promise<any> {
    const response = await fetch('/api/send-yousign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOUSIGN_API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to send to Yousign: ${response.statusText}`);
    }

    return response.json();
  }

  static async getSignatureStatus(operatorId: number): Promise<SignatureStatusResponse> {
    const response = await fetch(`/api/get-signature-status?operatorId=${operatorId}`, {
      headers: {
        'Authorization': `Bearer ${YOUSIGN_API_KEY}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get signature status: ${response.statusText}`);
    }

    return response.json();
  }

  static async getSignedPdf(operatorId: number, signedPdfUrl: string): Promise<Blob> {
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

    if (!response.ok) {
      throw new Error(`Failed to get signed PDF: ${response.statusText}`);
    }

    return response.blob();
  }
}
