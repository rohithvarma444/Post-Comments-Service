#!/bin/bash

echo "Stopping Post-Comments Microservice System..."

docker-compose down

if [ $? -eq 0 ]; then
    echo "All services stopped successfully"
else
    echo "Some services may not have stopped properly"
    exit 1
fi