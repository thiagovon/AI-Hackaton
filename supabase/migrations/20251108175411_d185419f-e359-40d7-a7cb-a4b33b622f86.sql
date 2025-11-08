-- Fix security warnings by setting search_path on existing functions

-- Update the update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

-- Update the refresh_question_search function with proper search_path
CREATE OR REPLACE FUNCTION public.refresh_question_search(qid uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  insert into question_search (question_id, tsv)
  select q.id,
         setweight(to_tsvector('portuguese', coalesce(q.stem,'')), 'A') ||
         setweight(to_tsvector('portuguese', coalesce(string_agg(c.content,' '),'')), 'B')
  from question q
  left join choice c on c.question_id = q.id
  where q.id = qid
  group by q.id
  on conflict (question_id) do update
  set tsv = excluded.tsv;
$function$;

-- Update the trg_refresh_question_search function with proper search_path
CREATE OR REPLACE FUNCTION public.trg_refresh_question_search()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
begin
  perform refresh_question_search(coalesce(new.id, old.id));
  return new;
end;
$function$;