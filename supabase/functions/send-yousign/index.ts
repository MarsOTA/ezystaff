
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { operatorId, operatorName, operatorEmail, contractPdfUrl, signerName, signerEmail } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    
    const apiKey = authHeader.replace('Bearer ', '');
    console.log('🔵 Sending to Yousign for operator:', operatorName);
    
    // Step 1: Create signature request
    const signatureRequestResponse = await fetch('https://api.yousign.com/v3/signature_requests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Contratto ${operatorName}`,
        delivery_mode: 'email',
        timezone: 'Europe/Rome'
      })
    });

    if (!signatureRequestResponse.ok) {
      const errorText = await signatureRequestResponse.text();
      console.error('🔴 Yousign signature request error:', errorText);
      throw new Error(`Yousign API error: ${signatureRequestResponse.status} - ${errorText}`);
    }

    const signatureRequest = await signatureRequestResponse.json();
    console.log('🟢 Signature request created:', signatureRequest.id);

    // Step 2: Add document (for now, we'll simulate this)
    // In a real implementation, you would upload the actual PDF
    const documentResponse = await fetch(`https://api.yousign.com/v3/signature_requests/${signatureRequest.id}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Contratto_${operatorName.replace(/\s+/g, '_')}.pdf`,
        nature: 'signable_document',
        // In real implementation, include the actual PDF content
        content: btoa(`Contratto per ${operatorName} - ${operatorEmail}`)
      })
    });

    if (!documentResponse.ok) {
      const errorText = await documentResponse.text();
      console.error('🔴 Yousign document upload error:', errorText);
      throw new Error(`Yousign document upload error: ${documentResponse.status} - ${errorText}`);
    }

    const document = await documentResponse.json();
    console.log('🟢 Document uploaded:', document.id);

    // Step 3: Add signer
    const signerResponse = await fetch(`https://api.yousign.com/v3/signature_requests/${signatureRequest.id}/signers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        info: {
          first_name: signerName.split(' ')[0] || signerName,
          last_name: signerName.split(' ').slice(1).join(' ') || '',
          email: signerEmail,
          locale: 'it'
        }
      })
    });

    if (!signerResponse.ok) {
      const errorText = await signerResponse.text();
      console.error('🔴 Yousign signer error:', errorText);
      throw new Error(`Yousign signer error: ${signerResponse.status} - ${errorText}`);
    }

    const signer = await signerResponse.json();
    console.log('🟢 Signer added:', signer.id);

    // Step 4: Activate signature request
    const activateResponse = await fetch(`https://api.yousign.com/v3/signature_requests/${signatureRequest.id}/activate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (!activateResponse.ok) {
      const errorText = await activateResponse.text();
      console.error('🔴 Yousign activation error:', errorText);
      throw new Error(`Yousign activation error: ${activateResponse.status} - ${errorText}`);
    }

    const activatedRequest = await activateResponse.json();
    console.log('🟢 Signature request activated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        signatureRequestId: signatureRequest.id,
        message: 'Contratto inviato con successo per la firma'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('🔴 Error in send-yousign:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send to Yousign', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
