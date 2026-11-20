param([string]$OutDir = ".\\handoff-out\\PJ2608-0550")

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$branch = git branch --show-current
$head = git rev-parse HEAD
$dirty = git status --porcelain
$log = git log -n 25 --date=iso --pretty=format:"%H | %ad | %s"

$files = @(
  "docs/handoff/pj2608-0550/00_HANDOFF_CURRENT.md",
  "docs/handoff/pj2608-0550/01_CURRENT_STATE.json",
  "docs/handoff/pj2608-0550/11_NEW_CHAT_RESUME_PROMPT.md",
  "frontend/src/project0550/architectureManifest.js",
  "frontend/src/project0550/moduleRegistry.js",
  "frontend/src/project0550/projectFacts.js",
  "frontend/src/project0550/serviceEquationModel.js",
  "frontend/src/project0550/b1CostLineage.js",
  "frontend/src/project0550/data.js",
  "frontend/src/project0550/data/snapshots/pj2608-0550.rev07.json",
  "frontend/src/project0550/knowledgeKernelBinding.js",
  "frontend/src/knowledge-kernels/library.js",
  "frontend/src/knowledge-kernels/regulatoryMyanmar.js",
  "frontend/src/project0550/regulatoryBinding.js",
  "frontend/src/pages/PJ26080550.jsx",
  "frontend/src/project0550/project0550.css"
)

$meta = [ordered]@{
  generated_at = (Get-Date).ToString("o")
  branch = $branch
  head = $head
  dirty = [bool]$dirty
  dirty_files = @($dirty)
  npm_version = (npm --version)
  node_version = (node --version)
}
$meta | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 (Join-Path $OutDir "00_RUNTIME_META.json")
$log | Set-Content -Encoding UTF8 (Join-Path $OutDir "01_RECENT_COMMITS.txt")

foreach ($f in $files) {
  if (Test-Path $f) {
    $dest = Join-Path $OutDir $f
    New-Item -ItemType Directory -Force -Path (Split-Path $dest -Parent) | Out-Null
    Copy-Item $f $dest -Force
  }
}

git diff | Set-Content -Encoding UTF8 (Join-Path $OutDir "02_WORKTREE_DIFF.patch")
git diff --cached | Set-Content -Encoding UTF8 (Join-Path $OutDir "03_STAGED_DIFF.patch")

$bundle = Join-Path $OutDir "PJ2608-0550_FULL_HISTORY.bundle"
git bundle create $bundle --all

$zip = "$OutDir.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $OutDir "*") -DestinationPath $zip -Force

Write-Host ""
Write-Host "PJ2608-0550 handoff package created:"
Write-Host "  Folder: $OutDir"
Write-Host "  ZIP:    $zip"
Write-Host "  Branch: $branch"
Write-Host "  HEAD:   $head"
if ($dirty) { Write-Warning "Working tree has uncommitted changes. Review 02_WORKTREE_DIFF.patch." }