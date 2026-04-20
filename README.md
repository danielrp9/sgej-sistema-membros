# SGEJ - Sistema de Gestão de Membros (Next Step)

Este repositório contém a estrutura de base e a definição arquitetural do projeto **SGEJ**. O sistema foi projetado com foco em modularidade e baixo acoplamento para atender às necessidades administrativas da Empresa Júnior Next Step.

---

## 📖 Planejamento e Requisitos
O desenvolvimento deve seguir rigorosamente as definições de escopo, requisitos e prazos estabelecidos no documento oficial:

🔗 **[Documentação de Planejamento - SGEJ](https://docs.google.com/document/d/14teAC9Jj0b7DuvPrz9Gvkcus6u6x3SBbAkhFD1yD9WE/edit?tab=t.ofokqh99pp4o)**

---

## 🏗️ Arquitetura do Sistema

O projeto utiliza uma **Arquitetura Desacoplada**:
* **Backend (Python/Django):** Organizado em módulos independentes (`apps`) para isolar a lógica de negócio.
* **Frontend (React/Vite/TS):** Estruturado por domínios que espelham o backend, consumindo a API via Axios.

---

## 📂 Estrutura de Pastas

```text
sgej-sistema-membros/
├── backend/                  # Django REST Framework
│   ├── core/                 # Configurações globais e JWT
│   ├── apps/                 # Módulos (accounts, members, history, certificates)
│   ├── venv/                 # Ambiente Virtual (não enviado ao Git)
│   └── requirements.txt
├── frontend/                 # React + TypeScript
└── docs/                     # Especificações e manuais
```

---

## 🚀 Como Rodar o Projeto

### 1. Backend (Django)
Para garantir que as bibliotecas não conflitem com o sistema, **sempre utilize o ambiente virtual**.

```bash
cd backend

# Criar o ambiente virtual (se ainda não existir)
python -m venv venv

# Ativar o ambiente virtual
# No Linux/macOS:
source venv/bin/activate
# No Windows:
.\venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Aplicar migrações do banco de dados
python manage.py migrate

# Iniciar o servidor
python manage.py runserver
```
*Acesse a documentação da API em: `http://localhost:8000/api/docs/`*

### 2. Frontend (React)
```bash
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```
*Acesse o sistema em: `http://localhost:5173` (ou a porta indicada no terminal)*

---

## 🛠️ Guia de Desenvolvimento

* **Carlos (Back):** Use a pasta `apps/` para novos módulos. Mantenha os `Serializers` atualizados para o contrato da API.
* **Daniel (Front):** Seguir o padrão institucional. Toda chamada de API deve usar a instância central em `services/api.ts`.

---

## 📅 Marcos e Prazos
* **Entrega da 1ª Parte:** 11 de Maio.
* **Status:** Estrutura base concluída. Iniciando CRUD de membros.

---
