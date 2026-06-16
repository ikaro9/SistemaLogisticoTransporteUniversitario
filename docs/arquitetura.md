# Arquitetura do Sistema

## Tecnologias Utilizadas

O Sistema Logístico de Transporte Universitário foi desenvolvido utilizando uma arquitetura cliente-servidor, com separação entre frontend, backend e banco de dados.

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Banco de Dados

* PostgreSQL

### Controle de Versão

* Git
* GitHub

---

## Estrutura do Projeto

```text
SistemaLogisticoTransporteUniversitario
│
├── backend
│   │
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── participacaoController.js
│   │   ├── rotaController.js
│   │   └── usuarioController.js
│   │
│   ├── middlewares
│   │   ├── authMiddleware.js
│   │   └── authorize.js
│   │
│   ├── models
│   │   ├── participacaoModel.js
│   │   ├── rotaModel.js
│   │   └── usuarioModel.js
│   │
│   ├── routes
│   │   ├── participacaoRoutes.js
│   │   ├── rotaRoutes.js
│   │   └── usuarioRoutes.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── database
│   └── schema.sql
│
├── docs
│   ├── arquitetura.md
│   └── backlog.md
│
├── frontend
│   │
│   ├── css
│   │   └── style.css
│   │
│   ├── js
│   │   ├── cadastro.js
│   │   ├── login.js
│   │   ├── participantes.js
│   │   ├── perfil.js
│   │   └── rotas.js
│   │
│   ├── cadastro.html
│   ├── index.html
│   ├── login.html
│   ├── participantes.html
│   ├── perfil.html
│   └── rotas.html
│
└── .gitignore
```

---

## Fluxo Básico de Funcionamento

O sistema segue uma arquitetura em camadas, separando interface, regras de negócio e persistência de dados.

1. O usuário acessa uma das páginas da aplicação através do navegador.
2. O frontend envia requisições HTTP para a API desenvolvida em Node.js e Express.
3. As rotas da API recebem as requisições e as encaminham para os controllers responsáveis.
4. Os controllers executam as regras de negócio necessárias.
5. Os models realizam consultas e alterações no banco de dados PostgreSQL.
6. Os dados retornam para o controller.
7. A API envia a resposta ao frontend.
8. O frontend atualiza a interface e apresenta as informações ao usuário.

### Fluxo Simplificado

```text
Usuário
   ↓
Frontend (HTML, CSS e JavaScript)
   ↓
Routes
   ↓
Controllers
   ↓
Models
   ↓
PostgreSQL
   ↓
Frontend
```

---

## Responsabilidades dos Principais Componentes

### Backend

O backend é responsável pelo processamento das regras de negócio e pela comunicação com o banco de dados.

#### config

Contém os arquivos de configuração do sistema.

* **db.js:** realiza a configuração e conexão com o banco PostgreSQL.

#### controllers

Implementam as regras de negócio da aplicação.

* **usuarioController.js:** gerenciamento de usuários e autenticação.
* **rotaController.js:** gerenciamento das rotas de transporte.
* **participacaoController.js:** gerenciamento das participações dos usuários nas rotas.

#### middlewares

Responsáveis por funcionalidades compartilhadas entre várias rotas.

* **authMiddleware.js:** valida a autenticação dos usuários.
* **authorize.js:** controla permissões de acesso conforme o perfil do usuário.

#### models

Realizam a comunicação direta com o banco de dados.

* **usuarioModel.js:** operações relacionadas aos usuários.
* **rotaModel.js:** operações relacionadas às rotas.
* **participacaoModel.js:** operações relacionadas às participações.

#### routes

Definem os endpoints da API e direcionam as requisições para os controllers correspondentes.

* **usuarioRoutes.js**
* **rotaRoutes.js**
* **participacaoRoutes.js**

#### server.js

Arquivo principal responsável por inicializar o servidor da aplicação e configurar os recursos da API.

---

### Frontend

O frontend é responsável pela interface gráfica e interação com os usuários.

#### css

Contém os arquivos responsáveis pela estilização das páginas.

* **style.css:** estilos visuais da aplicação.

#### js

Contém os scripts responsáveis pela interação do usuário e comunicação com a API.

* **cadastro.js:** cadastro de usuários.
* **login.js:** autenticação de usuários.
* **participantes.js:** gerenciamento dos participantes das rotas.
* **perfil.js:** exibição e edição do perfil do usuário.
* **rotas.js:** gerenciamento e visualização das rotas.

#### Páginas HTML

* **index.html:** página inicial da aplicação.
* **login.html:** autenticação de usuários.
* **cadastro.html:** cadastro de novos usuários.
* **rotas.html:** visualização e gerenciamento das rotas.
* **participantes.html:** visualização dos participantes das rotas.
* **perfil.html:** exibição e atualização das informações do usuário.

---

### Banco de Dados

O banco de dados PostgreSQL é responsável pelo armazenamento persistente das informações da aplicação.

#### schema.sql

Arquivo que contém a estrutura do banco de dados, incluindo a criação das tabelas, relacionamentos e restrições necessárias para o funcionamento do sistema.

As principais informações armazenadas são:

* Usuários;
* Rotas;
* Participações nas rotas;
* Dados necessários para autenticação e controle de acesso.

---

### Documentação

A pasta **docs** concentra a documentação do projeto.

* **arquitetura.md:** descrição da arquitetura da aplicação.
* **backlog.md:** backlog atualizado contendo as histórias de usuário, prioridades e status de implementação.

---

## Arquitetura Geral da Solução

O Sistema Logístico de Transporte Universitário adota uma arquitetura cliente-servidor baseada em API REST. Essa abordagem promove a separação de responsabilidades entre interface, lógica de negócio e persistência de dados, facilitando a manutenção, evolução e escalabilidade do sistema.

A estrutura em camadas utilizada permite maior organização do código, reutilização de componentes e melhor controle sobre as funcionalidades implementadas no MVP.
