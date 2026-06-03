/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { useState, useEffect, useRef } from 'react';
import { useA11y } from './A11yContext';
import { Accessibility, SunMoon, Minus, Plus, Volume2, VolumeX } from 'lucide-react';

const A11yWidget = () => {
  // Pega as funções de contexto para controle de contraste e fonte
  const { highContrast, toggleHighContrast, fontSize, increaseFontSize, decreaseFontSize } = useA11y();
  
  // Controla se o menu flutuante está aberto ou fechado
  const [menuAberto, setMenuAberto] = useState(false);
  // Controla se o leitor de tela (TTS) está ativo
  const [leitorAtivo, setLeitorAtivo] = useState(false);
  
  // Referência para detectar cliques fora do widget e fechar o menu
  const widgetRef = useRef(null);

  // Fecha o menu se clicar fora da área do widget
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setMenuAberto(false);
      }
    };
    if (menuAberto) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuAberto]);

  // Aplica o tamanho da fonte globalmente no documento
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // Carrega o plugin VLibras (governo) apenas uma vez ao montar o componente
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      if (window.VLibras) new window.VLibras.Widget('https://vlibras.gov.br/app');
    };
    document.body.appendChild(script);
  }, []);

  // Garante que as vozes do navegador estejam carregadas antes de tentar usar
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  // Lógica principal do leitor de tela: lê o texto ao passar o mouse ou focar
  useEffect(() => {
    const lerElemento = (e) => {
      if (!leitorAtivo) return;
      const target = e.target;
      // Tenta pegar o texto de vários atributos possíveis (aria-label, title, innerText, value)
      const texto = target.getAttribute('aria-label') || target.title || target.innerText || target.value;
      
      if (texto && texto.trim().length > 0) {
        window.speechSynthesis.cancel(); // Para qualquer fala anterior
        
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.05; // Velocidade ligeiramente mais rápida
        
        // Tenta encontrar uma voz feminina em português (Google, Luciana, etc.)
        const vozes = window.speechSynthesis.getVoices();
        const vozFeminina = vozes.find(v => v.lang.includes('pt-BR') && (v.name.includes('Google') || v.name.includes('Luciana') || v.name.includes('Feminina') || v.name.includes('Maria') || v.name.includes('Vitoria'))) || vozes.find(v => v.lang.includes('pt-BR'));
        
        if (vozFeminina) utterance.voice = vozFeminina;
        
        window.speechSynthesis.speak(utterance);
      }
    };

    if (leitorAtivo) {
      window.addEventListener('mouseover', lerElemento);
      window.addEventListener('focusin', lerElemento);
    }

    // Limpeza: remove os listeners e cancela a fala ao desmontar ou desativar
    return () => {
      window.removeEventListener('mouseover', lerElemento);
      window.removeEventListener('focusin', lerElemento);
      window.speechSynthesis.cancel();
    };
  }, [leitorAtivo]);

  return (
    <div ref={widgetRef} style={{ position: 'fixed', left: '15px', bottom: '15px', zIndex: 9999 }}>
      {/* Botão principal flutuante */}
      <button 
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Abrir painel de acessibilidade universal"
        title="Opções de Acessibilidade"
        style={{ background: '#2563eb', color: '#ffffff', border: 'none', width: '3em', height: '3em', borderRadius: '50%', cursor: 'pointer', fontSize: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Accessibility size={24} />
      </button>

      {/* Painel de controles (renderizado apenas se menuAberto for true) */}
      {menuAberto && (
        <nav 
          aria-label="Barra de ferramentas de acessibilidade"
          style={{ position: 'absolute', bottom: '4em', left: '0', background: 'var(--card-bg)', border: '2px solid var(--primary-color)', padding: '12px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', width: '230px', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          {/* Seção: Contraste Visual */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--primary-color)' }}>Contraste Visual</span>
            <button 
              onClick={toggleHighContrast}
              aria-pressed={highContrast}
              aria-label="Alternar modo de alto contraste para baixa visão"
              title="Ativar cores de alto contraste"
              style={{ background: highContrast ? '#eab308' : '#1e293b', color: highContrast ? '#000000' : '#ffffff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <SunMoon size={16} /> {highContrast ? 'Desativar' : 'Ativar Contraste'}
            </button>
          </div>

          {/* Seção: Ajuste de Tipografia */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--primary-color)' }}>Ajuste de Tipografia</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={decreaseFontSize}
                aria-label="Diminuir tamanho da letra do sistema"
                title="Reduzir o tamanho das fontes"
                style={{ flex: 1, background: '#0284c7', color: '#ffffff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              ><Minus size={14} /> A</button>
              <button 
                onClick={increaseFontSize}
                aria-label="Aumentar tamanho da letra do sistema"
                title="Ampliar o tamanho das fontes"
                style={{ flex: 1, background: '#1d4ed8', color: '#ffffff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              ><Plus size={14} /> A</button>
            </div>
          </div>

          {/* Seção: Leitura de Tela */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--primary-color)' }}>Leitura de Tela</span>
            <button 
              onClick={() => setLeitorAtivo(!leitorAtivo)}
              aria-label={leitorAtivo ? "Desativar Leitor de Tela em Áudio" : "Ativar Leitor de Tela em Áudio"}
              title="Ativar ou desativar o leitor de tela por voz"
              style={{ background: leitorAtivo ? '#16a34a' : '#475569', color: '#ffffff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              {leitorAtivo ? <><Volume2 size={16} /> Leitor Ativo</> : <><VolumeX size={16} /> Ativar Leitor</>}
            </button>
          </div>
        </nav>
      )}

      {/* Container para o widget VLibras (aparece na parte inferior) */}
      <div vw="true" className="enabled">
        <div vw-access-button="true" className="active"></div>
        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>
    </div>
  );
};

export default A11yWidget;