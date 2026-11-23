"""打包本地原型源码与内置测试资源，不包含Android签名文件、账号或验证工具。"""
import hashlib
import json
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
IOS = ROOT / "ios_player"
OUTPUT = ROOT / "docs/test-reports/evidence/[17]IOS_PROTOTYPE_20261114"

if __name__ == "__main__":
    OUTPUT.mkdir(parents=True, exist_ok=True)
    destination = OUTPUT / "TYMusic-iOS-prototype-source.zip"
    files = [IOS / "README.md", IOS / ".gitignore"]
    for folder in ("Sources", "Tests", "AppAssets", "Config", "scripts", "TYMusicProbe.xcodeproj"):
        files.extend(path for path in (IOS / folder).rglob("*") if path.is_file()
                     and "__pycache__" not in path.parts and "xcuserdata" not in path.parts)
    for name in ("[17]IOS_EXPANSION_PLAN_20261114.md", "[17]IOS_BRIDGE_CONTRACT_20261114.md", "[17]IOS_PROTOTYPE_PROGRESS_20261114.md"):
        file = ROOT / "docs" / name
        if file.exists():
            files.append(file)
    inventory = ROOT / "docs/test-reports/[17]IOS_CONTRACT_INVENTORY_20261114.json"
    if inventory.exists():
        files.append(inventory)
    with zipfile.ZipFile(destination, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for file in sorted(set(files)):
            archive.write(file, file.relative_to(ROOT).as_posix())
    with destination.open("rb") as stream:
        checksum = hashlib.file_digest(stream, "sha256").hexdigest()
    with zipfile.ZipFile(destination) as archive:
        invalid = archive.testzip()
        assert invalid is None, invalid
    report = {"path": destination.relative_to(ROOT).as_posix(), "files": len(set(files)),
              "bytes": destination.stat().st_size, "sha256": checksum,
              "kind": "source archive, not signed IPA"}
    (OUTPUT / "source-package.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False))
