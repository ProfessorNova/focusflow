FROM node AS builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

FROM node
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/prisma prisma/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]
