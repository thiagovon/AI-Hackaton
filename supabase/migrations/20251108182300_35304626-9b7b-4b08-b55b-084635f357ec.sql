-- Criar tabela de cadernos (notebooks)
CREATE TABLE public.notebooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📚',
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de relação entre notebooks e questões
CREATE TABLE public.notebook_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notebook_id UUID NOT NULL REFERENCES public.notebooks(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.question(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(notebook_id, question_id)
);

-- Criar tabela de anotações do usuário sobre questões
CREATE TABLE public.question_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question_id UUID NOT NULL REFERENCES public.question(id) ON DELETE CASCADE,
  notebook_id UUID REFERENCES public.notebooks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id, notebook_id)
);

-- Enable Row Level Security
ALTER TABLE public.notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notebook_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies para notebooks
CREATE POLICY "Users can view their own notebooks"
  ON public.notebooks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notebooks"
  ON public.notebooks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notebooks"
  ON public.notebooks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notebooks"
  ON public.notebooks FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies para notebook_questions
CREATE POLICY "Users can view questions in their notebooks"
  ON public.notebook_questions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.notebooks
    WHERE notebooks.id = notebook_questions.notebook_id
    AND notebooks.user_id = auth.uid()
  ));

CREATE POLICY "Users can add questions to their notebooks"
  ON public.notebook_questions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.notebooks
    WHERE notebooks.id = notebook_questions.notebook_id
    AND notebooks.user_id = auth.uid()
  ));

CREATE POLICY "Users can remove questions from their notebooks"
  ON public.notebook_questions FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.notebooks
    WHERE notebooks.id = notebook_questions.notebook_id
    AND notebooks.user_id = auth.uid()
  ));

-- RLS Policies para question_notes
CREATE POLICY "Users can view their own notes"
  ON public.question_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes"
  ON public.question_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON public.question_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON public.question_notes FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at em notebooks
CREATE TRIGGER update_notebooks_updated_at
  BEFORE UPDATE ON public.notebooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar updated_at em question_notes
CREATE TRIGGER update_question_notes_updated_at
  BEFORE UPDATE ON public.question_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índices para melhorar performance
CREATE INDEX idx_notebooks_user_id ON public.notebooks(user_id);
CREATE INDEX idx_notebook_questions_notebook_id ON public.notebook_questions(notebook_id);
CREATE INDEX idx_notebook_questions_question_id ON public.notebook_questions(question_id);
CREATE INDEX idx_question_notes_user_id ON public.question_notes(user_id);
CREATE INDEX idx_question_notes_question_id ON public.question_notes(question_id);