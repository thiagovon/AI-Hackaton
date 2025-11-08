import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, limit = 3 } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query é obrigatória" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Buscando questões para:", query, "Limite:", limit);

    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase não configurado corretamente");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar questões usando full-text search
    // A busca agora inclui metadados (instituicao, banca, cargo, source) na indexação
    const { data: searchResults, error: searchError } = await supabase
      .from('question_search')
      .select('question_id')
      .textSearch('tsv', query, {
        type: 'websearch',
        config: 'portuguese'
      })
      .limit(limit);

    if (searchError) {
      console.error("Erro ao buscar questões:", searchError);
      throw searchError;
    }

    if (!searchResults || searchResults.length === 0) {
      console.log("Nenhuma questão encontrada");
      return new Response(
        JSON.stringify({ 
          questions: [],
          message: "Nenhuma questão encontrada sobre este tópico no momento."
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Buscar as questões completas com as alternativas
    const questionIds = searchResults.map(r => r.question_id);
    
    const { data: questions, error: questionsError } = await supabase
      .from('question')
      .select(`
        id,
        stem,
        stem_image_path,
        type,
        difficulty,
        source,
        explanation,
        created_at,
        instituicao,
        banca,
        cargo,
        ano,
        choice (
          id,
          label,
          content,
          image_path,
          is_correct,
          position
        )
      `)
      .in('id', questionIds)
      .order('created_at', { ascending: false });

    if (questionsError) {
      console.error("Erro ao buscar detalhes das questões:", questionsError);
      throw questionsError;
    }

    console.log(`Encontradas ${questions?.length || 0} questões`);

    return new Response(
      JSON.stringify({ 
        questions: questions || [],
        count: questions?.length || 0
      }),
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
