$ErrorActionPreference = "Stop"

$baseUrl = "http://localhost:5086/api"
$email = "testflow_$(Get-Random)@example.com"
$password = "Password123!"

Write-Host "1. Registering user $email..."
$regBody = @{
    email = $email
    password = $password
    fullName = "Flow Tester"
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/register" -ContentType "application/json" -Body $regBody
} catch {
    Write-Host "Error registering:"
    # Fix for reading stream in PS Core
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = [System.IO.StreamReader]::new($stream)
    $body = $reader.ReadToEnd()
    Write-Error $body
    exit
}
$token = $regResponse.token
Write-Host "   Success! Token received."

$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "2. Creating a Challenge..."
$chalBody = @{
    title = "My First Challenge"
    goalDescription = "Code every day"
    startDate = (Get-Date).ToString("yyyy-MM-dd")
    notes = "Let's do this"
} | ConvertTo-Json

try {
    $chalResponse = Invoke-RestMethod -Method Post -Uri "$baseUrl/challenge" -Headers $headers -ContentType "application/json" -Body $chalBody
} catch {
    Write-Error "Error Creating Challenge: $($_.Exception.Message)"
    Write-Host "Response: $($_.ErrorDetails.Message)"
    exit
}
Write-Host "   Success! Challenge ID: $($chalResponse.id)"

Write-Host "3. getting Challenges..."
$listResponse = Invoke-RestMethod -Method Get -Uri "$baseUrl/challenge" -Headers $headers
Write-Host "   Found $($listResponse.Count) challenges."

if ($listResponse.Count -ge 1) {
    Write-Host "TEST PASSED: Full flow working."
} else {
    Write-Error "TEST FAILED: Challenge not found in list."
}
