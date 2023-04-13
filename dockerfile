# Define a imagem base
FROM node:14.17.0-alpine

# Define o diretório de trabalho na imagem
WORKDIR /app

# Copia os arquivos do projeto para a imagem
COPY package*.json ./
COPY tsconfig.json ./
COPY jest.config.ts ./
COPY src ./src

# Instala as dependências do projeto
RUN npm install



# Define o comando para iniciar o aplicativo
CMD ["npm", "test", "customer-service.spec.ts"]
