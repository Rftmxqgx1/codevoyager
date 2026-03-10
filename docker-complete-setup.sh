#!/bin/bash
# Docker Fix and Complete Setup Script for CodeVoyager

echo "🐳 CodeVoyager Docker Complete Setup"
echo "=================================="

# Step 1: Clean up existing incomplete containers
echo "🧹 Cleaning up incomplete containers..."
docker-compose down --volumes --remove-orphans
docker rm -f codevoyager-app-1 2>/dev/null
docker rm -f codevoyager-monitor-1 2>/dev/null
docker rm -f codevoyager-backup 2>/dev/null

# Step 2: Clean up build cache
echo "🧹 Cleaning build cache..."
docker system prune -f --volumes

# Step 3: Build and start services
echo "🔨 Building Docker containers..."
docker-compose build --no-cache

echo "🚀 Starting all services..."
docker-compose up -d

# Step 4: Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Step 5: Check health
echo "🏥 Checking container health..."
docker-compose ps

# Step 6: Verify app is running
echo "✅ Verifying application..."
curl -s http://localhost:3000/health || echo "⚠️ Health check failed"

# Step 7: Create initial backup
echo "💾 Creating initial backup..."
mkdir -p backup
docker-compose exec -T codevoyager-app sh -c "cd /app && tar -czf /backup/codevoyager-initial-backup-$(date +%Y%m%d-%H%M%S).tar.gz --exclude=node_modules --exclude=.git --exclude=backup ."

echo ""
echo "🎉 Docker setup complete!"
echo ""
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "🔍 Access your app:"
echo "- Main App: http://localhost:3000"
echo "- Health Check: http://localhost:3000/health"
echo "- Backups: ./backup/"

echo ""
echo "🔄 Backup commands:"
echo "- Manual backup: docker-compose exec backup sh"
echo "- View backups: ls -la backup/"
echo "- Container logs: docker-compose logs -f"

echo ""
echo "🛑 To stop: docker-compose down"
echo "🗑️ To clean everything: docker-compose down -v --rmi all"
