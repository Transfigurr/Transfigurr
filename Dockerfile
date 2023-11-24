# Stage 1: Build the React frontend
FROM node as frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the FastAPI backend
FROM python as backend
WORKDIR /
COPY src /src

# Install ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Stage 3: Combine frontend and backend
FROM python
WORKDIR /

# Copy the built frontend static files
COPY --from=frontend /frontend/build /frontend/build

# Copy the built backend
COPY --from=backend / /


# Set the working directory to the root of the project
WORKDIR /


# Install uvicorn in the final stage
RUN pip install uvicorn fastapi ffmpeg-python python-dotenv requests

# Expose the port the app runs on
EXPOSE 8000
# Command to run the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
