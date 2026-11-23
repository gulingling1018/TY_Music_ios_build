"""显式复制现有只读内置搜索库到iOS资源，SHA256核对，不修改原数据库。"""
import hashlib
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / "andriod_player/app/src/main/assets/DB/music_cache.db"
TARGET = ROOT / "Resources/SearchData/music_cache.db"


def digest(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


if __name__ == "__main__":
    if not SOURCE.is_file():
        raise SystemExit("Bundled search database not found")
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    expected = digest(SOURCE)
    if not TARGET.exists() or digest(TARGET) != expected:
        shutil.copyfile(SOURCE, TARGET)
    if digest(TARGET) != expected:
        raise SystemExit("Database checksum mismatch")
    print(f"Staged {TARGET.stat().st_size} bytes; SHA256={expected}")
