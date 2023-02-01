FROM --platform=linux/amd64 node:alpine3.16 as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install --legacy-peer-deps
COPY . ./
COPY ./keys/gcs-sa.json ./keys/gcs-sa.json
RUN npm run build

FROM --platform=linux/amd64 node:alpine3.16 as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/dist ./
RUN npm install --legacy-peer-deps

FROM --platform=linux/amd64 node:alpine3.16
WORKDIR /usr/app
COPY --from=ts-remover /usr/app ./
COPY --from=ts-compiler /usr/app/keys/gcs-sa.json ./keys/gcs-sa.json
EXPOSE 3000
ENV NODE_ENV production
CMD ["node","server.js"]
