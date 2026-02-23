@echo off
echo Starting SakuraCycle...
echo.
echo Opening in your default browser...
start http://localhost:8000/standalone.html
echo.
echo Server is running on http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
