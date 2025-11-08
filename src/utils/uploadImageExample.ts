import { supabase } from "@/integrations/supabase/client";

/**
 * Exemplo de como fazer upload de uma imagem para o bucket question-images
 * Use este código adaptado no seu componente ou página
 */
export const uploadQuestionImage = async (file: File) => {
  try {
    // Verifica se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error("Usuário não autenticado");
    }

    // Gera um nome único para o arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    // Faz o upload da imagem
    const { data, error } = await supabase.storage
      .from('question-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Obtém a URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('question-images')
      .getPublicUrl(fileName);

    console.log('Upload realizado com sucesso!');
    console.log('URL pública:', publicUrl);

    return {
      path: data.path,
      publicUrl: publicUrl
    };

  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    throw error;
  }
};

// Exemplo de uso em um componente:
// const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//   const file = event.target.files?.[0];
//   if (file) {
//     const result = await uploadQuestionImage(file);
//     // Use result.publicUrl para salvar no campo stem_image_path da tabela question
//   }
// };
