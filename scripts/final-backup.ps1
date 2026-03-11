# CodeVoyager Final GitHub Backup Script
param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting CodeVoyager GitHub Backup..." -ForegroundColor Green

# Create timestamp
$TIMESTAMP = Get-Date -Format "yyyyMMdd-HHmmss"
$BACKUP_DIR = ".\backups"

# Create backup directory
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR -Force
}

# Create backup
Write-Host "📦 Creating backup..." -ForegroundColor Blue
$backupFile = "$BACKUP_DIR\codevoyager-final-backup-$TIMESTAMP.zip"

Compress-Archive -Path ".\src", ".\package.json", ".\docker-compose.yml", ".\docker-compose.web.yml", ".\Dockerfile", ".\Dockerfile.web", ".\scripts", ".\.github" -DestinationPath $backupFile -Force
Write-Host "✅ Backup created: $backupFile" -ForegroundColor Green

# Git operations
Write-Host "📋 Git operations..." -ForegroundColor Blue

try {
    # Add all changes
    git add .
    
    # Create commit
    $commitMessage = "Final GitHub backup - " + $TIMESTAMP + " - Complete project backup with Docker and GitHub Actions"
        
    git commit -m $commitMessage
    Write-Host "✅ Changes committed" -ForegroundColor Green
    
    # Push to GitHub
    Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Blue
    git push origin main
    Write-Host "✅ Pushed to GitHub" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Git operations failed: $($_.Exception.Message)" -ForegroundColor Red
    if (-not $Force) {
        return
    }
}

# Create Git backup files
git log --oneline -10 | Out-File "$BACKUP_DIR\git-commits-$TIMESTAMP.txt"
git status --porcelain | Out-File "$BACKUP_DIR\git-status-$TIMESTAMP.txt"
Write-Host "✅ Git backup created" -ForegroundColor Green

# Display results
Write-Host "🎉 GitHub Backup Completed Successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Backup Location: $BACKUP_DIR" -ForegroundColor Cyan
Write-Host "📦 Main Backup: $backupFile" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 GitHub Repository: https://github.com/Rftmxqgx1/codevoyager.git" -ForegroundColor Blue
Write-Host "🔗 Actions: https://github.com/Rftmxqgx1/codevoyager/actions" -ForegroundColor Blue
Write-Host ""

$backupSize = [math]::Round((Get-Item $backupFile).Length / 1MB, 2)
Write-Host "📊 Backup Size: $backupSize MB" -ForegroundColor Cyan
Write-Host "⏰ Timestamp: $TIMESTAMP" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 All operations completed successfully!" -ForegroundColor Green
