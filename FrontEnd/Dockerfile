# --- Stage 1: Build the React application ---
FROM node:20-slim as build

# Define a build argument for VITE_BACKENDURL
ARG VITE_BACKENDURL

# Set the environment variable for the build process
# This makes VITE_BACKENDURL available to Vite during `npm run build`
ENV VITE_BACKENDURL=$VITE_BACKENDURL

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine as production

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]