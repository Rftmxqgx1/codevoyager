# Simple CodeVoyager Backup Script
$TIMESTAMP = Get-Date -Format "yyyyMMdd-HHmmss"
$BACKUP_DIR = ".\backups"

Write-Host "Creating CodeVoyager backup..."

# Create backup directory
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR -Force
}

# Create project backup
Compress-Archive -Path ".\src", ".\package.json", ".\docker-compose.yml", ".\Dockerfile" -DestinationPath "$BACKUP_DIR\codevoyager-backup-$TIMESTAMP.zip" -Force

Write-Host "Backup created: codevoyager-backup-$TIMESTAMP.zip"
