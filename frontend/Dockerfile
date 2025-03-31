FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173
EXPOSE 4173

CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--port", "4173"]