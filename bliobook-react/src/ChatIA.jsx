/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Volume2, VolumeX, CircleDot, Lock, Hourglass, Send } from 'lucide-react';

const ChatIA = ({ plano, onPlanos }) => {
    // Controle de estado: abre/fecha o chat, texto digitado, loading e áudio
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [falarAtivo, setFalarAtivo] = useState(false);
    
    // Referências para manipulação do DOM e scroll automático
    const inputRef = useRef(null);
    const mensagensFimRef = useRef(null);
    const chatPanelRef = useRef(null);

    // Mensagem de boas-vindas padrão
    const msgInicial = { role: 'ia', text: 'Olá! Sou a Assistente do BlioBook. Como posso facilitar sua rotina na biblioteca hoje?' };

    // Carrega histórico salvo no sessionStorage ou inicia com a msg inicial
    const [mensagens, setMensagens] = useState(() => {
        const chatSalvo = sessionStorage.getItem('bliobook_chat');
        return chatSalvo ? JSON.parse(chatSalvo) : [msgInicial];
    });

    // Garante que as vozes do navegador estejam prontas ao iniciar
    useEffect(() => { window.speechSynthesis.getVoices(); }, []);

    // Salva o histórico a cada mudança e rola a tela para a última mensagem
    useEffect(() => {
        sessionStorage.setItem('bliobook_chat', JSON.stringify(mensagens));
        mensagensFimRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensagens]);

    // Fecha o chat se clicar fora da janela
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatPanelRef.current && !chatPanelRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    // Função de síntese de voz (TTS) reutilizável
    const falarMensagem = useCallback((texto) => {
        if (!falarAtivo) return;
        window.speechSynthesis.cancel(); // Para falas anteriores
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.05;
        
        // Tenta selecionar uma voz feminina em PT-BR (Google, Luciana, etc.)
        const vozes = window.speechSynthesis.getVoices();
        const vozFeminina = vozes.find(v => v.lang.includes('pt-BR') && (v.name.includes('Google') || v.name.includes('Luciana') || v.name.includes('Feminina') || v.name.includes('Maria') || v.name.includes('Vitoria'))) || vozes.find(v => v.lang.includes('pt-BR'));
        
        if (vozFeminina) utterance.voice = vozFeminina;
        window.speechSynthesis.speak(utterance);
    }, [falarAtivo]);

    // Dispara a fala da primeira mensagem se o áudio estiver ativo
    useEffect(() => {
        if (falarAtivo && mensagens.length === 1) falarMensagem(mensagens[0].text);
        else if (!falarAtivo) window.speechSynthesis.cancel();
    }, [falarAtivo, mensagens, falarMensagem]);

    // Limpa o histórico e reseta o estado
    const limparConversa = () => {
        if (window.confirm("Deseja apagar todo o histórico desta conversa?")) {
            setMensagens([msgInicial]);
            sessionStorage.removeItem('bliobook_chat');
            window.speechSynthesis.cancel();
            inputRef.current?.focus();
        }
    };

    // Envia mensagem para o backend Python (api_ia.py)
    const enviarMensagem = async () => {
        if (!input.trim()) return;
        const textoUsuario = input;
        
        setMensagens(prev => [...prev, { role: 'user', text: textoUsuario }]);
        setInput('');
        setCarregando(true);

        try {
            // Pega o acervo atual do localStorage para enviar contexto à IA
            const l = localStorage.getItem('bliobook_livros');
            const acervoAtual = l ? JSON.parse(l) : [];

            // Requisição POST para o backend local
            const response = await fetch('http://127.0.0.1:8000/chat', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    mensagem: textoUsuario, 
                    plano: plano,
                    acervo: acervoAtual 
                })
            });
            const data = await response.json();
            
            // Se a IA sugeriu mudanças no acervo, atualiza o localStorage
            if (data.novo_acervo) {
                localStorage.setItem('bliobook_livros', JSON.stringify(data.novo_acervo));
                window.dispatchEvent(new Event('atualizarAcervoEvent'));
            }

            // Adiciona resposta da IA e fala o texto se necessário
            setMensagens(prev => [...prev, { role: 'ia', text: data.resposta }]);
            falarMensagem(data.resposta);

        } catch (error) {
            console.error("Falha no serviço de IA detectada:", error);
            // Mensagem de erro amigável caso o backend esteja offline
            const erroMsg = 'Meus servidores neurais estão isolados no momento. Verifique se o backend Python (api_ia.py) está rodando.';
            setMensagens(prev => [...prev, { role: 'ia', text: erroMsg }]);
            falarMensagem(erroMsg);
        } finally {
            setCarregando(false);
            setTimeout(() => inputRef.current?.focus(), 50); 
        }
    };

    // Foca no input automaticamente ao abrir o chat
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 100);
    }, [open]);

    return (
        <div ref={chatPanelRef}>
            {/* Botão flutuante para abrir/fechar o chat */}
            <button 
                className="chat-bubble" onClick={() => setOpen(!open)} 
                aria-label={open ? "Recolher Assistente" : "Expandir Assistente"}
                style={{ position: 'fixed', bottom: '15px', right: '15px', background: 'var(--primary-color)', color: '#ffffff', width: '3em', height: '3em', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', fontSize: '1.5em', zIndex: 1000, border: 'none' }}
            >
                <Bot size={28} className="sm:hidden" />
                <Bot size={36} className="hidden sm:block" />
            </button>
            
            {/* Janela do chat (renderizada condicionalmente) */}
            {open && (
                <section 
                    aria-label="Janela de interação"
                    className="w-[calc(100vw-1rem)] sm:w-96"
                    style={{ position: 'fixed', bottom: '4.5em', right: '0.5em', maxWidth: '90vw', height: '28em', maxHeight: '70vh', background: 'var(--card-bg)', border: '2px solid var(--primary-color)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                    <header style={{ background: 'var(--primary-color)', color: '#ffffff', padding: '0.8em', display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '8px' }}>
                        {/* Toggle de áudio */}
                        <button 
                            onClick={() => setFalarAtivo(!falarAtivo)}
                            style={{ background: falarAtivo ? '#16a34a' : 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff', borderRadius: '6px', padding: '0.3em 0.6em', cursor: 'pointer', fontSize: '0.8em', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            {falarAtivo ? <><Volume2 size={14} /> On</> : <><VolumeX size={14} /> Off</>}
                        </button>
                        
                        <div style={{ textAlign: 'center' }}>
                            <h4 style={{ margin: 0, fontSize: '0.95em', color: 'inherit' }}>Assistente BlioBook</h4>
                            <span style={{ fontSize: '0.75em', opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                <CircleDot size={10} /> Operacional
                            </span>
                        </div>

                        <button className="btn-excluir" onClick={limparConversa} style={{ padding: '0.3em 0.6em', fontSize: '0.8em', margin: 0 }}>Limpar</button>
                    </header>

                    {/* Bloqueio para usuários Free */}
                    {plano === 'Free' ? (
                        <div style={{ flex: 1, padding: '1.5em', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--card-bg)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
                                <Lock size={56} />
                            </div>
                            <h3 style={{ color: 'var(--text-color)', margin: '0 0 10px 0', fontSize: '1rem' }}>Recurso Premium</h3>
                            <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '0.85rem', marginBottom: '20px' }}>O Assistente requer o plano Plus ou superior.</p>
                            <button onClick={onPlanos} className="btn-salvar" style={{ background: 'var(--primary-color)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '0.9rem' }}>Fazer Upgrade</button>
                        </div>
                    ) : (
                        <>
                            {/* Área de mensagens com scroll */}
                            <div aria-live="polite" style={{ flex: 1, padding: '1em', overflowY: 'auto', background: 'var(--card-bg)' }}>
                                {mensagens.map((msg, idx) => (
                                    <div key={idx} style={{ marginBottom: '0.8em', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                                        <div style={{ display: 'inline-block', background: msg.role === 'user' ? 'var(--primary-color)' : 'transparent', color: msg.role === 'user' ? '#ffffff' : 'var(--text-color)', border: msg.role === 'ia' ? '2px solid var(--input-border)' : 'none', padding: '0.6em 1em', borderRadius: '1em', maxWidth: '85%', wordWrap: 'break-word', fontSize: '0.9em', whiteSpace: 'pre-wrap', textAlign: 'left' }}
                                        >{msg.text}</div>
                                    </div>
                                ))}
                                {/* Indicador de "digitando..." */}
                                {carregando && (
                                    <div style={{ textAlign: 'left', marginBottom: '0.6em' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'transparent', border: '2px solid var(--input-border)', color: 'var(--text-color)', padding: '0.5em 0.8em', borderRadius: '1em', fontSize: '0.85em', fontStyle: 'italic' }}>
                                            <Hourglass size={14} /> Processando...
                                        </div>
                                    </div>
                                )}
                                <div ref={mensagensFimRef} />
                            </div>

                            {/* Campo de input e botão de envio */}
                            <div style={{ padding: '0.8em', borderTop: '1px solid var(--input-border)', display: 'flex', gap: '0.5em', background: 'var(--card-bg)' }}>
                                <input 
                                    type="text" className="input-field" placeholder="Escreva aqui..." ref={inputRef} autoFocus
                                    value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()} disabled={carregando}
                                    style={{ margin: 0, flex: 1, fontSize: '0.9em' }}
                                />
                                <button className="btn-salvar" onClick={enviarMensagem} disabled={carregando} style={{ background: 'var(--primary-color)', color: '#fff', border: 'none', padding: '0 1.2em', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {carregando ? <Hourglass size={18} /> : <Send size={18} />}
                                </button>
                            </div>
                        </>
                    )}
                </section>
            )}
        </div>
    );
};

export default ChatIA;