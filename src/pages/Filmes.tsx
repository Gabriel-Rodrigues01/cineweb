import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {type Filme, filmeSchema } from '../types';

export function Filmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [editando, setEditando] = useState<Filme | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Filme>({
    resolver: zodResolver(filmeSchema)
  });

  const fetchFilmes = async () => {
    const response = await axios.get('http://localhost:3000/filmes');
    setFilmes(response.data);
  };

  useEffect(() => { fetchFilmes(); }, []);

  const onSubmit = async (data: Filme) => {
    if (editando) {
      await axios.put(`http://localhost:3000/filmes/${editando.id}`, data);
    } else {
      await axios.post('http://localhost:3000/filmes', data);
    }
    reset();
    setEditando(null);
    fetchFilmes();
  };

  const handleEdit = (filme: Filme) => {
    setEditando(filme);
    setValue("titulo", filme.titulo);
    setValue("sinopse", filme.sinopse);
    setValue("duracao", filme.duracao);
    setValue("classificacao", filme.classificacao);
    setValue("genero", filme.genero);
    setValue("imagemUrl", filme.imagemUrl);
  };

  const cancelEdit = () => {
    setEditando(null);
    reset();
  };

  const handleDelete = async (id: string) => {
    if(confirm("Deseja excluir este filme?")) {
      await axios.delete(`http://localhost:3000/filmes/${id}`);
      fetchFilmes();
    }
  };

  return (
    <div className="container">
      <h2>Gerenciar Filmes <i className="bi bi-film"></i></h2>
      
      {/* Formulário de Cadastro */}
      <div className="card p-4 mb-4">
        <h5>{editando ? "Editar Filme" : "Novo Filme"}</h5>
        <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Título</label>
            <input {...register("titulo")} className={`form-control ${errors.titulo ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.titulo?.message}</div>
          </div>
          <div className="col-md-3">
            <label className="form-label">Duração (min)</label>
            <input type="number" {...register("duracao", { valueAsNumber: true })} className={`form-control ${errors.duracao ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.duracao?.message}</div>
          </div>
          <div className="col-md-3">
            <label className="form-label">Classificação</label>
            <select {...register("classificacao")} className="form-select">
                <option value="Livre">Livre</option>
                <option value="12 anos">12 anos</option>
                <option value="18 anos">18 anos</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Gênero</label>
            <select {...register("genero")} className="form-select">
                <option value="Ação">Ação</option>
                <option value="Comédia">Comédia</option>
                <option value="Drama">Drama</option>
            </select>
          </div>
          <div className="col-md-8">
            <label className="form-label">URL da Imagem</label>
            <input {...register("imagemUrl")} className={`form-control ${errors.imagemUrl ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.imagemUrl?.message}</div>
          </div>
          <div className="col-md-12">
            <label className="form-label">Sinopse</label>
            <textarea {...register("sinopse")} className={`form-control ${errors.sinopse ? 'is-invalid' : ''}`} rows={2}></textarea>
            <div className="invalid-feedback">{errors.sinopse?.message}</div>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">{editando ? "Salvar" : "Cadastrar"}</button>
            {editando && <button type="button" className="btn btn-secondary ms-2" onClick={cancelEdit}>Cancelar</button>}
          </div>
        </form>
      </div>

      {/* Listagem */}
      <div className="row">
        {filmes.map(filme => (
          <div key={filme.id} className="col-md-4 mb-3">
            <div className="card h-100">
              {filme.imagemUrl ? (
                <img src={filme.imagemUrl} className="card-img-top" alt={filme.titulo} style={{ height: '200px', objectFit: 'cover' }} />
              ) : (
                <div className="card-img-top text-center bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                  <span className="text-muted">Imagem não disponível</span>
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title">{filme.titulo}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{filme.genero} - {filme.duracao} min</h6>
                <p className="card-text">{filme.sinopse}</p>
                <button onClick={() => handleEdit(filme)} className="btn btn-secondary btn-sm me-2">
                  <i className="bi bi-pencil"></i> Editar
                </button>
                <button onClick={() => handleDelete(filme.id!)} className="btn btn-danger btn-sm">
                  <i className="bi bi-trash"></i> Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}