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

IMPORTANTE: Analise o tópico inicial do usuário e identifique quais informações ele NÃO mencionou. Pergunte APENAS sobre os aspectos que faltam:

Aspectos para verificar:
- **Banca organizadora** (ex: CESGRANRIO, FCC, CESPE, FGV, Fundação CEPERJ)
- **Instituição** (ex: BNDES, ANM, Petrobras, Banco do Brasil)
- **Cargo** (ex: Cientista de Dados, Analista, Técnico, Auditor)
- **Data da questão** (ex: 2024, 2022, últimos 5 anos)
- **Disciplina** (ex: Português, Matemática, Direito, Raciocínio Lógico)

FORMATO DA RESPOSTA:
1. Cumprimente brevemente
2. Liste em tópicos numerados APENAS os aspectos não mencionados que ajudariam a refinar
3. Peça que o usuário escolha quais informar (pode pular se não souber)

Exemplo de resposta:
"Ótimo! Para encontrar as melhores questões sobre [tópico], posso refinar sua busca com:

1. 📋 **Banca organizadora** - Qual banca você prefere? (CESGRANRIO, FCC, CESPE, etc.)
2. 🏢 **Instituição** - Há alguma instituição específica? (BNDES, Petrobras, etc.)  
3. 👔 **Cargo** - Para qual cargo você está estudando?
4. 📅 **Período** - Prefere questões recentes ou de um ano específico?

Você pode informar o que souber ou pular os que não se aplicam!"

Quando o usuário responder, resuma em:
REFINAMENTO_COMPLETO:
- Tópico: [tópico original]
- Banca: [nome ou "qualquer"]
- Instituição: [nome ou "qualquer"]
- Cargo: [cargo ou "qualquer"]
- Período: [ano ou "qualquer"]
- Disciplina: [disciplina ou "qualquer"]`
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
