#!/bin/bash
# Quick reference for CodeVoyager Docker commands

# VIEW CONTAINERS
docker-compose ps

# VIEW LOGS
docker-compose logs -f
docker-compose logs app -f
docker-compose logs backup -f
docker-compose logs monitor -f

# CREATE BACKUP
docker-compose exec backup sh -c 'cd /source && tar -czf /backup/manual-backup-$(date +%Y%m%d-%H%M%S).tar.gz --exclude=node_modules --exclude=.git --exclude=backup .'

# VIEW BACKUPS
docker-compose exec backup ls -la /backup

# RESTORE FROM BACKUP
docker-compose exec backup sh -c 'cd /source && tar -xzf /backup/[BACKUP_FILENAME].tar.gz'

# ACCESS CONTAINER SHELLS
docker-compose exec app sh
docker-compose exec backup sh

# APP ACCESS
# - Main App: http://localhost:3000
# - Health: http://localhost:3000/health
# - Verify Specs: http://localhost:3000/verify-specs

# STOP/RESTART
docker-compose down
docker-compose down -v  # remove volumes too
docker-compose restart

# BUILD (if needed)
docker-compose up --build -d
