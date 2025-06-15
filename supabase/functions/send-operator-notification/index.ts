
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  operatorEmail: string;
  operatorName: string;
  eventTitle: string;
  eventDate: string;
  type: 'removal' | 'assignment';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { operatorEmail, operatorName, eventTitle, eventDate, type }: NotificationRequest = await req.json();

    const subject = type === 'removal' 
      ? `Rimozione dall'evento: ${eventTitle}`
      : `Assegnazione all'evento: ${eventTitle}`;

    const message = type === 'removal'
      ? `Ciao ${operatorName},\n\nTi informiamo che sei stato rimosso dall'evento "${eventTitle}" del ${eventDate}.\n\nPer qualsiasi chiarimento, contatta il team di gestione eventi.`
      : `Ciao ${operatorName},\n\nTi informiamo che sei stato assegnato all'evento "${eventTitle}" del ${eventDate}.\n\nPer qualsiasi chiarimento, contatta il team di gestione eventi.`;

    const emailResponse = await resend.emails.send({
      from: "Event Management <onboarding@resend.dev>",
      to: [operatorEmail],
      subject: subject,
      html: `
        <h2>${subject}</h2>
        <p>Ciao ${operatorName},</p>
        <p>${type === 'removal' 
          ? `Ti informiamo che sei stato <strong>rimosso</strong> dall'evento:` 
          : `Ti informiamo che sei stato <strong>assegnato</strong> all'evento:`}
        </p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <strong>${eventTitle}</strong><br>
          <span style="color: #666;">${eventDate}</span>
        </div>
        <p>Per qualsiasi chiarimento, contatta il team di gestione eventi.</p>
        <p>Cordiali saluti,<br>Il Team di Gestione Eventi</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-operator-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
