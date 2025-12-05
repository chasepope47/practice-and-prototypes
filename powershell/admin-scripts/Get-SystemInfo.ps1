#Basic system info script
Write-Host "=== System Info ==="
Write-Host "Computer Name:" $env:COMPUTERNAME
Write-Host "User:" $env:USERNAME
Write-Host "OS Version:" (Get-CimInstance Win32_OperatingSystem).Version
Write-Host "Last Boot TIme:" (Get-CimInstance Win32_OperatingSystem).LastBootUpTime