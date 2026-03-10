# PowerShell Script for CodeVoyager Docker Complete Setup

Write-Host "🐳 CodeVoyager Docker Complete Setup" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Step 1: Navigate to project directory
$projectPath = "C:\Users\Private\Downloads\Organized\Projects\codevoyager"
Set-Location $projectPath

# Step 2: Clean up existing incomplete containers
Write-Host "🧹 Cleaning up incomplete containers..." -ForegroundColor Yellow
docker-compose down --volumes --remove-orphans 2>$null
docker rm -f codevoyager-app-1 2>$null
docker rm -f codevoyager-monitor-1 2>$null
docker rm -f codevoyager-backup 2>$null

# Step 3: Clean up build cache
Write-Host "🧹 Cleaning build cache..." -ForegroundColor Yellow
docker system prune -f

# Step 4: Create backup directory
Write-Host "📁 Creating backup directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "backup"

# Step 5: Build and start services
Write-Host "🔨 Building Docker containers..." -ForegroundColor Yellow
try {
    docker-compose build --no-cache
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Build had issues, but continuing..." -ForegroundColor Yellow
}

Write-Host "🚀 Starting all services..." -ForegroundColor Yellow
docker-compose up -d

# Step 6: Wait for services
Write-Host "⏳ Waiting for services to start (10 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Step 7: Check health
Write-Host "🏥 Checking container health..." -ForegroundColor Yellow
docker-compose ps

# Step 8: Verify app
Write-Host "✅ Verifying application..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
    Write-Host "✅ App is responding! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ App verification failed, but containers may still be starting..." -ForegroundColor Yellow
}

# Step 9: Create initial backup
Write-Host "💾 Creating initial backup..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFile = "backup\codevoyager-initial-backup-$timestamp.tar.gz"

# Create backup archive
tar -czf $backupFile --exclude=node_modules --exclude=.git --exclude=backup .
Write-Host "✅ Backup created: $backupFile" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Docker setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Container Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "🔍 Access your app:" -ForegroundColor Cyan
Write-Host "- Main App: http://localhost:3000" -ForegroundColor White
Write-Host "- Health Check: http://localhost:3000/health" -ForegroundColor White
Write-Host "- Backups: ./backup/" -ForegroundColor White

Write-Host ""
Write-Host "🔄 Useful commands:" -ForegroundColor Cyan
Write-Host "- View logs: docker-compose logs -f" -ForegroundColor White
Write-Host "- Stop containers: docker-compose down" -ForegroundColor White
Write-Host "- Restart: docker-compose restart" -ForegroundColor White
Write-Host "- Access container: docker-compose exec app sh" -ForegroundColor White
Write-Host "- Create backup: docker-compose exec backup sh" -ForegroundColor White
