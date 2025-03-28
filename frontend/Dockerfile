FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --production


COPY . .
RUN npm run build

FROM node:18-alpine AS production
RUN npm install -g serve

WORKDIR /app
COPY --from=build /app/dist /app

EXPOSE 5173

CMD ["serve", "-s", ".", "-l", "5173"]