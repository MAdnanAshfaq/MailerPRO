# Stage 1: Build the frontend (Vite/React)
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source code and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend (Go)
FROM golang:1.25-alpine AS backend-builder
WORKDIR /app

# Install build dependencies if needed (e.g. for CGO sqlite)
# Enable CGO for the sqlite driver
ENV CGO_ENABLED=1
RUN apk add --no-cache gcc musl-dev

# Copy Go modules manifests and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy backend source code
COPY . .

# Build the Go application
RUN go build -o camp cmd/camp/main.go

# Stage 3: Create the final lightweight production image
FROM alpine:3.18
WORKDIR /app

# Install ca-certificates and timezone data (often needed for secure outbound requests and correct timestamps)
RUN apk add --no-cache ca-certificates tzdata sqlite-libs

# Create the data directory for the SQLite database
RUN mkdir -p camp_data && chown -R nobody:nobody camp_data

# Copy the compiled Go binary from Stage 2
COPY --from=backend-builder /app/camp .

# Copy the built frontend static files from Stage 1 into the expected directory path
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
# Copy the immersive landing page file
COPY frontend/landing.html ./frontend/landing.html

# Ensure the app runs as a non-root user for security
USER nobody:nobody

# Set default environment variables
ENV PORT=8080
ENV DB_PATH=./camp_data/camp.db

# Expose the configured HTTP port
EXPOSE 8080

# Command to run the application
CMD ["./camp"]
