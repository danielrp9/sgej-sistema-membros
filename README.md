# SGEJ - Sistema de Gestão de Membros

O **SGEJ** é um sistema corporativo projetado para o controle administrativo, histórico e documental de membros de empresas juniores. O sistema gerencia o ciclo de vida completo de cada colaborador, desde o ingresso até o desligamento, calculando automaticamente as horas acumuladas, registrando sanções disciplinares e intermediando um fluxo de co-assinatura coletiva para a emissão de certificados oficiais.

A aplicação é estruturada sob uma arquitetura desacoplada, composta por uma API REST robusta e uma interface de usuário moderna e responsiva.

---

## 🛠️ Arquitetura e Tecnologias

### Backend
* **Python 3.10+ / Django 5.0**: Framework principal de desenvolvimento.
* **Django REST Framework (DRF)**: Construção e disponibilização de endpoints REST sob contratos seguros.
* **SimpleJWT**: Mecanismo de autenticação stateless baseado em tokens de acesso e refresh JWT.
* **SQLite**: Banco de dados relacional leve utilizado para persistência local e desenvolvimento.
* **drf-spectacular**: Geração automática de esquema OpenAPI 3 e documentação interativa de rotas.

### Frontend
* **React 18 / JavaScript (Vite)**: Biblioteca de interface com inicialização e renderização otimizadas.
* **Tailwind CSS**: Estilização utilitária de alta fidelidade e design system responsivo.
* **Lucide React**: Biblioteca de ícones vetoriais leves e consistentes.
* **React Router DOM**: Mecanismo de roteamento dinâmico e controle de fluxos de navegação restritos.
* **React-PDF (@react-pdf/renderer)**: Geração e visualização dinâmica de rascunhos e certificados oficiais diretamente no navegador.

---

## 📂 Estrutura do Repositório

```text
sgej-sistema-membros/
├── backend/                  # API REST em Django
│   ├── core/                 # Configurações globais, roteamento de URLs e autenticação JWT
│   ├── apps/                 # Módulos independentes de lógica de negócios
│   │   ├── accounts/         # Gerenciamento de credenciais de usuários e níveis de acesso (RBAC)
│   │   ├── members/          # Cadastro de membros, rotinas de suspensão e encerramento de serviço
│   │   ├── history/          # Histórico operacional e registros de ciclos de atividades dos membros
│   │   └── certificates/     # Cadastro de certificados oficiais e controle do fluxo de assinaturas
│   ├── requirements.txt      # Especificação das dependências Python
│   └── manage.py             # Utilitário CLI do Django
├── frontend/                 # Aplicação SPA
│   ├── src/
│   │   ├── assets/           # Imagens, logotipos e fontes utilizadas na identidade visual
│   │   ├── components/       # Componentes compartilhados da interface (Layout, Sidebar, Modais)
│   │   ├── pages/            # Telas da aplicação (Dashboard, Members, Certificates, Auth)
│   │   └── services/         # Integrações HTTP via Axios com a API REST do backend
│   ├── tailwind.config.js    # Arquivo de configuração de tokens e temas do Tailwind CSS
│   ├── vite.config.ts        # Configurações do compilador e empacotador Vite
│   └── package.json          # Script de automação e dependências JavaScript
└── README.md                 # Documentação técnica de introdução e guia de execução
```

---

## ⚙️ Principais Funcionalidades

### 1. Autenticação e Controle de Acesso (RBAC)
* Sistema estruturado em níveis de permissão com base nos cargos institucionais (Presidente, Diretor de RH, Orientador e Coordenador).
* Proteção e bloqueio de rotas internas no frontend com validação contínua de tokens JWT armazenados.

### 2. Painel de Monitoramento (Dashboard)
* Sumarização de dados contendo o número total de membros ativos, desligados e suspensos.
* Painel indicador do ano corrente com monitoramento do progresso das assinaturas coletadas e cálculo percentual da taxa de conclusão dos certificados gerados.

### 3. Gerenciamento do Ciclo de Vida de Membros
* Operações de CRUD para registro completo de dados cadastrais dos membros.
* Separação em abas dinâmicas baseadas nos estados funcionais (Ativos, Desligados e Suspensos) com busca integrada.
* Histórico cronológico individualizado detalhando as movimentações no sistema.
* Cadastro de sanções disciplinares e justificativa de suspensões operacionais, que bloqueiam automaticamente a elegibilidade de emissão de certificados oficiais.
* Rotina automática de desligamento que calcula a carga horária final baseada em 6 horas semanais a partir da admissão registrada.

### 4. Central de Auditoria e Assinaturas
* Fila de rascunhos de certificados no aguardo de assinaturas.
* Linha do tempo visual detalhando o fluxo de aprovação cumulativo (Coordenação, Diretoria de RH e Presidência).
* Validação automática em lote por meio de assinatura digital com um clique, identificando o cargo e autoridade do usuário autenticado no sistema.

### 5. Histórico e Validação Pública
* Arquivo histórico centralizado com listagem de certificados emitidos e assinados em sua totalidade.
* Registro de hash de autenticação criptográfica exclusivo para verificação e integridade dos documentos.
* Página pública de validação instantânea acessível por meio da inserção da hash ou leitura do QR Code correspondente.

---

## 🚀 Como Executar o Sistema

### Pré-requisitos
* **Python 3.10+** instalado no sistema.
* **Node.js (LTS)** e gerenciador de pacotes **npm** configurados no ambiente.

### 1. Configurando e Executando o Backend (Django)

1. Acesse o diretório do backend:
   ```bash
   cd backend
   ```

2. Crie um ambiente virtual para isolar as dependências:
   ```bash
   python -m venv venv
   ```

3. Ative o ambiente virtual:
   * **Linux / macOS**:
     ```bash
     source venv/bin/activate
     ```
   * **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   * **Windows (CMD)**:
     ```cmd
     .\venv\Scripts\activate.bat
     ```

4. Instale as dependências Python necessárias:
   ```bash
   pip install -r requirements.txt
   ```

5. Aplique as migrações para inicializar a estrutura do banco de dados (SQLite):
   ```bash
   python manage.py migrate
   ```

6. *(Opcional)* Crie uma credencial de superusuário administrador para acessar a interface do Django Admin:
   ```bash
   python manage.py createsuperuser
   ```

7. Inicie o servidor HTTP local de desenvolvimento:
   ```bash
   python manage.py runserver
   ```
   A APIREST estará disponível na porta `http://127.0.0.1:8000/`. A documentação OpenAPI interativa das rotas pode ser visualizada em `http://127.0.0.1:8000/api/docs/`.

---

### 2. Configurando e Executando o Frontend (React + Vite)

1. Abra uma nova aba no terminal, acesse a pasta raiz e mude para o diretório do frontend:
   ```bash
   cd frontend
   ```

2. Instale os módulos JavaScript definidos no projeto:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação no navegador web no endereço fornecido pelo console, por padrão:
   `http://localhost:5173/`

---

## 🔗 Documentação Adicional
* **[Documentação de Planejamento - SGEJ](https://docs.google.com/document/d/14teAC9Jj0b7DuvPrz9Gvkcus6u6x3SBbAkhFD1yD9WE/edit?tab=t.ofokqh99pp4o)**
