# Stage 1: Build the React frontend
FROM node:alpine as frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the FastAPI backend
FROM python:alpine as backend
WORKDIR /
COPY src /src

# Stage 3: Combine frontend and backend
FROM python:alpine
WORKDIR /
COPY --from=frontend /frontend/build /frontend/build
COPY --from=backend /src /src

# Stage 4: Install python requirements and ffmpeg
RUN apk add --no-cache --update \
    ffmpeg \
    && pip install --no-cache-dir -r src/requirements.txt \
    && rm -rf /var/cache/apk/*

# Stage 5: Copy the init script and execute
WORKDIR /
COPY init /init
RUN chmod +x /init
EXPOSE 7889
CMD ["/init"]