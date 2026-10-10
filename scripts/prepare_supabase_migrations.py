"""Convert legacy 0001_name.sql migrations into Supabase CLI timestamp filenames."""
from pathlib import Path
import re
import shutil

root = Path(__file__).resolve().parents[1]
source = root / "web" / "supabase" / "migrations"
destination = root / "supabase" / "migrations"
files = sorted(source.glob("*.sql"))
if len(files) != 24:
    raise SystemExit(f"Expected 24 source migrations, got {len(files)}")
destination.mkdir(parents=True, exist_ok=True)
for i, path in enumerate(files, start=1):
    match = re.fullmatch(r"(\d{4})_([a-z0-9_]+)\.sql", path.name)
    if not match or int(match.group(1)) != i:
        raise SystemExit(f"Invalid migration ordering: {path.name}")
    target = destination / f"20261010{i:06d}_{match.group(2)}.sql"
    shutil.copyfile(path, target)
    print(target.relative_to(root))
