FROM node:20-alpine

WORKDIR /usr/src/app

# Install deps first for better layer caching
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Overridden to `npm run dev` in docker-compose.yml for local development
CMD ["npm", "start"]
