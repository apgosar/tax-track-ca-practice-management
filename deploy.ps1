if (-not (Test-Path .env)) {
    Write-Error ".env file not found"; exit 1
}

$envVars = Get-Content .env | Where-Object { $_ -match '^VITE_' -and $_ -notmatch '^#' }
$buildEnvVars = $envVars -join ','

gcloud run deploy taxtrack `
    --source . `
    --project taxtrack-495412 `
    --region asia-south1 `
    --allow-unauthenticated `
    --build-env-vars $buildEnvVars
