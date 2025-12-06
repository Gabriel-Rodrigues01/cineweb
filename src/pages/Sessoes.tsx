import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { type Sessao,type Filme,type Sala, type Ingresso, sessaoSchema } from '../types';

export function Sessoes() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);
  
  // Estado para Modal de Venda
  const [sessaoSelecionada, setSessaoSelecionada] = useState<string | null>(null);
  const [tipoIngresso, setTipoIngresso] = useState<'Inteira'|'Meia'>('Inteira');
  const VALOR_BASE = 30.0; // Valor fixo para exemplo

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Sessao>({
    resolver: zodResolver(sessaoSchema)
  });

  // Carregar dados iniciais
  useEffect(() => {
    fetchSessoes();
  }, []);

  const fetchSessoes = async () => {
    const [sessoesRes, filmesRes, salasRes, ingressosRes] = await Promise.all([
      axios.get('http://localhost:3000/sessoes'),
      axios.get('http://localhost:3000/filmes'),
      axios.get('http://localhost:3000/salas'),
      axios.get('http://localhost:3000/ingressos')
    ]);
    setSessoes(sessoesRes.data);
    setFilmes(filmesRes.data);
    setSalas(salasRes.data);
    setIngressos(ingressosRes.data);
  };

  const onSubmit = async (data: Sessao) => {
    await axios.post('http://localhost:3000/sessoes', data);
    reset();
    fetchSessoes();
  };

  // Lógica de Venda de Ingresso [cite: 96-98]
  const handleVenderIngresso = async () => {
    if(!sessaoSelecionada) return;

    const sessao = sessoes.find(s => s.id === sessaoSelecionada);
    const sala = salas.find(s => s.id === sessao?.salaId);
    const capacidade = sala?.capacidade || 0;
    const contagem = getContagemIngressos(sessaoSelecionada);

    if (contagem.total >= capacidade) {
      alert("Sessão lotada!");
      return;
    }
    
    const valorFinal = tipoIngresso === 'Meia' ? VALOR_BASE / 2 : VALOR_BASE;
    
    await axios.post('http://localhost:3000/ingressos', {
        sessaoId: sessaoSelecionada,
        tipo: tipoIngresso,
        valor: valorFinal
    });
    
    alert(`Ingresso vendido! Valor: R$ ${valorFinal.toFixed(2)}`);
    setSessaoSelecionada(null); // Fecha modal
    fetchSessoes();
  };

  // Helper para contagem de ingressos
  const getContagemIngressos = (sessaoId: string) => {
    const ingressosDaSessao = ingressos.filter(i => i.sessaoId === sessaoId);
    return {
      total: ingressosDaSessao.length,
      inteira: ingressosDaSessao.filter(i => i.tipo === 'Inteira').length,
      meia: ingressosDaSessao.filter(i => i.tipo === 'Meia').length,
    };
  };

  const getFilmeTitulo = (filmeId: string): React.ReactNode => {
    const filme = filmes.find(f => f.id === filmeId);
    return filme ? filme.titulo : 'Filme não encontrado';
  };

  return (
    <div className="container">
      <h2>Agendamento de Sessões</h2>
      
      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3 mb-5 border p-3 bg-light">
        <div className="col-md-4">
            <label className="form-label">Filme</label>
            <select {...register("filmeId")} className={`form-select ${errors.filmeId ? 'is-invalid' : ''}`}>
                <option value="">Selecione...</option>
                {filmes.map(f => <option key={f.id} value={f.id}>{f.titulo}</option>)}
            </select>
            <div className="invalid-feedback">{errors.filmeId?.message}</div>
        </div>
        <div className="col-md-4">
            <label className="form-label">Sala</label>
            <select {...register("salaId")} className={`form-select ${errors.salaId ? 'is-invalid' : ''}`}>
                <option value="">Selecione...</option>
                {salas.map(s => <option key={s.id} value={s.id}>Sala {s.numero}</option>)}
            </select>
            <div className="invalid-feedback">{errors.salaId?.message}</div>
        </div>
        <div className="col-md-4">
            <label className="form-label">Data e Horário</label>
            <input type="datetime-local" {...register("dataHora")} className={`form-control ${errors.dataHora ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.dataHora?.message}</div>
        </div>
        <div className="col-12">
            <button type="submit" className="btn btn-primary">Agendar Sessão</button>
        </div>
      </form>

      {/* Lista de Sessões */}
      <h3>Sessões Agendadas</h3>
      <div className="list-group">
        {sessoes.map(sessao => {
          const contagem = getContagemIngressos(sessao.id!);
          const sala = salas.find(s => s.id === sessao.salaId);
          const capacidade = sala?.capacidade || 0;
          const lotado = contagem.total >= capacidade;

          const getFilmeTitulo = (filmeId: string) => {
            return filmes.find(f => f.id === filmeId)?.titulo || 'Filme não encontrado';
          };

          const getSalaNumero = (salaId: string) => {
            return salas.find(s => s.id === salaId)?.numero || 'N/A';
          };

          return (
            <div key={sessao.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h5>{getFilmeTitulo(sessao.filmeId)}</h5>
                    <p className="mb-0">Sala: {getSalaNumero(sessao.salaId)} | Horário: {new Date(sessao.dataHora).toLocaleString()}</p>
                    <p className="mb-0">
                      Ingressos: {contagem.total} / {capacidade} 
                      <span className="ms-2">(Inteiras: {contagem.inteira}, Meias: {contagem.meia})</span>
                      {lotado && <span className="badge bg-danger ms-2">Lotado</span>}
                    </p>
                </div>
                <button 
                  className="btn btn-success" 
                  onClick={() => setSessaoSelecionada(sessao.id!)}
                  disabled={lotado}
                >
                    <i className="bi bi-ticket-perforated"></i> Vender Ingresso
                </button>
            </div>
          )
        })}
      </div>

      {/* Modal Simples (Renderização condicional) */}
      {sessaoSelecionada && (
        <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Venda de Ingresso</h5>
                        <button className="btn-close" onClick={() => setSessaoSelecionada(null)}></button>
                    </div>
                    <div className="modal-body">
                        <p>Filme: {getFilmeTitulo(sessoes.find(s => s.id === sessaoSelecionada)?.filmeId || '')}</p>
                        <div className="mb-3">
                            <label className="form-label">Tipo de Ingresso</label>
                            <select className="form-select" value={tipoIngresso} onChange={(e) => setTipoIngresso(e.target.value as any)}>
                                <option value="Inteira">Inteira (R$ {VALOR_BASE.toFixed(2)})</option>
                                <option value="Meia">Meia (R$ {(VALOR_BASE/2).toFixed(2)})</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => setSessaoSelecionada(null)}>Cancelar</button>
                        <button className="btn btn-primary" onClick={handleVenderIngresso}>Confirmar Venda</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}