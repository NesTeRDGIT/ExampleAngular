### Build ###
FROM node:20-alpine AS build
ARG env
ARG app
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm install -f
COPY . .
RUN npm run $app:full-build:$env

### Run ###
FROM nginx:1.25.1-alpine
ARG app
COPY --from=build /app/dist/$app /usr/share/nginx/html

# PORT
EXPOSE 80
EXPOSE 443
