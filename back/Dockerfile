# Use a imagem oficial do Node.js
FROM node:18-alpine

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependências
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todo o código do projeto
COPY . .

# Exponha a porta da aplicação
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "start"]
