# Sistema Logístico de Transporte Universitário

Sistema web desenvolvido para a disciplina de **Engenharia de Software**, com o objetivo de auxiliar na organização de rotas, participação e confirmação de presença em transportes universitários.

A aplicação permite o cadastro de usuários, autenticação por sessão, gerenciamento de rotas, entrada em rotas por código e controle de confirmação de presença dos participantes.

---

## Equipe

* Ikaro Ferreira
* Alexssandro Rocha
* Gabriel Paiva
* Artur Carvalho

Projeto desenvolvido na **UFERSA** para a disciplina de **Engenharia de Software**.

---

## Tecnologias utilizadas

### Backend

* Node.js
* Express
* PostgreSQL
* bcryptjs
* express-session
* cors
* dotenv

### Frontend

* HTML5
* CSS3
* JavaScript

### Banco de dados

* PostgreSQL

---

## Objetivo do projeto

O sistema tem como objetivo apoiar a logística de transporte universitário, permitindo que usuários se cadastrem, acessem o sistema, visualizem rotas disponíveis, entrem em uma rota, confirmem presença e cancelem confirmação quando necessário.

A proposta busca organizar a comunicação entre alunos, motoristas e administradores, centralizando informações sobre rotas, veículos, vagas e participantes.

---

## Divisão de responsabilidades

## Integrante 1 — Banco de dados + Backend das rotas

Responsável pela modelagem do banco de dados em PostgreSQL e pela implementação das funcionalidades relacionadas às rotas.

### Responsabilidades

* Criação do modelo relacional em PostgreSQL.
* Criação da tabela `usuario`.
* Criação da tabela `rota`.
* Criação da tabela `participacao`.
* Criação da tabela `confirmacao`.
* Implementação do cadastro de rotas.
* Implementação da listagem de rotas.
* Implementação das operações principais de consulta, criação, atualização e remoção de rotas.

## Integrante 2 — Autenticação

Responsável pelas funcionalidades de cadastro, login e controle de sessão dos usuários.

### Responsabilidades

* Cadastro de usuário.
* Login de usuário.
* Encerramento de sessão.
* Verificação da sessão ativa.
* Criptografia de senha com `bcryptjs`.
* Controle de autenticação com `express-session`.

## Integrante 3 — Participação

Responsável pelas funcionalidades relacionadas à participação dos usuários nas rotas.

### Responsabilidades

* Entrar em rota.
* Confirmar presença.
* Cancelar confirmação.
* Listar participantes de uma rota.
* Verificar se o usuário participa de uma rota.
* Listar as rotas em que o usuário participa.

## Integrante 4 — Frontend

Responsável pela implementação da interface do sistema em HTML, CSS e JavaScript.

### Responsabilidades

* Tela de login.
* Tela de cadastro.
* Tela de rotas.
* Tela de participantes.
* Tela de perfil.
* Layout responsivo.
* Integração da interface com as rotas do backend.
* Exibição de mensagens de sucesso, erro e carregamento.

---

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/ikaro9/SistemaLogisticoTransporteUniversitario.git
cd SistemaLogisticoTransporteUniversitario
```

### 2. Criar o banco de dados

No PostgreSQL ou pgAdmin, crie um banco chamado:

```txt
transporte_universitario
```

### 3. Criar as tabelas

Execute o script localizado em:

```txt
database/schema.sql
```

Esse script cria as tabelas:

* `usuario`
* `rota`
* `participacao`
* `confirmacao`

### 4. Configurar o `.env`

Entre na pasta `backend`:

```bash
cd backend
```

Crie um arquivo chamado `.env` com este conteúdo:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=projeto123
DB_NAME=transporte_universitario
SESSION_SECRET=sistema-transporte-universitario
```

Atenção: `DB_PASSWORD` deve ser a senha real do seu PostgreSQL.

### 5. Instalar as dependências

```bash
npm install
```

### 6. Iniciar o servidor

```bash
npm start
```

Se tudo estiver correto, o terminal exibirá:

```txt
Servidor rodando na porta 3000
🟢 Conectado ao PostgreSQL
```

### 7. Acessar o sistema

Abra no navegador:

```txt
http://localhost:3000
```

---

## Fluxo recomendado para teste

1. Cadastre um usuário com perfil `ADMIN`.
2. Faça login com o usuário administrador.
3. Cadastre uma nova rota.
4. Cadastre ou utilize outro usuário com perfil `ALUNO`.
5. Faça login como aluno.
6. Acesse a tela de rotas.
7. Entre em uma rota usando o código informado.
8. Confirme presença como `IDA`, `VOLTA` ou `IDA_VOLTA`.
9. Teste o cancelamento de confirmação.
10. Consulte os participantes e o perfil do usuário.

---
