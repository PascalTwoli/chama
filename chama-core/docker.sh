#!/bin/bash

# Docker management script for Chama Core

set -e

case "$1" in
  build)
    echo "Building Docker images..."
    docker-compose build --no-cache
    ;;
  up)
    echo "Starting services..."
    docker-compose up -d
    echo "Services started. Application will be available at http://localhost:3000"
    ;;
  down)
    echo "Stopping services..."
    docker-compose down
    ;;
  logs)
    echo "Showing logs..."
    docker-compose logs -f ${2:-chama-core}
    ;;
  restart)
    echo "Restarting services..."
    docker-compose restart
    ;;
  migrate)
    echo "Running database migrations..."
    docker-compose exec chama-core npx prisma migrate deploy
    ;;
  seed)
    echo "Seeding database..."
    docker-compose exec chama-core npx prisma db seed
    ;;
  shell)
    echo "Opening shell in container..."
    docker-compose exec chama-core sh
    ;;
  clean)
    echo "Cleaning up Docker resources..."
    docker-compose down -v
    docker system prune -f
    ;;
  *)
    echo "Usage: $0 {build|up|down|logs|restart|migrate|seed|shell|clean}"
    echo ""
    echo "Commands:"
    echo "  build    - Build Docker images"
    echo "  up       - Start all services"
    echo "  down     - Stop all services"
    echo "  logs     - Show logs (optionally specify service name)"
    echo "  restart  - Restart all services"
    echo "  migrate  - Run database migrations"
    echo "  seed     - Seed the database"
    echo "  shell    - Open shell in the app container"
    echo "  clean    - Stop services and clean up Docker resources"
    exit 1
    ;;
esac

