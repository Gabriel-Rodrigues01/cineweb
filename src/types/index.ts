import { z } from 'zod';

// --- FILMES ---
export const filmeSchema = z.object({
  id: z.string().optional(), // json-server usa string id por padrão
  titulo: z.string().min(1, "O título é obrigatório"),
  sinopse: z.string().min(10, "A sinopse deve ter no mínimo 10 caracteres"),
  duracao: z.number().positive("A duração deve ser maior que 0"), // em minutos
  classificacao: z.string().min(1, "Classificação é obrigatória"),
  genero: z.string().min(1, "Gênero é obrigatório"),
  imagemUrl: z.string().url("URL da imagem inválida").optional()
});

export type Filme = z.infer<typeof filmeSchema>;

export const salaSchema = z.object({
  id: z.string().optional(),
  numero: z.number().int().positive("Número da sala inválido"),
  capacidade: z.number().int().positive("Capacidade deve ser positiva")
});

export type Sala = z.infer<typeof salaSchema>;

export const sessaoSchema = z.object({
  id: z.string().optional(),
  filmeId: z.string().min(1, "Selecione um filme"),
  salaId: z.string().min(1, "Selecione uma sala"),
  dataHora: z.string().refine((data) => new Date(data) >= new Date(), {
    message: "A data da sessão não pode ser retroativa"
  })
});

export type Sessao = z.infer<typeof sessaoSchema>;

export interface Ingresso {
  id?: string;
  sessaoId: string;
  tipo: 'Inteira' | 'Meia';
  valor: number;
}