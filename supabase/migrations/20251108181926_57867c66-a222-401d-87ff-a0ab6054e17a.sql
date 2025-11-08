-- Adicionar colunas de metadados para filtros inteligentes
ALTER TABLE public.question 
ADD COLUMN IF NOT EXISTS instituicao TEXT,
ADD COLUMN IF NOT EXISTS banca TEXT,
ADD COLUMN IF NOT EXISTS cargo TEXT,
ADD COLUMN IF NOT EXISTS ano INTEGER;

-- Criar índices para melhorar performance das buscas
CREATE INDEX IF NOT EXISTS idx_question_instituicao ON public.question(instituicao);
CREATE INDEX IF NOT EXISTS idx_question_banca ON public.question(banca);
CREATE INDEX IF NOT EXISTS idx_question_cargo ON public.question(cargo);
CREATE INDEX IF NOT EXISTS idx_question_ano ON public.question(ano);

-- Atualizar a função de busca para incluir os novos metadados
CREATE OR REPLACE FUNCTION public.refresh_question_search(qid uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  insert into question_search (question_id, tsv)
  select q.id,
         setweight(to_tsvector('portuguese', coalesce(q.stem,'')), 'A') ||
         setweight(to_tsvector('portuguese', coalesce(string_agg(c.content,' '),'')), 'B') ||
         setweight(to_tsvector('portuguese', coalesce(q.instituicao,'')), 'C') ||
         setweight(to_tsvector('portuguese', coalesce(q.banca,'')), 'C') ||
         setweight(to_tsvector('portuguese', coalesce(q.cargo,'')), 'C') ||
         setweight(to_tsvector('portuguese', coalesce(q.source,'')), 'D')
  from question q
  left join choice c on c.question_id = q.id
  where q.id = qid
  group by q.id
  on conflict (question_id) do update
  set tsv = excluded.tsv;
$function$;