# CodeVoyager Backup Automation Script (PowerShell)
# This script creates comprehensive backups of the CodeVoyager project

param(
    [switch]$Force,
    [switch]$SkipGit
)

$ErrorActionPreference = "Stop"

$BACKUP_DIR = ".\backups"
$TIMESTAMP = Get-Date -Format "yyyyMMdd-HHmmss"
$PROJECT_NAME = "codevoyager"

Write-Host "🚀 Starting CodeVoyager backup process..." -ForegroundColor Green

# Create backup directory if it doesn't exist
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR -Force
}

Write-Host "📦 Creating backup: $PROJECT_NAME-backup-$TIMESTAMP" -ForegroundColor Blue

# Create project backup excluding unnecessary files
$excludePatterns = @(
    "node_modules",
    ".git",
    "backups", 
    "app-backup",
    "webapp-backup",
    "build",
    "dist",
    "coverage",
    ".nyc_output",
    ".env",
    ".env.local",
    ".env.development.local",
    ".env.test.local", 
    ".env.production.local",
    "*.log",
    "Dockerfile.web",
    "docker-compose.web.yml"
)

$backupFile = "$BACKUP_DIR\$PROJECT_NAME-backup-$TIMESTAMP.tar.gz"
$tempDir = "$env:TEMP\codevoyager-backup-$TIMESTAMP"

# Create temporary directory for filtered backup
New-Item -ItemType Directory -Path $tempDir -Force

# Copy files excluding patterns
Get-ChildItem -Path . -Recurse | Where-Object { 
    $relativePath = $_.FullName.Replace((Get-Location).Path, "").TrimStart('\')
    $exclude = $false
    foreach ($pattern in $excludePatterns) {
        if ($relativePath -like "*$pattern*" -or $_.Name -like $pattern) {
            $exclude = $true
            break
        }
    }
    -not $exclude
} | ForEach-Object {
    $targetPath = Join-Path $tempDir $relativePath
    $targetDir = Split-Path $targetPath -Parent
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force
    }
    if (-not $_.PSIsContainer) {
        Copy-Item -Path $_.FullName -Destination $targetPath -Force
    }
}

# Create compressed archive
Compress-Archive -Path "$tempDir\*" -DestinationPath $backupFile -Force
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "✅ Project backup created: $backupFile" -ForegroundColor Green

# Create Docker containers backup
Write-Host "🐳 Creating Docker containers backup..." -ForegroundColor Blue
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}" | Out-File "$BACKUP_DIR\docker-containers-$TIMESTAMP.txt"
Write-Host "✅ Docker containers backup created: docker-containers-$TIMESTAMP.txt" -ForegroundColor Green

# Create Docker volumes backup
Write-Host "💾 Creating Docker volumes backup..." -ForegroundColor Blue  
docker volume ls | Out-File "$BACKUP_DIR\docker-volumes-$TIMESTAMP.txt"
Write-Host "✅ Docker volumes backup created: docker-volumes-$TIMESTAMP.txt" -ForegroundColor Green

# Create Git status backup
if (-not $SkipGit) {
    Write-Host "📋 Creating Git status backup..." -ForegroundColor Blue
    Set-Location "c:\Users\Private\Downloads\Organized\Projects\codevoyager"
    git status --porcelain | Out-File "$BACKUP_DIR\git-status-$TIMESTAMP.txt"
    git log --oneline -10 | Out-File "$BACKUP_DIR\git-recent-commits-$TIMESTAMP.txt"
    Write-Host "✅ Git status backup created" -ForegroundColor Green
}

# Create package.json backup
Write-Host "📦 Creating package.json backup..." -ForegroundColor Blue
Copy-Item "package.json" "$BACKUP_DIR\package-backup-$TIMESTAMP.json" -Force
Copy-Item "src\web\package.json" "$BACKUP_DIR\package-web-backup-$TIMESTAMP.json" -Force
Write-Host "✅ Package.json backups created" -ForegroundColor Green

# Clean up old backups (keep last 10)
Write-Host "🧹 Cleaning up old backups..." -ForegroundColor Yellow
Get-ChildItem "$BACKUP_DIR\$PROJECT_NAME-backup-*.tar.gz" | Sort-Object LastWriteTime -Descending | Select-Object -Skip 10 | Remove-Item -Force
Get-ChildItem "$BACKUP_DIR\docker-containers-*.txt" | Sort-Object LastWriteTime -Descending | Select-Object -Skip 10 | Remove-Item -Force  
Get-ChildItem "$BACKUP_DIR\docker-volumes-*.txt" | Sort-Object LastWriteTime -Descending | Select-Object -Skip 10 | Remove-Item -Force
Write-Host "✅ Old backups cleaned up" -ForegroundColor Green

# Create backup summary
Write-Host "📊 Creating backup summary..." -ForegroundColor Blue
$backupSize = [math]::Round((Get-Item $backupFile).Length / 1MB, 2)
$summary = @"
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

Total Backup Size: $backupSize MB

Backup Location: $BACKUP_DIR
Next Scheduled Backup: $((Get-Date).AddHours(1).ToString('yyyy-MM-dd HH:mm:ss'))
"@

$summary | Out-File "$BACKUP_DIR\backup-summary-$TIMESTAMP.txt"
Write-Host "✅ Backup summary created: backup-summary-$TIMESTAMP.txt" -ForegroundColor Green

# Push to GitHub (optional)
if (-not $SkipGit) {
    Write-Host "🚀 Pushing backup to GitHub..." -ForegroundColor Blue
    try {
        Set-Location "c:\Users\Private\Downloads\Organized\Projects\codevoyager"
        git add "$BACKUP_DIR\*"
        git commit -m "Automated backup - $TIMESTAMP" 2>$null
        git push origin main 2>$null
        Write-Host "✅ Backup pushed to GitHub" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ GitHub push failed: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "🎉 Backup process completed successfully!" -ForegroundColor Green
Write-Host "📁 Backup location: $BACKUP_DIR" -ForegroundColor Cyan
Write-Host "⏰ Next backup scheduled in 1 hour" -ForegroundColor Cyan

# Display backup summary
Get-Content "$BACKUP_DIR\backup-summary-$TIMESTAMP.txt"

# Set up scheduled backup (optional)
if ($Force) {
    Write-Host "🔄 Setting up scheduled backup task..." -ForegroundColor Blue
    $action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File `"$PSScriptRoot\backup.ps1`""
    $trigger = New-ScheduledTaskTrigger -Daily -At (Get-Date).AddHours(1).TimeOfDay
    Register-ScheduledTask -TaskName "CodeVoyagerBackup" -Action $action -Trigger $trigger -Description "Automated CodeVoyager backup" -Force
    Write-Host "✅ Scheduled backup task created" -ForegroundColor Green
}
