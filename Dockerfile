FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY api/package.json api/package.json
COPY web/package.json web/package.json
RUN npm install
COPY api api
COPY web web
RUN npm run build
FROM node:22-alpine AS api
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/api ./api
COPY --from=build /app/package.json ./package.json
CMD ["node","api/dist/main.js"]
FROM nginx:1.27-alpine AS web
COPY --from=build /app/web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
