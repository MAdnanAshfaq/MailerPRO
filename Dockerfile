# Stage 1: Build the frontend (Vite/React)
FROM node:20 AS frontend-builder
WORKDIR /app/frontend

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./
RUN npm ci --no-audit --no-fund

# Copy frontend source code and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend (Go)
FROM golang:1.24-alpine AS backend-builder
WORKDIR /app

# Disable CGO for a statically linked binary and prevent toolchain auto-download
ENV CGO_ENABLED=0
ENV GOFLAGS=-mod=mod
ENV GOTOOLCHAIN=local

# Copy Go modules manifests and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy backend source code
COPY . .

# Build the Go application
RUN go build -o camp cmd/camp/main.go

# Stage 3: Create the final lightweight production image
FROM alpine:latest
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache ca-certificates tzdata

# Create a dedicated non-root user for running the app
RUN addgroup -S campgroup && adduser -S campuser -G campgroup

# Copy the compiled Go binary from Stage 2
COPY --from=backend-builder /app/camp /app/camp

# Copy the built frontend static files from Stage 1
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Copy the immersive landing page
COPY frontend/landing.html /app/frontend/landing.html

# Create the data directory and set ALL permissions after all COPYs
RUN mkdir -p /app/camp_data && chown -R campuser:campgroup /app/camp_data && chmod 750 /app/camp_data && chown campuser:campgroup /app/camp && chmod 755 /app/camp

# Switch to non-root user
USER campuser

# Set environment variables
ENV PORT=8080
ENV DB_PATH=/app/camp_data/camp.db

# Expose the configured HTTP port
EXPOSE 8080

# Command to run the application using absolute path
CMD ["/app/camp"]
