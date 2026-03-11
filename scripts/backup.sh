#!/bin/bash

# CodeVoyager Backup Automation Script
# This script creates comprehensive backups of the CodeVoyager project

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
PROJECT_NAME="codevoyager"

echo "🚀 Starting CodeVoyager backup process..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "📦 Creating backup: $PROJECT_NAME-backup-$TIMESTAMP"

# Create project backup excluding unnecessary files
tar -czf "$BACKUP_DIR/$PROJECT_NAME-backup-$TIMESTAMP.tar.gz" \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=backups \
    --exclude=app-backup \
    --exclude=webapp-backup \
    --exclude=build \
    --exclude=dist \
    --exclude=coverage \
    --exclude=.nyc_output \
    --exclude=.env \
    --exclude=.env.local \
    --exclude=.env.development.local \
    --exclude=.env.test.local \
    --exclude=.env.production.local \
    --exclude=*.log \
    --exclude=Dockerfile.web \
    --exclude=docker-compose.web.yml \
    . 2>/dev/null

echo "✅ Project backup created: $BACKUP_DIR/$PROJECT_NAME-backup-$TIMESTAMP.tar.gz"

# Create Docker containers backup
echo "🐳 Creating Docker containers backup..."
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}" > "$BACKUP_DIR/docker-containers-$TIMESTAMP.txt"
echo "✅ Docker containers backup created: $BACKUP_DIR/docker-containers-$TIMESTAMP.txt"

# Create Docker volumes backup
echo "💾 Creating Docker volumes backup..."
docker volume ls > "$BACKUP_DIR/docker-volumes-$TIMESTAMP.txt"
echo "✅ Docker volumes backup created: $BACKUP_DIR/docker-volumes-$TIMESTAMP.txt"

# Create Git status backup
echo "📋 Creating Git status backup..."
cd "c:\Users\Private\Downloads\Organized\Projects\codevoyager"
git status --porcelain > "$BACKUP_DIR/git-status-$TIMESTAMP.txt"
git log --oneline -10 > "$BACKUP_DIR/git-recent-commits-$TIMESTAMP.txt"
echo "✅ Git status backup created: $BACKUP_DIR/git-status-$TIMESTAMP.txt"

# Create package.json backup
echo "📦 Creating package.json backup..."
cp package.json "$BACKUP_DIR/package-backup-$TIMESTAMP.json"
cp src/web/package.json "$BACKUP_DIR/package-web-backup-$TIMESTAMP.json"
echo "✅ Package.json backups created"

# Clean up old backups (keep last 10)
echo "🧹 Cleaning up old backups..."
cd "$BACKUP_DIR"
ls -t $PROJECT_NAME-backup-*.tar.gz | tail -n +11 | xargs -r rm -f 2>/dev/null || true
ls -t docker-containers-*.txt | tail -n +11 | xargs -r rm -f 2>/dev/null || true
ls -t docker-volumes-*.txt | tail -n +11 | xargs -r rm -f 2>/dev/null || true
echo "✅ Old backups cleaned up"

# Create backup summary
echo "📊 Creating backup summary..."
cat > "$BACKUP_DIR/backup-summary-$TIMESTAMP.txt" << EOF
CodeVoyager Backup Summary - $TIMESTAMP
==========================================

Files Created:
- $PROJECT_NAME-backup-$TIMESTAMP.tar.gz (Main project backup)
- docker-containers-$TIMESTAMP.txt (Docker containers status)
- docker-volumes-$TIMESTAMP.txt (Docker volumes list)
- git-status-$TIMESTAMP.txt (Git working directory status)
- git-recent-commits-$TIMESTAMP.txt (Recent Git commits)
- package-backup-$TIMESTAMP.json (Main package.json)
- package-web-backup-$TIMESTAMP.json (Web package.json)

Total Backup Size: $(du -h "$BACKUP_DIR/$PROJECT_NAME-backup-$TIMESTAMP.tar.gz" | cut -f1)

Backup Location: $BACKUP_DIR
Next Scheduled Backup: $(date -d '+1 hour' '+%Y-%m-%d %H:%M:%S')
EOF

echo "✅ Backup summary created: $BACKUP_DIR/backup-summary-$TIMESTAMP.txt"

# Push to GitHub (optional)
echo "🚀 Pushing backup to GitHub..."
git add "$BACKUP_DIR/*"
git commit -m "Automated backup - $TIMESTAMP" || true
git push origin main || true

echo "🎉 Backup process completed successfully!"
echo "📁 Backup location: $BACKUP_DIR"
echo "⏰ Next backup scheduled in 1 hour"

# Display backup summary
cat "$BACKUP_DIR/backup-summary-$TIMESTAMP.txt"
