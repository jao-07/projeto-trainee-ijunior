FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma migrate dev

RUN npm run build

EXPOSE 3030

CMD [ "node", "dist/index.js" ]