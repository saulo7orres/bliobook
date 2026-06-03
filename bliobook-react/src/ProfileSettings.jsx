/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { useState } from 'react';
import { useA11y } from './A11yContext';
import { Eye, EyeOff, Rocket } from 'lucide-react';

const ProfileSettings = ({ onVoltar, onPlanos }) => {
  // Inicialização estável unificada eliminando re-renders colaterais de montagem
  const [nome, setNome] = useState(() => localStorage.getItem('bliobook_user_nome') || '');
  const [emailPrefix, setEmailPrefix] = useState(() => {
    const sessaoEmail = localStorage.getItem('bliobook_user_email') || '';
    return sessaoEmail.split('@')[0] || '';
  });
  
  // Estados para troca de senha
  const [senhaAtualSeguranca, setSenhaAtualSeguranca] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  
  // Estados para toggle de visibilidade das senhas
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarNovaSenha, setMostrarConfirmarNovaSenha] = useState(false);
  
  const { highContrast } = useA11y();
  const planoAtual = localStorage.getItem('bliobook_plano') || 'Free';
  const isUltra = planoAtual === 'Ultra';

  // Cores disponíveis para personalização no plano Ultra
  const coresUltra = [
    { nome: 'Violeta', valor: '#8b5cf6' },
    { nome: 'Azul', valor: '#3b82f6' },
    { nome: 'Ciano', valor: '#06b6d4' },
    { nome: 'Verde', valor: '#22c55e' }
  ];

  // Validações de segurança da nova senha (feedback visual)
  const reqLength = novaSenha.length >= 8;
  const reqUpper = /[A-Z]/.test(novaSenha);
  const reqLower = /[a-z]/.test(novaSenha);
  const reqNumber = /\d/.test(novaSenha);
  const reqSpecial = /[@$!%*?&]/.test(novaSenha);
  const reqNoRepeat = novaSenha.length >= 2 && new Set(novaSenha).size === novaSenha.length;
  // Senha é válida se estiver vazia (sem alteração) ou atender todos os critérios
  const novaSenhaValida = novaSenha === '' || (reqLength && reqUpper && reqLower && reqNumber && reqSpecial && reqNoRepeat);

  const handleSalvarDados = (e) => {
    e.preventDefault();
    const emailCompleto = `${emailPrefix.trim()}@bliobook.com`.toLowerCase();
    const emailAntigo = localStorage.getItem('bliobook_user_email');
    
    let usuarios = JSON.parse(localStorage.getItem('bliobook_usuarios')) || [];

    // Verifica se novo email já existe (evita duplicatas)
    if (emailCompleto !== emailAntigo && usuarios.some(u => u.email === emailCompleto)) {
      return alert("Ação Bloqueada: Este e-mail já está em uso por outro usuário no ecossistema.");
    }

    // Atualiza dados do usuário no array de usuários
    const index = usuarios.findIndex(u => u.email === emailAntigo);
    if (index !== -1) {
      usuarios[index].nome = nome.trim();
      usuarios[index].email = emailCompleto;
      localStorage.setItem('bliobook_usuarios', JSON.stringify(usuarios));
    }

    // Atualiza dados na sessão local
    localStorage.setItem('bliobook_user_nome', nome.trim());
    localStorage.setItem('bliobook_user_email', emailCompleto);
    alert("Dados pessoais updated com sucesso!");
    window.dispatchEvent(new Event('atualizarAcervoEvent'));
  };

  const handleSalvarSeguranca = (e) => {
    e.preventDefault();
    const senhaReal = localStorage.getItem('bliobook_user_senha') || 'bliob00k';
    
    // Valida senha atual
    if (senhaAtualSeguranca.trim() !== senhaReal.trim()) {
      return alert("A senha atual está incorreta. Verifique se não colou espaços vazios.");
    }
    // Valida confirmação
    if (novaSenha.trim() !== confirmarNovaSenha.trim()) {
      return alert("A nova senha e a confirmação não coincidem.");
    }
    // Valida requisitos da nova senha
    if (!novaSenhaValida || novaSenha === '') {
      return alert("A nova senha não atende a todos os requisitos de segurança.");
    }
    
    // Atualiza senha no array de usuários
    const emailSessao = localStorage.getItem('bliobook_user_email');
    let usuarios = JSON.parse(localStorage.getItem('bliobook_usuarios')) || [];
    const index = usuarios.findIndex(u => u.email === emailSessao);
    if (index !== -1) {
      usuarios[index].senha = novaSenha.trim();
      localStorage.setItem('bliobook_usuarios', JSON.stringify(usuarios));
    }
    
    // Atualiza senha na sessão e remove flag de senha temporária
    localStorage.setItem('bliobook_user_senha', novaSenha.trim());
    localStorage.removeItem('bliobook_senha_temporaria');
    alert("Senha atualizada com sucesso!");
    setSenhaAtualSeguranca('');
    setNovaSenha('');
    setConfirmarNovaSenha('');
  };

  // Altera cor do tema Ultra e dispara evento de atualização
  const mudarCorUltra = (cor) => {
    if (!isUltra) return;
    localStorage.setItem('bliobook_tema_ultra', cor);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <main className="container" style={{paddingTop: '40px', paddingBottom: '40px', position: 'relative'}}>
      {/* Botão de retorno ao Dashboard */}
      <button 
        type="button" onClick={onVoltar} aria-label="Voltar para o Dashboard"
        style={{ position: 'absolute', top: '20px', left: '25px', cursor: 'pointer', background: 'var(--card-bg)', color: 'var(--text-color)', padding: '8px 18px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', border: '2px solid var(--input-border)', zIndex: 100, transition: 'transform 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        ← Voltar
      </button>

      <header style={{marginBottom: '35px', textAlign: 'center'}}>
        <h1 style={{color: 'var(--primary-color)', margin: 0, fontSize: '2.2rem'}}>Configurações</h1>
        <p style={{color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '5px'}}>Gerencie seu perfil e segurança no BlioBook</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        {/* Seção: Dados Pessoais */}
        <section className="card-gestalt" style={{padding: '30px', background: 'var(--card-bg)', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column'}}>
          <h2 style={{color: 'var(--primary-color)', marginTop: 0, marginBottom: '20px', fontSize: '1.5rem', borderBottom: '2px solid var(--input-border)', paddingBottom: '10px'}}>Dados Pessoais</h2>
          
          <form onSubmit={handleSalvarDados} style={{display: 'flex', flexDirection: 'column', gap: '20px', flex: 1}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <label htmlFor="perfil-nome" style={{fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-color)'}}>Nome de Exibição</label>
              <input 
                id="perfil-nome" type="text" className="input-field" 
                value={nome} onChange={(e) => setNome(e.target.value)} required
                style={{ padding: '12px', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <label htmlFor="perfil-email" style={{fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-color)'}}>E-mail Institucional</label>
              <div style={{display: 'flex', alignItems: 'stretch'}}>
                <input 
                  id="perfil-email" type="text" className="input-field" 
                  value={emailPrefix} onChange={(e) => setEmailPrefix(e.target.value)} required
                  style={{ margin: 0, borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, padding: '12px' }}
                />
                <span aria-hidden="true" style={{ backgroundColor: '#f1f5f9', color: '#334155', border: '2px solid var(--input-border)', borderLeft: 'none', padding: '0 15px', fontSize: '1rem', fontWeight: 'bold', borderTopRightRadius: '8px', borderBottomRightRadius: '8px', display: 'flex', alignItems: 'center' }}>
                  @bliobook.com
                </span>
              </div>
            </div>
            
            <button type="submit" className="btn-salvar" style={{marginTop: 'auto', padding: '15px', fontSize: '1.1rem', fontWeight: 'bold', background: 'var(--primary-color)', color: 'var(--btn-text-color)', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
              Salvar Perfil
            </button>
          </form>
        </section>

        {/* Seção: Segurança e Autenticação */}
        <section className="card-gestalt" style={{padding: '30px', background: 'var(--card-bg)', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column'}}>
          <h2 style={{color: 'var(--primary-color)', marginTop: 0, marginBottom: '20px', fontSize: '1.5rem', borderBottom: '2px solid var(--input-border)', paddingBottom: '10px'}}>Segurança e Autenticação</h2>
          
          <form onSubmit={handleSalvarSeguranca} style={{display: 'flex', flexDirection: 'column', gap: '20px', flex: 1}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <label htmlFor="senha-atual" style={{fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-color)'}}>Senha Atual</label>
              <div style={{position: 'relative'}}>
                <input 
                  id="senha-atual" type={mostrarSenhaAtual ? "text" : "password"} className="input-field" placeholder="Necessária para alterações..." 
                  value={senhaAtualSeguranca} onChange={(e) => setSenhaAtualSeguranca(e.target.value)} required
                  style={{ padding: '12px', width: '100%', boxSizing: 'border-box', paddingRight: '45px', margin: 0 }}
                />
                <button 
                  type="button" onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {mostrarSenhaAtual ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column'}}>
              <label htmlFor="nova-senha" style={{fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-color)'}}>Nova Senha</label>
              <div style={{position: 'relative'}}>
                <input 
                  id="nova-senha" type={mostrarNovaSenha ? "text" : "password"} className="input-field" placeholder="Sua nova senha segura..." 
                  value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required
                  style={{ padding: '12px', width: '100%', boxSizing: 'border-box', paddingRight: '45px', margin: 0 }}
                />
                <button 
                  type="button" onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {mostrarNovaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Lista de requisitos com feedback visual */}
              <div style={{ marginTop: '12px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-color)' }}>
                <span style={{ color: reqLength ? '#16a34a' : '#64748b', fontWeight: reqLength ? 'bold' : 'normal' }}>{reqLength ? '✓' : '○'} Mínimo 8 caracteres</span>
                <span style={{ color: reqUpper ? '#16a34a' : '#64748b', fontWeight: reqUpper ? 'bold' : 'normal' }}>{reqUpper ? '✓' : '○'} Uma letra maiúscula</span>
                <span style={{ color: reqLower ? '#16a34a' : '#64748b', fontWeight: reqLower ? 'bold' : 'normal' }}>{reqLower ? '✓' : '○'} Uma letra minúscula</span>
                <span style={{ color: reqNumber ? '#16a34a' : '#64748b', fontWeight: reqNumber ? 'bold' : 'normal' }}>{reqNumber ? '✓' : '○'} Um número</span>
                <span style={{ color: reqSpecial ? '#16a34a' : '#64748b', fontWeight: reqSpecial ? 'bold' : 'normal' }}>{reqSpecial ? '✓' : '○'} Um caractere especial (@$!%*?&)</span>
                <span style={{ color: reqNoRepeat ? '#16a34a' : '#64748b', fontWeight: reqNoRepeat ? 'bold' : 'normal' }}>{reqNoRepeat ? '✓' : '○'} Sem caracteres repetidos em sequência</span>
              </div>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <label htmlFor="confirmar-nova-senha" style={{fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-color)'}}>Confirmar Nova Senha</label>
              <div style={{position: 'relative'}}>
                <input 
                  id="confirmar-nova-senha" type={mostrarConfirmarNovaSenha ? "text" : "password"} className="input-field" placeholder="Repita a nova senha..." 
                  value={confirmarNovaSenha} onChange={(e) => setConfirmarNovaSenha(e.target.value)} required
                  style={{ padding: '12px', width: '100%', boxSizing: 'border-box', paddingRight: '45px', margin: 0 }}
                />
                <button 
                  type="button" onClick={() => setMostrarConfirmarNovaSenha(!mostrarConfirmarNovaSenha)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {mostrarConfirmarNovaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={!novaSenhaValida || novaSenha === ''}
              className="btn-salvar" 
              style={{
                marginTop: 'auto', padding: '15px', fontSize: '1.1rem', fontWeight: 'bold', 
                background: novaSenhaValida && novaSenha !== '' ? 'var(--primary-color)' : '#94a3b8', 
                color: 'var(--btn-text-color)', border: 'none', borderRadius: '8px', 
                cursor: novaSenhaValida && novaSenha !== '' ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.3s'
              }}
            >
              Atualizar Senha
            </button>
          </form>
        </section>

        {/* Seção: Personalização Visual (Plano Ultra) */}
        <section className="card-gestalt" style={{padding: '30px', background: 'var(--card-bg)', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column'}}>
          <h2 style={{color: 'var(--primary-color)', marginTop: 0, marginBottom: '20px', fontSize: '1.5rem', borderBottom: '2px solid var(--input-border)', paddingBottom: '10px'}}>Personalização Visual</h2>
          
          <p style={{color: 'var(--text-color)', marginBottom: '20px', fontSize: '1.05rem', lineHeight: '1.5'}}>
            O ecossistema permite a adaptation da paleta principal do sistema para membros do plano <strong style={{color: '#8b5cf6'}}>Ultra</strong>. 
            Selecione uma das cores abaixo para modificar a identidade visual do BlioBook.
          </p>

          {/* Botões circulares de seleção de cor */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', margin: '20px 0' }}>
            {coresUltra.map(cor => (
              <button 
                key={cor.valor}
                type="button"
                onClick={() => mudarCorUltra(cor.valor)}
                disabled={!isUltra || highContrast}
                style={{
                  width: '50px', height: '50px', borderRadius: '50%', background: cor.valor, border: '3px solid var(--card-bg)',
                  cursor: isUltra && !highContrast ? 'pointer' : 'not-allowed', 
                  opacity: isUltra && !highContrast ? 1 : 0.4,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={e => { if(isUltra && !highContrast) e.target.style.transform = 'scale(1.2)' }}
                onMouseOut={e => { if(isUltra && !highContrast) e.target.style.transform = 'scale(1)' }}
                aria-label={`Mudar cor para ${cor.nome}`}
                title={highContrast ? 'Desativado no modo Alto Contraste' : `Mudar cor para ${cor.nome}`}
              />
            ))}
          </div>

          {/* Botão de upgrade se não for Ultra */}
          {!isUltra && (
            <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '20px' }}>
              <button 
                type="button"
                onClick={onPlanos}
                aria-label="Fazer upgrade para o plano Ultra"
                style={{ background: highContrast ? 'var(--primary-color)' : '#8b5cf6', color: highContrast ? 'var(--btn-text-color)' : '#fff', padding: '10px 20px', borderRadius: '25px', fontWeight: 'bold', fontSize: '0.9rem', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(139, 92, 246, 0.4)' }}
                onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.target.style.transform = 'scale(1)'}
              >
                <Rocket size={16} className="inline mr-1" style={{ color: '#fff' }} /> Desbloquear Personalização (Ultra)
              </button>
            </div>
          )}
        </section>

      </div>
    </main>
  );
};

export default ProfileSettings;