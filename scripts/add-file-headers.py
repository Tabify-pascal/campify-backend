from pathlib import Path
import subprocess
import sys

AUTHOR = "Pascal Thomasse Mol"
ROOT = Path("src")
DRY_RUN = "--apply" not in sys.argv


def get_first_commit_date(path: Path):
    result = subprocess.run(
        [
            "git", "log",
            "--follow",
            "--format=%as",
            "--",
            str(path),
        ],
        capture_output=True,
        text=True,
        check=True,
    )

    dates = result.stdout.strip().splitlines()
    return dates[-1] if dates else None


def has_header(content: str):
    return "@file" in content[:1000] or "@author" in content[:1000]


def main():
    updated = 0
    skipped = 0
    missing = []

    files = sorted(
        path
        for path in ROOT.rglob("*")
        if path.suffix in (".ts", ".tsx")
        and not path.name.endswith(".d.ts")
    )

    for path in files:
        content = path.read_text(encoding="utf-8")

        if has_header(content):
            skipped += 1
            continue

        date = get_first_commit_date(path)

        if not date:
            missing.append(str(path))
            continue

        header = (
            "/**\n"
            f" * @file {path.name}\n"
            f" * @author {AUTHOR}\n"
            f" * @since {date}\n"
            " */\n\n"
        )

        if not DRY_RUN:
            path.write_text(header + content, encoding="utf-8")

        print(f"{'[PREVIEW]' if DRY_RUN else '[UPDATED]'} {path} ({date})")
        updated += 1

    print(f"\nBestanden: {len(files)}")
    print(f"{'Te wijzigen' if DRY_RUN else 'Gewijzigd'}: {updated}")
    print(f"Overgeslagen (bestaande header): {skipped}")
    print(f"Geen Git-datum: {len(missing)}")

    for path in missing:
        print(f"  - {path}")


if __name__ == "__main__":
    main()
