/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import ForgotPassword from './ForgotPassword';
import ProfileSettings from './ProfileSettings';
import SubscriptionPlans from './SubscriptionPlans';
import A11yWidget from './A11yWidget';
import Register from './Register';
import { useA11y } from './A11yContext';

function App() {
  const { highContrast } = useA11y();

  // Decide qual tela mostrar ao abrir o app, checando sessão e rota salva
  const [tela, setTela] = useState(() => {
    const logado = localStorage.getItem('bliobook_logado');
    const telaSalva = sessionStorage.getItem('bliobook_tela_atual');
    
    if (logado === 'sim') {
      // Se está logado, vai pro dashboard ou pra tela que estava antes
      if (telaSalva && telaSalva !== 'login' && telaSalva !== 'register') {
        return telaSalva;
      }
      return 'dashboard';
    } else {
      // Se não está logado, pode estar na recuperação de senha ou cadastro
      if (telaSalva === 'forgot') return 'forgot';
      if (telaSalva === 'register') return 'register';
      return 'login';
    }
  });

  // Troca de tela salvando a rota atual no sessionStorage
  const mudarTela = (novaTela) => {
    setTela(novaTela);
    sessionStorage.setItem('bliobook_tela_atual', novaTela);
  };

  // Aplica a cor primária conforme o plano e o tema customizado (Ultra)
  useEffect(() => {
    const aplicarTemasECores = () => {
      if (highContrast) return; // Alto contraste ignora cores personalizadas
      
      const plano = localStorage.getItem('bliobook_plano') || 'Free';
      const temaPersonalizado = localStorage.getItem('bliobook_tema_ultra');
      
      // Cada plano tem sua cor principal padrão
      let corPrimaria = '#1d4ed8'; 
      if (plano === 'Plus') corPrimaria = '#0ea5e9';
      if (plano === 'Pro') corPrimaria = '#10b981';
      if (plano === 'Ultra') corPrimaria = temaPersonalizado || '#8b5cf6';
      
      document.documentElement.style.setProperty('--primary-color', corPrimaria);
      
      // Reseta as variáveis de tema pra não conflitar com o contraste
      document.documentElement.style.removeProperty('--bg-color');
      document.documentElement.style.removeProperty('--text-color');
      document.documentElement.style.removeProperty('--card-bg');
      document.documentElement.style.removeProperty('--btn-text-color');
    };

    aplicarTemasECores();
    window.addEventListener('storage', aplicarTemasECores);
    return () => window.removeEventListener('storage', aplicarTemasECores);
  }, [highContrast, tela]);

  // Login: marca sessão e redireciona (pra perfil se tiver senha temporária)
  const fazerLogin = () => {
    localStorage.setItem('bliobook_logado', 'sim');
    if (localStorage.getItem('bliobook_senha_temporaria') === 'sim') {
      mudarTela('perfil');
    } else {
      mudarTela('dashboard');
    }
  };

  // Logout: limpa tudo que é de sessão e volta pro login
  const fazerLogout = () => {
    localStorage.removeItem('bliobook_logado');
    sessionStorage.removeItem('bliobook_tela_atual');
    sessionStorage.removeItem('bliobook_chat');
    mudarTela('login');
  };

  return (
    <div className={`app-root ${highContrast ? 'high-contrast' : ''}`}>
      <A11yWidget />
      <div className="main-content">
        {/* Roteamento manual baseado no estado de tela */}
        {tela === 'login' && <Login onEntrar={fazerLogin} onEsqueci={() => mudarTela('forgot')} onCriarConta={() => mudarTela('register')} />}
        {tela === 'register' && <Register onCadastrado={() => mudarTela('login')} onVoltar={() => mudarTela('login')} />}
        {tela === 'forgot' && <ForgotPassword onVoltar={() => mudarTela('login')} />}
        {tela === 'dashboard' && <Dashboard onSair={fazerLogout} onPerfil={() => mudarTela('perfil')} onPlanos={() => mudarTela('planos')} />}
        {tela === 'perfil' && <ProfileSettings onVoltar={() => mudarTela('dashboard')} onPlanos={() => mudarTela('planos')} />}
        {tela === 'planos' && <SubscriptionPlans onVoltar={() => mudarTela('dashboard')} />}
      </div>
    </div>
  );
}

export default App;