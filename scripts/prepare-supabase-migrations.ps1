# Converts archived, sequentially numbered SQL files into Supabase CLI timestamp migrations.
# Run at repository root. Does not contact or modify any database.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$source = Join-Path $root 'web/supabase/migrations'
$destination = Join-Path $root 'supabase/migrations'
if (!(Test-Path $source)) { throw "Source migrations not found: $source" }
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$files = @(Get-ChildItem -Path $source -Filter '*.sql' | Sort-Object Name)
if ($files.Count -ne 24) { throw "Expected 24 original migrations; found $($files.Count). Review repository before proceeding." }
for ($i = 0; $i -lt $files.Count; $i++) {
  $expected = ('{0:D4}_' -f ($i + 1))
  if (!$files[$i].Name.StartsWith($expected)) { throw "Unexpected migration order: $($files[$i].Name)" }
  $timestamp = '20261010' + ('{0:D6}' -f ($i + 1))
  $suffix = $files[$i].BaseName.Substring(5)
  $target = Join-Path $destination ($timestamp + '_' + $suffix + '.sql')
  Copy-Item -LiteralPath $files[$i].FullName -Destination $target -Force
  Write-Host "Prepared $($files[$i].Name) -> $(Split-Path -Leaf $target)"
}
Write-Host 'Prepared 24 CLI migrations. Review git diff and commit them before db push.'
