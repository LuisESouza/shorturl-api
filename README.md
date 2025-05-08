# 🔗 URL Shortener API
Este projeto é uma API simples de encurtador de URLs desenvolvida com **NestJS**, **Prisma** e **MongoDB**.

## 🚀 Tecnologias Utilizadas
- NestJS
- Prisma ORM
- MongoDB

## 📦 Instalação
Clone o repositório e instale as dependências:
```bash
git clone https://github.com/LuisESouza/shorturl-api.git
cd repositorio
npm install
```

Crie um arquivo `.env` com a sua string de conexão do MongoDB:
```env
DATABASE_URL="mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<banco>?retryWrites=true&w=majority"
```

Depois, execute:
```bash
npx prisma generate
```

## 🧪 Execução
```bash
npm run start:dev
```
A API estará disponível em `http://localhost:4004`.

## 📌 Endpoints

### 🔸 POST `/shortener/shorten`
Encurta uma URL.

#### 📥 Requisição
**Body (JSON):**
```json
{
  "url": "https://exemplo.com"
}
```

#### 📤 Resposta
```json
{
  "shortUrl": "http://localhost:4004/shortener/4TK0Cc"
}
```

### 🔹 GET `/shortener/:code`
Redireciona para a URL original com base no código informado.

**Exemplo:**  
Acessar `http://localhost:4004/shortener/4TK0Cc` redirecionará para `https://exemplo.com`.

## 🛠️ Estrutura do Projeto
- `src/shortener`: Contém a lógica de encurtamento e redirecionamento.
- `prisma/schema.prisma`: Define o modelo de dados utilizado com o MongoDB.


## 📄 Schema Prisma

```ts
  generator client{
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "mongodb"
    url      = env("DATABASE_URL")
  }

  model Url {
    id        String @id @default(auto()) @map("_id") @db.ObjectId
    original  String
    shortCode String @unique
  }
```
