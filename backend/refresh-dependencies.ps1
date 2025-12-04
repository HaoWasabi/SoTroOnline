# PowerShell script to refresh Maven dependencies and fix POI version issues
Write-Host "Cleaning and rebuilding project to fix POI version compatibility..." -ForegroundColor Yellow
Write-Host ""

Set-Location $PSScriptRoot

Write-Host "Step 1: Clean all compiled classes" -ForegroundColor Green
& mvn clean
Write-Host ""

Write-Host "Step 2: Download and compile with correct POI 5.3.0 and Commons IO 2.16.1" -ForegroundColor Green
& mvn compile -DskipTests
Write-Host ""

Write-Host "Step 3: Verify POI dependencies" -ForegroundColor Green
& mvn dependency:tree | Select-String "poi"
Write-Host ""

Write-Host "Done! POI dependencies should now be updated to version 5.3.0+" -ForegroundColor Yellow
Write-Host "You can now try the receipt export again." -ForegroundColor Yellow
Read-Host "Press Enter to continue..."