FROM node:20

WORKDIR /app

RUN npm install -g @nestjs/cli --verbose

COPY package*.json ./

RUN npm install

COPY . .

# RUN npm run build

CMD [ "npm", "run", "start:dev" ]