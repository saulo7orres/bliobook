/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { useState, useEffect } from 'react';
import { useA11y } from './A11yContext';
import { Rocket, Clock, CreditCard, FileText, Diamond, Lock, X, Check } from 'lucide-react';

const SubscriptionPlans = ({ onVoltar }) => {
  // Controle de ciclo de cobrança (Mensal vs Anual)
  const [cicloAnual, setCicloAnual] = useState(false);
  // Controle do modal de checkout
  const [checkoutPlano, setCheckoutPlano] = useState(null);
  // Método de pagamento selecionado (cartão, pix, boleto)
  const [metodoPagamento, setMetodoPagamento] = useState('cartao');
  // Número de parcelas (simulado)
  const [parcelas, setParcelas] = useState(1);

  // Recupera estado atual do usuário
  const planoAtual = localStorage.getItem('bliobook_plano') || 'Free';
  const trialUsado = localStorage.getItem('bliobook_trial_used') === 'true';
  const trialStart = localStorage.getItem('bliobook_trial_start');
  const { highContrast } = useA11y();

  // Calcula dias restantes do trial (30 dias) ao montar o componente
  const [diasTrial] = useState(() => {
    if (trialStart && planoAtual === 'Pro') {
      const diffTime = Math.abs(new Date() - new Date(trialStart));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const restantes = 30 - diffDays;
      return restantes > 0 ? restantes : 0;
    }
    return 0;
  });

  // Campos do formulário de cartão de crédito
  const [numeroCartao, setNumeroCartao] = useState('');
  const [nomeCartao, setNomeCartao] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');

  // Verifica se o trial expirou e retorna ao plano Free automaticamente
  useEffect(() => {
    if (trialStart && planoAtual === 'Pro' && diasTrial <= 0) {
       localStorage.setItem('bliobook_plano', 'Free');
       localStorage.removeItem('bliobook_tema_ultra');
       window.dispatchEvent(new Event('temaAlterado'));
       alert("O seu período de teste expirou. O sistema retornou automaticamente ao plano Free.");
       window.location.reload();
    }
  }, [planoAtual, trialStart, diasTrial]);

  // Estado derivado: se o trial está ativo agora
  const isTrialAtivo = planoAtual === 'Pro' && trialStart && diasTrial > 0;

  // Formata preço para moeda brasileira (R$) aplicando desconto anual se necessário
  const formatarPreco = (precoBase) => {
    if (precoBase === 0) return "0,00";
    const valorReal = cicloAnual ? precoBase * 0.8 : precoBase;
    return valorReal.toFixed(2).replace('.', ',');
  };

  // Retorna valor numérico do preço para cálculos
  const precoNumerico = (precoBase) => {
    if (precoBase === 0) return 0;
    return cicloAnual ? precoBase * 0.8 : precoBase;
  };

  // Inicia o trial do plano Pro (30 dias grátis)
  const iniciarTestePro = () => {
    localStorage.setItem('bliobook_plano', 'Pro');
    localStorage.setItem('bliobook_trial_start', new Date().toISOString());
    localStorage.setItem('bliobook_trial_used', 'true');
    localStorage.removeItem('bliobook_tema_ultra');
    window.dispatchEvent(new Event('temaAlterado'));
    alert("Teste PRO de 30 dias ativado com sucesso!\n\nO ecossistema Esmeralda e a Automação Inteligente estão liberados. Avalie nossas ferramentas livremente.");
    onVoltar();
  };

  // Abre o modal de checkout ou ativa plano gratuito imediatamente
  const abrirCheckout = (nome, precoBase, cor) => {
    if (precoBase === 0) {
      // Lógica para plano Free (desativação de premium)
      if (planoAtual === 'Free') {
        alert("Você já está no Plano Free. Nenhuma alteração de faturamento é necessária no momento.");
        return;
      }
      localStorage.setItem('bliobook_plano', nome);
      localStorage.removeItem('bliobook_trial_start');
      localStorage.removeItem('bliobook_tema_ultra');
      window.dispatchEvent(new Event('temaAlterado'));
      alert(`O Plano ${nome} foi ativado. Funções premium foram desativadas.`);
      onVoltar();
    } else {
      // Prepara dados para o modal de pagamento
      setCheckoutPlano({ nome, preco: precoNumerico(precoBase), cor });
      setMetodoPagamento('cartao');
      setParcelas(1);
      // Limpa campos do cartão
      setNumeroCartao('');
      setNomeCartao('');
      setValidade('');
      setCvv('');
    }
  };

  // Finaliza a compra (simulação) e atualiza o plano
  const finalizarCompra = (e) => {
    e?.preventDefault();
    localStorage.setItem('bliobook_plano', checkoutPlano.nome);
    localStorage.removeItem('bliobook_trial_start');
    
    // Remove tema customizado se sair do plano Ultra
    if(checkoutPlano.nome !== 'Ultra') {
      localStorage.removeItem('bliobook_tema_ultra');
    }
    
    window.dispatchEvent(new Event('temaAlterado'));
    alert(`Sucesso! Os dados de faturamento foram processados e o Plano ${checkoutPlano.nome} está configurado na sua conta.`);
    setCheckoutPlano(null);
    onVoltar();
  };

  // Formatação automática do número do cartão (espaços a cada 4 dígitos)
  const handleCartao = (e) => {
    let val = e.target.value.replace(/\D/g, ''); 
    val = val.replace(/(\d{4})(?=\d)/g, '$1 '); 
    setNumeroCartao(val);
  };

  // Formatação do nome no cartão (apenas letras e maiúsculas)
  const handleNome = (e) => {
    let val = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, ''); 
    setNomeCartao(val.toUpperCase());
  };

  // Formatação da validade (MM/AA) com validação básica de mês
  const handleValidade = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      let mes = parseInt(val.substring(0, 2), 10);
      if (mes > 12) val = '12' + val.substring(2);
      if (mes === 0) val = '01' + val.substring(2);
      if (val.length >= 3) val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setValidade(val);
  };

  return (
    <main className="container" style={{ paddingTop: '30px', paddingBottom: '40px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      
      <header style={{ marginBottom: '40px', textAlign: 'center', position: 'relative' }}>
        {/* Botão de retorno ao Dashboard */}
        <button 
        type="button" 
        onClick={onVoltar}
        aria-label="Voltar para o Dashboard"
        style={{ position: 'absolute', top: '20px', left: '25px', cursor: 'pointer', background: 'var(--card-bg)', color: 'var(--text-color)', padding: '8px 18px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', border: '2px solid var(--input-border)', zIndex: 100, transition: 'transform 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
        ← Voltar
        </button>

        {/* Banner de aviso se trial estiver ativo */}
        {isTrialAtivo ? (
          <div style={{display: 'inline-block', background: '#fef3c7', color: '#b45309', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '15px', border: '1px solid #fde68a'}}>
            <Clock size={16} className="inline mr-1" /> Restam {diasTrial} dias para acabar o teste PRO. Assine agora ou seu plano retornará ao Free ao fim do período.
          </div>
        ) : !trialUsado ? (
          /* Banner de incentivo para começar o trial */
          <div style={{display: 'inline-block', background: highContrast ? 'var(--primary-color)' : '#e0e7ff', color: highContrast ? 'var(--btn-text-color)' : '#4338ca', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '15px'}}>
            <Rocket size={16} className="inline mr-1" /> Comece seu teste de 30 dias GRÁTIS hoje
          </div>
        ) : null}

        <h2 style={{ color: 'var(--primary-color)', margin: '0 0 10px 0', fontSize: '2.5rem' }}>Evolua o seu Acervo</h2>
        <p style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Desbloqueie a IA Autônoma e o Dashboard Premium. Cancele ou altere sua forma de pagamento quando quiser.
        </p>
      </header>

      {/* Alternador de Ciclo (Mensal/Anual) com toggle customizado */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
        <span style={{ fontWeight: !cicloAnual ? 'bold' : 'normal', color: !cicloAnual ? 'var(--primary-color)' : '#ffffff' }}>Faturamento Mensal</span>
        <button 
          onClick={() => setCicloAnual(!cicloAnual)}
          style={{ width: '60px', height: '30px', borderRadius: '15px', background: cicloAnual ? 'var(--primary-color)' : (highContrast ? 'var(--card-bg)' : '#cbd5e1'), position: 'relative', border: highContrast ? '2px solid var(--primary-color)' : 'none', cursor: 'pointer', transition: 'background 0.3s' }}
        >
          <div style={{ width: '24px', height: '24px', background: highContrast ? 'var(--primary-color)' : '#ffffff', borderRadius: '50%', position: 'absolute', top: highContrast ? '1px' : '3px', left: cicloAnual ? '31px' : '3px', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
        </button>
        <span style={{ fontWeight: cicloAnual ? 'bold' : 'normal', color: cicloAnual ? 'var(--primary-color)' : '#ffffff' }}>
          Anual <span style={{ background: highContrast ? 'var(--primary-color)' : '#22c55e', color: highContrast ? 'var(--btn-text-color)' : '#fff', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '12px', marginLeft: '5px', fontWeight: 'bold' }}>20% OFF</span>
        </span>
      </div>

      {/* Grid responsivo com os 4 planos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px' }}>
        
        {/* Plano Free */}
        <article className="card-gestalt" style={{ padding: '30px', background: 'var(--card-bg)', borderRadius: '16px', border: highContrast ? '2px solid var(--primary-color)' : 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem', color: 'var(--text-color)' }}>Free</h3>
          <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '0.9rem', minHeight: '40px' }}>Para pequenas bibliotecas em fase de triagem estrutural.</p>
          <div style={{ margin: '20px 0', paddingBottom: '20px', borderBottom: '1px solid var(--input-border)' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-color)' }}>R$ {formatarPreco(0)}</span>
            <span style={{ color: 'var(--text-color)', opacity: 0.7 }}>/mês</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: highContrast ? 'var(--primary-color)' : '#22c55e', fontWeight:'bold' }}><Check size={16} /></span> Gestão de Acervo Básico</li>
            <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: highContrast ? 'var(--primary-color)' : '#22c55e', fontWeight:'bold' }}><Check size={16} /></span> Acessibilidade Inclusiva</li>
            {/* Funcionalidades indisponíveis no plano Free */}
            <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.6 }}><span style={{fontWeight:'bold'}}><X size={16} /></span> Assistente de IA</li>
            <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.6 }}><span style={{fontWeight:'bold'}}><X size={16} /></span> Interface Premium</li>
          </ul>
          <button 
            onClick={() => abrirCheckout('Free', 0, '#94a3b8')} 
            style={{ width: '100%', padding: '15px', fontWeight: 'bold', borderRadius: '8px', background: planoAtual === 'Free' ? 'var(--primary-color)' : '#94a3b8', color: '#ffffff', border: highContrast ? '2px solid var(--primary-color)' : 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
          >
            {planoAtual === 'Free' ? '✨ Plano Atual' : 'Usar Free'}
          </button>
        </article>

        {/* Plano Plus */}
        <article className="card-gestalt" style={{ padding: '30px', background: 'var(--card-bg)', borderRadius: '16px', border: highContrast ? '2px solid var(--primary-color)' : 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem', color: highContrast ? 'var(--primary-color)' : '#0ea5e9' }}>Plus</h3>
          <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '0.9rem', minHeight: '40px' }}>Ideal para escolas que buscam inovação visual e buscas rápidas.</p>
          <div style={{ margin: '20px 0', paddingBottom: '20px', borderBottom: '1px solid var(--input-border)' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: highContrast ? 'var(--text-color)' : '#0ea5e9' }}>R$ {formatarPreco(49.9)}</span>
            <span style={{ color: 'var(--text-color)', opacity: 0.7 }}>/mês</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: highContrast ? 'var(--primary-color)' : '#22c55e', fontWeight:'bold' }}><Check size={16} /></span> Tudo do plano Free</li>
            <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: highContrast ? 'var(--primary-color)' : '#22c55e', fontWeight:'bold' }}><Check size={16} /></span> Interface Premium (Ciano)</li>
            <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: highContrast ? 'var(--primary-color)' : '#22c55e', fontWeight:'bold' }}><Check size={16} /></span> Assistente de IA (Apenas Consultas)</li>
            {/* Operações de IA só disponíveis a partir do Pro */}
            <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.6 }}><span style={{fontWeight:'bold'}}><X size={16} /></span> Assistente de IA (Operações)</li>
          </ul>
          <button 
            onClick={() => abrirCheckout('Plus', 49.9, '#0ea5e9')} 
            style={{ width: '100%', padding: '15px', fontWeight: 'bold', borderRadius: '8px', background: highContrast ? 'var(--primary-color)' : '#0ea5e9', color: highContrast ? 'var(--btn-text-color)' : '#fff', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }} 
          >
            {planoAtual === 'Plus' ? '✨ Plano Atual (Gerenciar)' : 'Assinar Plus'}
          </button>
        </article>

        {/* Plano Pro (com destaque visual e escala maior) */}
        <article className="card-gestalt" style={{ padding: '30px', background: highContrast ? 'var(--card-bg)' : 'var(--primary-color)', borderRadius: '16px', border: highContrast ? '2px solid var(--primary-color)' : 'none', boxShadow: highContrast ? 'none' : '0 20px 35px rgba(16, 185, 129, 0.3)', display: 'flex', flexDirection: 'column', transform: 'scale(1.05)', zIndex: 10 }}>
          <div style={{ background: highContrast ? 'var(--primary-color)' : '#fff', color: highContrast ? 'var(--btn-text-color)' : '#059669', fontSize: '0.8rem', fontWeight: 'bold', padding: '5px 15px', borderRadius: '20px', alignSelf: 'flex-start', marginBottom: '15px' }}>MAIS POPULAR</div>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem', color: highContrast ? 'var(--primary-color)' : '#ffffff' }}>Pro</h3>
          <p style={{ color: highContrast ? 'var(--text-color)' : '#ffffff', opacity: 0.9, fontSize: '0.9rem', minHeight: '40px' }}>O poder da automação para bibliotecas de alta demanda.</p>
          <div style={{ margin: '20px 0', paddingBottom: '20px', borderBottom: highContrast ? '1px solid var(--input-border)' : '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: highContrast ? 'var(--text-color)' : '#ffffff' }}>R$ {formatarPreco(99.9)}</span>
            <span style={{ color: highContrast ? 'var(--text-color)' : '#ffffff', opacity: 0.8 }}>/mês</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li style={{ color: highContrast ? 'var(--text-color)' : '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: highContrast ? 'var(--primary-color)' : '#fff', fontWeight:'bold' }}><Check size={16} /></span> Tudo do plano Plus</li>
            <li style={{ color: highContrast ? 'var(--text-color)' : '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: highContrast ? 'var(--primary-color)' : '#fff', fontWeight:'bold' }}><Check size={16} /></span> Interface Premium (Esmeralda)</li>
            <li style={{ color: highContrast ? 'var(--text-color)' : '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: highContrast ? 'var(--primary-color)' : '#fff', fontWeight:'bold' }}><Check size={16} /></span> Assistente de IA (Operações)</li>
            <li style={{ color: highContrast ? 'var(--text-color)' : '#ffffff', display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.7 }}><span style={{fontWeight:'bold'}}><X size={16} /></span> Assistente de IA Completa</li>
          </ul>
          
          {/* Renderização condicional: botão muda conforme estado do trial e plano atual */}
          {planoAtual === 'Pro' ? (
            isTrialAtivo ? (
              <button onClick={() => abrirCheckout('Pro', 99.9, '#10b981')} style={{ width: '100%', padding: '15px', fontWeight: 'bold', borderRadius: '8px', background: highContrast ? 'var(--primary-color)' : '#ffffff', color: highContrast ? 'var(--btn-text-color)' : 'var(--primary-color)', border: 'none', cursor: 'pointer', fontSize: '1.1rem', transition: 'opacity 0.2s', boxShadow: highContrast ? 'none' : '0 0 10px rgba(255,255,255,0.5)' }}>
                <Lock size={16} className="inline mr-1" /> Assinar PRO (Sair do Teste)
              </button>
            ) : (
              <button onClick={() => abrirCheckout('Pro', 99.9, '#10b981')} style={{ width: '100%', padding: '15px', fontWeight: 'bold', borderRadius: '8px', background: highContrast ? 'var(--primary-color)' : '#ffffff', color: highContrast ? 'var(--btn-text-color)' : 'var(--primary-color)', border: 'none', cursor: 'pointer', fontSize: '1.1rem', transition: 'opacity 0.2s' }}>
                ✨ Plano Atual (Gerenciar)
              </button>
            )
          ) : (
            !trialUsado ? (
              /* Botão de trial grátis (só aparece uma vez) */
              <button onClick={iniciarTestePro} style={{ width: '100%', padding: '15px', fontWeight: 'bold', borderRadius: '8px', background: highContrast ? 'var(--primary-color)' : '#ffffff', color: highContrast ? 'var(--btn-text-color)' : 'var(--primary-color)', border: 'none', cursor: 'pointer', fontSize: '1.1rem', transition: 'opacity 0.2s' }}>
                <Rocket size={16} className="inline mr-1" /> Iniciar Teste PRO
              </button>
            ) : (
              <button onClick={() => abrirCheckout('Pro', 99.9, '#10b981')} style={{ width: '100%', padding: '15px', fontWeight: 'bold', borderRadius: '8px', background: highContrast ? 'var(--primary-color)' : '#ffffff', color: highContrast ? 'var(--btn-text-color)' : 'var(--primary-color)', border: 'none', cursor: 'pointer', fontSize: '1.1rem', transition: 'opacity 0.2s' }}>
                Assinar PRO
              </button>
            )
          )}

        </article>

        {/* Plano Ultra */}
        <article className="card-gestalt" style={{ padding: '30px', background: 'var(--card-bg)', borderRadius: '16px', border: highContrast ? '2px solid var(--primary-color)' : 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem', color: highContrast ? 'var(--primary-color)' : '#8b5cf6' }}>Ultra</h3>
          <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '0.9rem', minHeight: '40px' }}>Para prefeituras e polos governamentais de larga escala.</p>
          <div style={{ margin: '20px 0', paddingBottom: '20px', borderBottom: '1px solid var(--input-border)' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: highContrast ? 'var(--text-color)' : '#8b5cf6' }}>R$ {formatarPreco(149.9)}</span>
            <span style={{ color: 'var(--text-color)', opacity: 0.7 }}>/mês</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: highContrast ? 'var(--primary-color)' : '#22c55e', fontWeight:'bold' }}><Check size={16} /></span> Tudo do plano Pro</li>
            <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: highContrast ? 'var(--primary-color)' : '#22c55e', fontWeight:'bold' }}><Check size={16} /></span> Interface Premium (Púrpura)</li>
            <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: highContrast ? 'var(--primary-color)' : '#22c55e', fontWeight:'bold' }}><Check size={16} /></span> Assistente de IA Completa</li>
            <li style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: highContrast ? 'var(--primary-color)' : '#22c55e', fontWeight:'bold' }}><Check size={16} /></span> Personalização Total nas Cores</li>
          </ul>
          <button 
            onClick={() => abrirCheckout('Ultra', 149.9, '#8b5cf6')} 
            style={{ width: '100%', padding: '15px', fontWeight: 'bold', borderRadius: '8px', background: highContrast ? 'var(--primary-color)' : '#8b5cf6', color: highContrast ? 'var(--btn-text-color)' : '#fff', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
          >
            {planoAtual === 'Ultra' ? '✨ Plano Atual (Gerenciar)' : 'Assinar Ultra'}
          </button>
        </article>

      </div>

      {/* Rodapé com garantia e métodos de pagamento aceitos */}
      <footer style={{ marginTop: '50px', textAlign: 'center', padding: '25px', background: 'var(--card-bg)', borderRadius: '12px', border: '2px solid var(--input-border)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <p style={{ color: 'var(--text-color)', fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 15px 0' }}>
          Garantia de Satisfação: Altere seu plano ou gerencie faturamento a qualquer momento sem burocracia.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <span style={{ background: highContrast ? 'var(--bg-color)' : '#ffffff', border: `2px solid ${highContrast ? 'var(--primary-color)' : '#cbd5e1'}`, padding: '8px 15px', borderRadius: '8px', color: 'var(--text-color)', fontWeight: 'bold', fontSize: '0.9rem' }}><CreditCard size={16} className="inline mr-1" /> Cartão de Crédito</span>
          <span style={{ background: highContrast ? 'var(--bg-color)' : '#ffffff', border: `2px solid ${highContrast ? 'var(--primary-color)' : '#cbd5e1'}`, padding: '8px 15px', borderRadius: '8px', color: 'var(--text-color)', fontWeight: 'bold', fontSize: '0.9rem' }}><FileText size={16} className="inline mr-1" /> Boleto Bancário</span>
          <span style={{ background: highContrast ? 'var(--bg-color)' : '#ffffff', border: `2px solid ${highContrast ? 'var(--primary-color)' : '#cbd5e1'}`, padding: '8px 15px', borderRadius: '8px', color: 'var(--text-color)', fontWeight: 'bold', fontSize: '0.9rem' }}><Diamond size={16} className="inline mr-1" /> Pix Instantâneo</span>
        </div>
      </footer>

      {/* Modal de Checkout (Overlay escuro sobre a tela) */}
      {checkoutPlano && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-gestalt" style={{ background: 'var(--card-bg)', width: '90%', maxWidth: '600px', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: highContrast ? '2px solid var(--primary-color)' : 'none' }}>
            
            {/* Cabeçalho do modal com cor do plano */}
            <header style={{ background: highContrast ? 'var(--primary-color)' : checkoutPlano.cor, color: highContrast ? 'var(--btn-text-color)' : '#fff', padding: '20px', position: 'relative' }}>
              <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'inherit' }}>Checkout: Plano {checkoutPlano.nome}</h2>
              <p style={{ margin: '5px 0 0 0', opacity: 0.9, color: 'inherit' }}>Total a pagar: R$ {checkoutPlano.preco.toFixed(2).replace('.', ',')} {cicloAnual ? '/ano' : '/mês'}</p>
              <button onClick={() => setCheckoutPlano(null)} style={{ position: 'absolute', top: '15px', right: '20px', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'inherit', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}><X size={20} /></button>
            </header>

            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Abas de seleção de método de pagamento */}
              <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid var(--input-border)', paddingBottom: '10px' }}>
                <button onClick={() => setMetodoPagamento('cartao')} style={{ flex: 1, padding: '10px', background: metodoPagamento === 'cartao' ? 'var(--primary-color)' : 'transparent', color: metodoPagamento === 'cartao' ? 'var(--btn-text-color)' : 'var(--text-color)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  <CreditCard size={16} className="inline mr-1" /> Cartão
                </button>
                <button onClick={() => setMetodoPagamento('pix')} style={{ flex: 1, padding: '10px', background: metodoPagamento === 'pix' ? 'var(--primary-color)' : 'transparent', color: metodoPagamento === 'pix' ? 'var(--btn-text-color)' : 'var(--text-color)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  <Diamond size={16} className="inline mr-1" /> Pix
                </button>
                <button onClick={() => setMetodoPagamento('boleto')} style={{ flex: 1, padding: '10px', background: metodoPagamento === 'boleto' ? 'var(--primary-color)' : 'transparent', color: metodoPagamento === 'boleto' ? 'var(--btn-text-color)' : 'var(--text-color)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  <FileText size={16} className="inline mr-1" /> Boleto
                </button>
              </div>

              {/* Formulário de cartão de crédito */}
              {metodoPagamento === 'cartao' && (
                <form onSubmit={finalizarCompra} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label htmlFor="num-cartao" style={{ fontWeight: 'bold', color: 'var(--text-color)', marginBottom: '8px', display: 'block' }}>Número do Cartão</label>
                    <input id="num-cartao" type="text" className="input-field" placeholder="0000 0000 0000 0000" value={numeroCartao} onChange={handleCartao} maxLength={19} required style={{ margin: 0 }} />
                  </div>
                  <div>
                    <label htmlFor="nome-cartao" style={{ fontWeight: 'bold', color: 'var(--text-color)', marginBottom: '8px', display: 'block' }}>Nome no Cartão</label>
                    <input id="nome-cartao" type="text" className="input-field" placeholder="NOME COMPLETO" value={nomeCartao} onChange={handleNome} required style={{ margin: 0 }} />
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label htmlFor="validade" style={{ fontWeight: 'bold', color: 'var(--text-color)', marginBottom: '8px', display: 'block' }}>Validade</label>
                      <input id="validade" type="text" className="input-field" placeholder="MM/AA" value={validade} onChange={handleValidade} maxLength={5} required style={{ margin: 0 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label htmlFor="cvv" style={{ fontWeight: 'bold', color: 'var(--text-color)', marginBottom: '8px', display: 'block' }}>CVV</label>
                      <input id="cvv" type="text" className="input-field" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} maxLength={3} required style={{ margin: 0 }} />
                    </div>
                  </div>
                  {/* Seletor de parcelas */}
                  <div>
                    <label htmlFor="parcelas" style={{ fontWeight: 'bold', color: 'var(--text-color)', marginBottom: '8px', display: 'block' }}>Parcelas</label>
                    <select id="parcelas" value={parcelas} onChange={(e) => setParcelas(Number(e.target.value))} style={{ width: '100%', padding: '14px', borderRadius: '8px', background: 'var(--card-bg)', color: 'var(--text-color)', border: '2px solid var(--input-border)', fontSize: '1rem' }}>
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                        <option key={n} value={n}>
                          {n}x de R$ {(checkoutPlano.preco / n).toFixed(2).replace('.', ',')}{n === 1 ? ' (à vista)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn-salvar" style={{ width: '100%', padding: '15px', fontWeight: 'bold', borderRadius: '8px', background: 'var(--primary-color)', color: 'var(--btn-text-color)', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>
                    Confirmar Pagamento
                  </button>
                </form>
              )}

              {/* Seção Pix: Exibe QR Code gerado via CSS e dados bancários simulados */}
              {metodoPagamento === 'pix' && (
                <div style={{ textAlign: 'center', padding: '10px' }}>
                  {/* QR Code simulado usando gradientes CSS para evitar dependência de imagens externas */}
                  <div style={{ background: '#f1f5f9', padding: '20px', borderRadius: '12px', border: '2px dashed #cbd5e1', marginBottom: '20px', display: 'inline-block' }}>
                    <div style={{ width: '150px', height: '150px', background: `repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #fff 25%, #fff 75%, #000 75%, #000)`, backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
                  </div>
                  {/* Painel com dados bancários fictícios para simulação segura */}
                  <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'left', fontSize: '0.9rem', color: '#0f172a' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#0f172a' }}><strong>Banco:</strong> INTER (077)</p>
                    <p style={{ margin: '0 0 5px 0', color: '#0f172a' }}><strong>Titular:</strong> Saulo Torres de Oliveira Assis | MEI</p>
                    {/* Chave Pix destacada com propriedade userSelect para facilitar cópia */}
                    <p style={{ margin: '0 0 5px 0', color: '#0f172a' }}><strong>Chave PIX (CNPJ):</strong> <span style={{ background: '#2563eb', color: '#fff', padding: '2px 6px', borderRadius: '4px', userSelect: 'all' }}>12.345.678/0001-90</span></p>
                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8, color: '#0f172a', marginTop: '10px' }}>* Dados bancários sensíveis gerados aleatoriamente por segurança no ambiente de simulação e repositório GitHub.</p>
                  </div>
                  <button onClick={finalizarCompra} className="btn-salvar" style={{ width: '100%', padding: '15px', fontSize: '1.1rem', fontWeight: 'bold', background: highContrast ? 'var(--primary-color)' : checkoutPlano.cor, color: highContrast ? 'var(--btn-text-color)' : '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '20px' }}>
                    <Lock size={16} className="inline mr-1" /> Confirmar Pagamento Seguro
                  </button>
                </div>
              )}

              {/* Seção Boleto: Exibe código de barras simulado e instruções de vencimento */}
              {metodoPagamento === 'boleto' && (
                <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                  <p style={{ margin: '0 0 20px 0', color: 'var(--text-color)', fontWeight: 'bold' }}>Seu boleto foi gerado com sucesso!</p>
                  {/* Representação visual do código de barras para fins de demonstração */}
                  <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', wordBreak: 'break-all', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '2px', color: '#334155' }}>
                    34191.09008 61714.234567 89012.345678 9 12345678901234
                  </div>
                  <p style={{ margin: '15px 0', fontSize: '0.85rem', color: 'var(--text-color)', opacity: 0.8 }}>Vencimento em 3 dias úteis. A liberação do plano pode levar até 48 hours após o pagamento.</p>
                  <button onClick={finalizarCompra} className="btn-salvar" style={{ width: '100%', padding: '15px', fontSize: '1.1rem', fontWeight: 'bold', background: highContrast ? 'var(--primary-color)' : checkoutPlano.cor, color: highContrast ? 'var(--btn-text-color)' : '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>
                    <Lock size={16} className="inline mr-1" /> Confirmar Pagamento Seguro
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default SubscriptionPlans;