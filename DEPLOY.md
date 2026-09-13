# Deploying to https://mekala27-45.github.io

The repo `mekala27-45/mekala27-45.github.io` already serves your old portfolio.
This replaces it and keeps the old one on a branch.

## One time, from this folder

```bash
git remote add origin https://github.com/mekala27-45/mekala27-45.github.io
git fetch origin

# keep the old site, nothing is lost
git branch old-site-2026-09 origin/main
git push origin old-site-2026-09

# publish the new source
git push --force origin main
```

On Windows without Git Bash, run `deploy.ps1` in PowerShell instead. It does the
same thing.

## Then, once, in the repo settings

Settings, Pages, Build and deployment, Source: **GitHub Actions**.

The workflow at `.github/workflows/deploy-pages.yml` builds the static export and
publishes it. The first run takes about two minutes. After that every push to
`main` redeploys.

Optionally set a repository variable `NEXT_PUBLIC_SITE_URL` to
`https://mekala27-45.github.io` under Settings, Secrets and variables, Actions,
Variables. Without it the build falls back to the same value.

## Rolling back

```bash
git push --force origin old-site-2026-09:main
```
