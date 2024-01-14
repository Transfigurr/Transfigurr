# Stage 1: Build the React frontend
FROM node:alpine as frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install && npm cache clean --force
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the FastAPI backend
FROM python:slim as backend
WORKDIR /src
COPY src ./
RUN apt-get update && apt-get install -y ffmpeg gcc && \
    pip install -r requirements.txt && \
    find /usr/local \
    \( -type d -a -name test -o -name tests \) \
    -o \( -type f -a -name '*.pyc' -o -name '*.pyo' \) \
    -exec rm -rf '{}' + && \
    apt-get purge -y --auto-remove gcc && \
    rm -rf /var/lib/apt/lists/*

# Stage 3: Combine frontend and backend and run
FROM python:slim
WORKDIR /
COPY --from=frontend /frontend/build /frontend/build
COPY --from=backend / /
COPY init /init
RUN chmod +x /init
EXPOSE 8000
CMD ["/init"]