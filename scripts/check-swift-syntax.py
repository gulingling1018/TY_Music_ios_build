"""可选Tree-sitter语法扫描；仅检查语法树，不进行Swift类型检查或Apple SDK编译。"""
import argparse
import json
import sys
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--modules", type=Path, help="可选的验证工具安装目录")
parser.add_argument("--output", type=Path)
args = parser.parse_args()
if args.modules:
    sys.path.insert(0, str(args.modules))
try:
    from tree_sitter import Language, Parser
    import tree_sitter_swift
except ImportError:
    raise SystemExit("Optional validation tools missing: tree-sitter, tree-sitter-swift")

root = Path(__file__).resolve().parents[1]
swift = Parser(Language(tree_sitter_swift.language()))
errors, files = [], []
for folder in ("Sources", "Tests"):
    for path in sorted((root / folder).rglob("*.swift")):
        tree = swift.parse(path.read_bytes())
        files.append(path.relative_to(root).as_posix())
        stack = [tree.root_node]
        while stack:
            node = stack.pop()
            if node.type == "ERROR" or node.is_missing:
                errors.append({"file": files[-1], "line": node.start_point.row + 1,
                               "column": node.start_point.column + 1, "type": node.type})
            stack.extend(reversed(node.children))
report = {"status": "passed" if not errors else "failed", "files": files, "errors": errors,
          "scope": "Tree-sitter syntax only; not Swift compiler, typechecking, XCTest or iOS runtime"}
if args.output:
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, ensure_ascii=False))
raise SystemExit(bool(errors))
