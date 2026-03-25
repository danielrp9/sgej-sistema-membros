# SGEJ - Sistema de Membros

Este repositório contém a estrutura de base (boilerplate) e a definição arquitetural do projeto **SGEJ**. O objetivo desta etapa é estabelecer a organização de diretórios e o fluxo de trabalho antes do desenvolvimento das funcionalidades.

---

## 🏗️ Arquitetura do Sistema

O sistema adota uma **Arquitetura Desacoplada**, separando as responsabilidades de processamento de dados e interface do usuário em dois núcleos principais:

* **Backend:** Responsável pela lógica de negócio, persistência de dados e fornecimento de APIs.
* **Frontend:** Responsável pela interface, experiência do usuário (UX) e consumo das APIs.
* **Docs:** Centralização de requisitos, diagramas e manuais do sistema.

---

## 📂 Estrutura de Pastas

A organização do repositório segue a estrutura abaixo para garantir escalabilidade:

```text
sgej-sistema-membros/
├── backend/            # Núcleo de processamento e API
│   ├── apps/           # Módulos internos do sistema
│   ├── manage.py       # Ponto de entrada do servidor
│   └── requirements.txt # Definição de dependências do ambiente
│
├── frontend/           # Núcleo de interface e visualização
│   ├── src/            # Código-fonte da aplicação cliente
│   └── package.json    # Definição de dependências e scripts
│
├── docs/               # Documentação técnica e especificações
├── .gitignore          # Filtro de arquivos para o controle de versão
├── LICENSE             # Termos de licença do projeto
└── README.md           # Guia de introdução e estrutura