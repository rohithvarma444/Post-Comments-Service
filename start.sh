#!/bin/bash

echo "Starting Post-Comments Microservice System..."

if [ ! -f .env ]; then
    echo "Creating .env file from env.example..."
    cp env.example .env
    echo "Environment file created successfully"
else
    echo "Environment file already exists"
fi

echo "Starting Docker services..."

docker-compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo "All services started successfully!"
    echo ""
    echo "Service URLs:"
    echo " Frontend:        http://localhost:8000"
    echo " API Gateway:     http://localhost:8080"
    echo ""
    echo "Useful Commands:"
    echo " View logs:         docker-compose logs -f"
    echo " Stop services:     ./stop.sh"
    echo " Check status:      docker-compose ps"
else
    echo "Failed to start services"
    exit 1
fi