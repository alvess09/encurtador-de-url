# 🔗 Encurtador de URL — Node.js

Encurtador de URL construído com Node.js puro (sem frameworks externos), usando um arquivo JSON como banco de dados.

---

## Como executar

```bash
node server.js
```

O servidor iniciará em `http://localhost:3000`.

---

## Estrutura do projeto

Para funcionar, você só precisa garantir que a estrutura de pastas está assim:
```
url-shortener/
├── server.js
├── urlService.js
├── db.js
└── public/
    ├── index.html
    ├── lista.html
    ├── ajuda.html
    ├── docs.html
    ├── swagger.json
    └── style.css

```

## Rotas da API

### 1. Encurtar uma URL
**POST** `/shorten`

**Body (JSON):**
```json
{ "url": "https://www.exemplo.com.br/pagina-muito-longa" }
```

**Resposta:**
```json
{
  "id": 1,
  "originalUrl": "https://www.exemplo.com.br/pagina-muito-longa",
  "shortCode": "aB3xYz",
  "shortUrl": "http://localhost:3000/aB3xYz",
  "createdAt": "2026-02-22"
}
```

---

### 2. Buscar URL por ID
**GET** `/urls/:id`

```
GET /urls/1
```

---

### 3. Buscar URLs por data
**GET** `/urls?date=YYYY-MM-DD`

```
GET /urls?date=2026-02-22
```

Retorna um array com todas as URLs encurtadas na data informada.

---

### 4. Buscar por shortCode
**GET** `/info/:shortCode`

```
GET /info/aB3xYz
```

---

### 5. Redirecionar para URL original
**GET** `/:shortCode`

```
GET /aB3xYz
```

Redireciona automaticamente (HTTP 302) para a URL original.

---

## Exemplos com cURL

```bash
# Encurtar uma URL
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.google.com/search?q=node+js"}'

# Buscar por ID
curl http://localhost:3000/urls/1

# Buscar por data
curl http://localhost:3000/urls?date=2026-02-22

# Buscar por shortCode
curl http://localhost:3000/info/aB3xYz

# Redirecionar
curl -L http://localhost:3000/aB3xYz
```
