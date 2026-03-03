# Use a imagem oficial do Node.js como base (use a versão LTS mais recente, por exemplo, 20-alpine)
FROM node:20-alpine

# Defina o diretório de trabalho dentro do container
WORKDIR /encurtador-de-URL

# Copie package.json e package-lock.json (se existir) para o diretório de trabalho
# Isso permite que o Docker use o cache para as dependências se esses arquivos não mudarem
COPY package*.json ./

# Instale as dependências da aplicação
RUN npm install --omit=dev

# Copie o restante do código da aplicação para o diretório de trabalho
COPY . .

# Exponha a porta em que sua API Node.js escuta (por padrão, muitas vezes 3000 ou 8080)
EXPOSE 3000

# Comando para rodar a aplicação quando o container iniciar
CMD ["node", "server.js"]
