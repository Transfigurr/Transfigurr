# Stage 1: Build the React frontend
FROM node:slim as frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the FastAPI backend
FROM python:slim as backend
WORKDIR /
COPY src /src

# Install ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Stage 3: Combine frontend and backend
FROM python:slim
WORKDIR /

# Copy the built frontend static files
COPY --from=frontend /frontend/build /frontend/build

# Copy the built backend
COPY --from=backend / /


# Set the working directory to the root of the project
WORKDIR /

# Install uvicorn in the final stage
RUN pip install -r src/requirements.txt

# Initialize the database
RUN mkdir -p /config/db
RUN touch /config/db/database.db
RUN python src/init_db.py

# Expose the port the app runs on
EXPOSE 8000
# Command to run the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
