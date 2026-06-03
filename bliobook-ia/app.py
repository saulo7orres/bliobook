# Faculdade: Faculdade Alpha
# Curso: Análise e Desenvolvimento de Sistemas
# Aluno: Saulo Torres de Oliveira Assis
# Professora: Tarciana Maria de Sena Katter
# Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento

import streamlit as st
import urllib.request
import json

def fazer_requisicao_local(url: str, payload: dict = None):
    """
    Encapsula a camada de rede para comunicação com o microserviço cognitivo.
    A escolha da biblioteca urllib padrão reduz dependências e mantém o fallback 
    seguro para não quebrar a UI em caso de timeout do backend.
    """
    try:
        req = urllib.request.Request(
            url, 
            data=json.dumps(payload).encode('utf-8') if payload else None, 
            method="POST"
        )
        req.add_header('Content-Type', 'application/json')
        
        with urllib.request.urlopen(req) as response:
            if response.status in [200, 201]:
                return json.loads(response.read())
            else:
                return {"resposta": "Erro interno no processamento.", "refresh": False}
                
    except Exception:
        return {"resposta": "Servidor cognitivo isolado. Certifique-se de que o api_ia.py está rodando na porta 8000.", "refresh": False}

st.set_page_config(page_title="Assistente BlioBook", layout="centered")

# Painel lateral: injeção de variáveis de estado para a simulação do ambiente
with st.sidebar:
    st.markdown("### Ambiente de Simulação")
    
    # Seletor de Paywall. A regra restritiva de negócio é aplicada no renderizador de input abaixo.
    plano_selecionado = st.selectbox("Nível de Acesso (Paywall)", ["Free", "Plus", "Pro", "Ultra"], index=3)
    
    # Limpa o cache da sessão, útil para resetar o ciclo de vida dos testes de CRUD do zero.
    if st.button("Limpar Memória do Acervo"):
        st.session_state.clear()
        st.rerun()

st.markdown("<h2 style='text-align: center; color: #007bff;'>Assistente BlioBook</h2>", unsafe_allow_html=True)
st.markdown("<p style='text-align: center; color: #666;'>Terminal de Validação e Testes de IA</p>", unsafe_allow_html=True)
st.divider()

# Hidratação do estado reativo: garante a integridade da chave do histórico antes do primeiro render.
if "historico" not in st.session_state:
    st.session_state.historico = [{"role": "assistant", "content": "Olá! Sou a Assistente do BlioBook. Como posso facilitar sua rotina na biblioteca hoje?"}]

# Banco de dados temporário em memória (Mock).
# Atua como fonte da verdade (Read) e base de mutação (Update/Delete) para refletir 
# as operações da IA localmente, simulando a persistência de LocalStorage do React.
if "acervo_mock" not in st.session_state:
    st.session_state.acervo_mock = [
        {"id": 1, "titulo": "A Arte da Guerra", "autores": [{"nome": "Sun Tzu"}], "categoria": {"nome": "Estratégia"}, "situacao": "Não Disponível"},
        {"id": 2, "titulo": "Dom Quixote", "autores": [{"nome": "Miguel de Cervantes"}], "categoria": {"nome": "Aventura"}, "situacao": "Emprestado"},
        {"id": 3, "titulo": "O Peregrino", "autores": [{"nome": "John Bunyan"}], "categoria": {"nome": "Ficção"}, "situacao": "Disponível"},
        {"id": 4, "titulo": "Vidas Secas", "autores": [{"nome": "Graciliano Ramos"}], "categoria": {"nome": "Regionalismo"}, "situacao": "Não Disponível"},
        {"id": 5, "titulo": "Memórias Póstumas de Brás Cubas", "autores": [{"nome": "Machado de Assis"}], "categoria": {"nome": "Realismo"}, "situacao": "Disponível"},
        {"id": 6, "titulo": "Dom Casmurro", "autores": [{"nome": "Machado de Assis"}], "categoria": {"nome": "Romance"}, "situacao": "Emprestado"},
    ]

# Reconstrói a árvore visual da conversa baseando-se na persistência global da sessão.
for msg in st.session_state.historico:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# Trava de segurança da interface: acusa visualmente a restrição definida na sidebar.
if plano_selecionado == "Free":
    st.error("🔒 Recurso Premium: O Assistente requer o plano Plus ou superior para funcionar.")

# Ponto de entrada de dados. O estado 'disabled' é reativo e bloqueia interações não autorizadas.
if prompt := st.chat_input("Escreva aqui...", disabled=(plano_selecionado == "Free")):
    
    # 1. Registra a intenção do usuário na memória e projeta na UI imediatamente.
    st.session_state.historico.append({"role": "user", "content": prompt})
    with st.chat_message("user"): 
        st.markdown(prompt)

    # 2. Orquestra a delegação do processamento para a API FastAPI.
    with st.chat_message("assistant"):
        with st.spinner("Analisando intenção..."):
            
            # Empacota o contexto total (mensagem + regra de negócio + estado do banco) 
            # para fornecer ao motor cognitivo a visão sistêmica necessária para decidir a operação.
            payload = {
                "mensagem": prompt, 
                "plano": plano_selecionado, 
                "acervo": st.session_state.acervo_mock
            }
            
            resultado_api = fazer_requisicao_local("http://127.0.0.1:8000/chat", payload)
            
            resposta_final = resultado_api.get("resposta", "Falha de comunicação entre microserviços.")
            st.markdown(resposta_final)
            
            st.session_state.historico.append({"role": "assistant", "content": resposta_final})
            
            # Ponto crítico de Sincronização: se a IA executou uma mutação de dados validada (CRUD), 
            # ela devolve a lista atualizada e nós sobrescrevemos o estado local.
            if resultado_api.get("novo_acervo"):
                st.session_state.acervo_mock = resultado_api["novo_acervo"]