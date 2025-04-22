# Etapa 1: Build de la aplicación
FROM node:22-slim AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instala dependencias (puedes agregar --omit=dev si solo quieres prod deps)
RUN npm install --frozen-lockfile --omit=dev

# Copia el resto de los archivos necesarios para compilar
COPY public ./public
COPY src ./src

# Compila la app (esto generará la carpeta build/)
RUN npm run build


# Etapa 2: Imagen final con Nginx
FROM nginxinc/nginx-unprivileged:1.27

USER root
# Elimina los archivos HTML por defecto de Nginx (opcional)
RUN rm -rf /usr/share/nginx/html/*

# Copia los archivos estáticos generados en la etapa anterior
COPY --from=build /app/build /usr/share/nginx/html

# Opcional: Copiar tu propia configuración de Nginx si es necesario
COPY nginx.conf /etc/nginx/conf.d/default.conf

USER 101
# Expone el puerto por donde servirá Nginx
EXPOSE 8080

# Comando por defecto para correr Nginx
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