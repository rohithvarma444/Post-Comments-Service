#!/bin/bash

echo "Starting Post-Comments Microservice System..."

docker-compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo "All services started!"
    echo ""
    echo "Service URLs:"
    echo " Frontend:        http://localhost:8000"
    echo " API Gateway:     http://localhost:8080"
    echo ""
    echo "Commands:"
    echo " View logs:         docker-compose logs -f"
    echo " Stop services:     docker-compose down"
else
    echo "Failed to start services"
    exit 1
fi