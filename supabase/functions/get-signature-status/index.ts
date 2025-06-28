
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
    const url = new URL(req.url);
    const operatorId = url.searchParams.get('operatorId');
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    
    const apiKey = authHeader.replace('Bearer ', '');
    console.log('🔵 Checking signature status for operator:', operatorId);
    
    // For now, return a mock status
    // In a real implementation, you would check the actual signature request status
    const mockStatus = {
      status: 'pending' as const,
      lastUpdated: new Date().toISOString()
    };

    console.log('🟢 Signature status retrieved:', mockStatus);

    return new Response(
      JSON.stringify(mockStatus),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('🔴 Error checking signature status:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to check signature status', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
