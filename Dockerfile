# Etapa 1: Build de la aplicación
FROM node:slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile
COPY public ./public
COPY src ./src
RUN npm run build

# Etapa 2: Imagen final con Nginx
FROM nginx:stable
USER root
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html/
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

# # Usa una imagen base de Node
# FROM node:22-slim

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build

# RUN npm install -g serve

# EXPOSE 5000

# CMD ["serve", "-s", "build", "-l", "5000"]