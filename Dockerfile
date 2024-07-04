FROM node:latest AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:latest

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/.env* ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

CMD ["npm", "run", "start:prod"]