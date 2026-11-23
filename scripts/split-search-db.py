"""把只读搜索库拆成低于GitHub单文件限制的分片，并生成校验清单。"""
import argparse
import hashlib
import json
from pathlib import Path


def digest(path: Path) -> str:
    hasher = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            hasher.update(chunk)
    return hasher.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path,
                        default=Path("andriod_player/app/src/main/assets/DB/music_cache.db"))
    parser.add_argument("--output", type=Path, default=Path("AppAssets/SearchDataParts"))
    parser.add_argument("--parts", type=int, default=3)
    args = parser.parse_args()

    if args.parts < 2:
        raise SystemExit("分片数至少为2")
    if not args.source.is_file():
        raise SystemExit(f"源文件不存在: {args.source}")

    total = args.source.stat().st_size
    chunk_size = (total + args.parts - 1) // args.parts
    if chunk_size >= 100 * 1024 * 1024:
        raise SystemExit("单个分片仍超过100MiB，请增加分片数")

    output = args.output
    output.mkdir(parents=True, exist_ok=True)
    for old in output.glob(args.source.name + ".part*"):
        old.unlink()

    parts = []
    with args.source.open("rb") as stream:
        for index in range(args.parts):
            data = stream.read(chunk_size)
            if not data:
                break
            name = f"{args.source.name}.part{index + 1:03d}"
            target = output / name
            target.write_bytes(data)
            parts.append({"name": name, "size": len(data), "sha256": digest(target)})

    manifest = {
        "source": args.source.name,
        "totalBytes": total,
        "sha256": digest(args.source),
        "parts": parts,
    }
    (output / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    hasher = hashlib.sha256()
    for part in parts:
        hasher.update((output / part["name"]).read_bytes())
    if hasher.hexdigest() != manifest["sha256"]:
        raise SystemExit("分片重组校验失败")

    print(json.dumps({
        "parts": len(parts),
        "partBytes": [part["size"] for part in parts],
        "sha256": manifest["sha256"],
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
