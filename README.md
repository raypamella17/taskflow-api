# TaskFlow API

API REST para gerenciamento de projetos, equipes e tarefas.

## Tecnologias

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- dotenv

## Funcionalidades

- Criar, listar, atualizar e excluir projetos
- Criar e listar equipes
- Criar, listar, atualizar e excluir tarefas
- Persistência de dados com MongoDB

## Como executar

Instale as dependências:

npm install

Crie um arquivo `.env` baseado no `.env.example`:

MONGODB_URI=your-mongodb-uri

Inicie o servidor:

node app.js

Servidor:

http://localhost:3000

## Endpoints

### Projetos
POST /projects  
GET /projects  
GET /projects/:id  
PUT /projects/:id  
DELETE /projects/:id  

### Equipes
POST /teams  
GET /teams  

### Tarefas
POST /tasks  
GET /tasks  
PUT /tasks/:id  
DELETE /tasks/:id  

## Segurança

As credenciais do MongoDB são armazenadas em variáveis de ambiente.
O arquivo `.env` não é versionado no GitHub.