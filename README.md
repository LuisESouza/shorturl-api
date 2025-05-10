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


## 📌 Endpoints para USERS

### 🔸 POST `/auth/login`
Login do usuário no site.

#### 📥 Requisição
```json
{
	"email": "exemplo@gmail.com",
  "password": "exemplo"
}
```

#### 📤 Resposta
```json
{
	"user": {
		"name": "Luis",
		"email": "exemplo@gmail.com"
	},
	"token": "SEU_TOKEN_JWT"
}
```

### 🔸 POST `/auth/register`
Registrar usuário no site.

#### 📥 Requisição
```json
{
	"name": "exemplo",
	"email": "exemplo@gmail.com",
  "password": "exemplo"
}
```

#### 📤 Resposta
```json
{
	"user": {
		"name": "Luis",
		"email": "exemplo@gmail.com"
	},
	"token": "SEU_TOKEN_JWT"
}
```


## 📌 Endpoints para LINKS

### 🔸 POST `/gues`
Encurta URLS para usuário anonimo.

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
  "shortUrl": "http://localhost:4004/4TK0Cc"
}
```

### 🔸 POST `/gues`
Encurta URLS para usuário autenticado.

#### 📥 Requisição
**Headers:**
```json
{
  "Authorization": "Bearer SEU_TOKEN_JWT"
}
```

**Body (JSON):**
```json
{
  "url": "https://exemplo.com"
}
```

#### 📤 Resposta
```json
{
  "shortUrl": "http://localhost:4004/4TK0Cc"
}
```


### 🔹 GET `/shortener/:code`
Redireciona para a URL original com base no código informado.

**Exemplo:**  
Acessar `http://localhost:4004/4TK0Cc` redirecionará para `https://exemplo.com`.

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

  model User {
    id        String   @id @default(auto()) @map("_id") @db.ObjectId
    name      String
    email     String   @unique
    password  String
    urls      Url[] @relation("userUrl")


    updated_at     DateTime @updatedAt
    status_account Boolean @default(true)
    created_at     DateTime @default(now())
    last_login     DateTime @default(now())
  }

  model Url {
    id        String   @id @default(auto()) @map("_id") @db.ObjectId
    original  String
    shortCode String   @unique
    userId    String?   @db.ObjectId
    user      User?     @relation("userUrl", fields: [userId], references: [id])
    ip        String? 
    clicks    Click[] @relation("urlClick")


    updated_at DateTime @updatedAt
    status_url Boolean @default(true)
    created_at DateTime @default(now())
  }

  model Click {
    id        String   @id @default(auto()) @map("_id") @db.ObjectId
    url       Url?      @relation("urlClick", fields: [urlId], references: [id])
    timestamp DateTime @default(now())
    urlId     String?   @db.ObjectId
    ip        String
    userAgent String
    referer   String?
    country   String?
  }
```