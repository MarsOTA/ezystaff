
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
    const { operatorId, signedPdfUrl } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    
    const apiKey = authHeader.replace('Bearer ', '');
    console.log('🔵 Getting signed PDF for operator:', operatorId);
    
    // For now, create a mock signed PDF
    // In a real implementation, you would download the actual signed PDF from Yousign
    const mockSignedPdfContent = `CONTRATTO FIRMATO - Operatore ID: ${operatorId}`;
    const blob = new Blob([mockSignedPdfContent], { type: 'application/pdf' });
    const arrayBuffer = await blob.arrayBuffer();

    console.log('🟢 Signed PDF retrieved successfully');

    return new Response(arrayBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
      },
    });

  } catch (error) {
    console.error('🔴 Error getting signed PDF:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get signed PDF', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
