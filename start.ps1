Write-Host "Starting SakuraCycle..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening in your default browser..." -ForegroundColor Green
Start-Process "http://localhost:8000/standalone.html"
Write-Host ""
Write-Host "Server is running on http://localhost:8000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
python -m http.server 8000
