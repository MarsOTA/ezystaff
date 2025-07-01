
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
    const { operatorId, operatorName, operatorEmail, contractData, includeSignatureField, signaturePlaceholder } = await req.json();
    
    console.log('🔵 Generate contract request for operator:', operatorName);
    
    // For now, create a simple PDF placeholder
    // In a real implementation, you would use a PDF library to generate the contract
    const pdfContent = `
      CONTRATTO DI LAVORO
      
      Operatore: ${operatorName}
      Email: ${operatorEmail}
      
      ${includeSignatureField ? `\n\nFirma: ${signaturePlaceholder}` : ''}
      
      Dati contrattuali:
      ${JSON.stringify(contractData, null, 2)}
    `;
    
    // Convert text to blob (in real implementation, generate actual PDF)
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const arrayBuffer = await blob.arrayBuffer();
    
    console.log('🟢 Contract generated successfully');
    
    return new Response(arrayBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contratto_${operatorName.replace(/\s+/g, '_')}.pdf"`,
      },
    });

  } catch (error) {
    console.error('🔴 Error generating contract:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate contract', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
