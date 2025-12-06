import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {type Sala, salaSchema } from '../types';

export function Salas() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Sala>({
    resolver: zodResolver(salaSchema)
  });

  const fetchSalas = async () => {
    const res = await axios.get('http://localhost:3000/salas');
    setSalas(res.data);
  };

  useEffect(() => { fetchSalas(); }, []);

  const onSubmit = async (data: Sala) => {
    await axios.post('http://localhost:3000/salas', data);
    reset();
    fetchSalas();
  };

  return (
    <div className="container">
      <h2>Gerenciar Salas</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3 mb-4 border p-3 rounded">
        <div className="col-md-6">
            <label className="form-label">Número da Sala</label>
            <input type="number" {...register("numero", { valueAsNumber: true })} className={`form-control ${errors.numero ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.numero?.message}</div>
        </div>
        <div className="col-md-6">
            <label className="form-label">Capacidade Máxima</label>
            <input type="number" {...register("capacidade", { valueAsNumber: true })} className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.capacidade?.message}</div>
        </div>
        <div className="col-12">
            <button type="submit" className="btn btn-success">Salvar Sala</button>
        </div>
      </form>

      <table className="table table-striped">
        <thead><tr><th>Número</th><th>Capacidade</th></tr></thead>
        <tbody>
            {salas.map(sala => (
                <tr key={sala.id}><td>Sala {sala.numero}</td><td>{sala.capacidade} Pessoas</td></tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}