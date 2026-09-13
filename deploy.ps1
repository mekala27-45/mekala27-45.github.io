# Publishes this repo to https://mekala27-45.github.io
# Run from the folder that contains package.json:  .\deploy.ps1
$ErrorActionPreference = 'Stop'

$repo = 'https://github.com/mekala27-45/mekala27-45.github.io'
$backup = 'old-site-' + (Get-Date -Format 'yyyy-MM-dd')

if (-not (git remote | Select-String -Quiet '^origin$')) {
  git remote add origin $repo
} else {
  git remote set-url origin $repo
}

git fetch origin
Write-Host "Keeping the current live site on branch $backup"
git branch -f $backup origin/main
git push origin $backup

Write-Host 'Publishing the new site to main'
git push --force origin main

Write-Host ''
Write-Host 'Pushed. Now open:'
Write-Host '  https://github.com/mekala27-45/mekala27-45.github.io/settings/pages'
Write-Host 'and set Source to "GitHub Actions". The first build takes about two minutes.'
