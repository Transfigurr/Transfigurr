# Stage 1: Build the React frontend
FROM node:alpine as frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the FastAPI backend
FROM python:slim as backend
WORKDIR /
COPY src /src

# Stage 3: Combine frontend and backend
FROM python:slim
WORKDIR /
COPY --from=frontend /frontend/build /frontend/build
COPY --from=backend /src /src

# Stage 4: Install python requirements and ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*
RUN pip install -r src/requirements.txt

# Stage 5: Copy the init script and execute
WORKDIR /
COPY init /init
RUN chmod +x /init
EXPOSE 8000
CMD ["/init"]