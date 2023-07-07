FROM node:20-alpine3.18

WORKDIR /node-app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV PORT=3000
EXPOSE 3000

COPY . .

RUN npm install

ENTRYPOINT ["node","server.js"]

# Para executar via docker manualmente
# docker network create social-network
# docker rm -f mongo
# docker run -d --network social-network -p 27017:27017 -v social-network_vol-db:/data/db --name mongo mongo:6.0.7
# docker build -t backend .
# docker run -d --network social-network -e DB_URL=mongodb://mongo:27017 -p 3000:3000 backend