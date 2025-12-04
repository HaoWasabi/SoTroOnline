@echo off
echo Cleaning and rebuilding project to fix POI version compatibility...
echo.

cd /d "%~dp0"

echo Step 1: Clean all compiled classes
call mvn clean
echo.

echo Step 2: Download and compile with correct POI 5.3.0 and Commons IO 2.16.1
call mvn compile -DskipTests
echo.

echo Step 3: Verify POI dependencies
call mvn dependency:tree | findstr "poi"
echo.

echo Done! POI dependencies should now be updated to version 5.3.0+
echo You can now try the receipt export again.
pause