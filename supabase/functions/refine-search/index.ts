import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array é obrigatória" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    console.log("Processando refinamento de busca");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Você é um assistente especializado em ajudar estudantes a encontrar questões de concursos públicos brasileiros. Seu objetivo é coletar informações para refinar a busca.

Pergunte sobre os seguintes aspectos que NÃO foram mencionados pelo usuário:
- Banca organizadora (ex: CESGRANRIO, FCC, CESPE, FGV)
- Instituição (ex: BNDES, ANM, Petrobras)
- Cargo (ex: Cientista de Dados, Analista, Técnico)
- Período/Ano da questão (ex: 2022, 2020-2023)

Faça perguntas de forma natural e conversacional. Pergunte apenas sobre 1-2 aspectos por vez. Seja breve e direto.

Quando o usuário responder com as informações ou disser que não tem preferência, resuma as informações coletadas em formato estruturado:
REFINAMENTO_COMPLETO:
- Tópico: [tópico original]
- Banca: [nome da banca ou "qualquer"]
- Instituição: [nome ou "qualquer"]
- Cargo: [cargo ou "qualquer"]
- Período: [ano/período ou "qualquer"]`
          },
          ...messages
        ],
      }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Limite de requisições excedido. Tente novamente mais tarde." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "Créditos insuficientes. Por favor, adicione créditos ao seu workspace." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro da API de IA:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao processar refinamento" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    console.log("Refinamento processado com sucesso");

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro na função:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
