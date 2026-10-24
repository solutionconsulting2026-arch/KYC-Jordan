# ---- Build stage: compile the Vite app ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage: serve the static build with nginx ----
FROM nginx:1.27-alpine

# Cloud Run injects PORT; default to 8080 elsewhere (VM, local)
ENV PORT=8080

# nginx renders /etc/nginx/templates/*.template into conf.d with env vars at startup
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
