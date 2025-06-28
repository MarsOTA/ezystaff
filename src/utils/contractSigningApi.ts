
interface GenerateContractRequest {
  operatorId: number;
  operatorName: string;
  operatorEmail: string;
  contractData: any;
  includeSignatureField: boolean;
  signaturePlaceholder: string;
}

interface SendDocuSignRequest {
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

  static async sendToDocuSign(data: SendDocuSignRequest): Promise<any> {
    const response = await fetch('/api/send-docusign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to send to DocuSign: ${response.statusText}`);
    }

    return response.json();
  }

  static async getSignatureStatus(operatorId: number): Promise<SignatureStatusResponse> {
    const response = await fetch(`/api/get-signature-status?operatorId=${operatorId}`);

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
