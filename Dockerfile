FROM node:16.17.0 as build

WORKDIR /build
COPY . .

RUN npm ci
RUN npm run build

FROM nginx:1.23-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist/graph-visualizer /usr/share/nginx/html/