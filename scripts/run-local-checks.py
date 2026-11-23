"""运行已授权原型的本地验证并记录证据，不执行Git、安装依赖或Apple签名。"""
import argparse
import datetime
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "docs/test-reports/evidence/[17]IOS_PROTOTYPE_20261114"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--swift-modules", type=Path)
    parser.add_argument("--browser-module", type=Path)
    args = parser.parse_args()
    node = shutil.which("node")
    if not node:
        raise SystemExit("Node is required for bridge behavior tests")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    skipped = []
    commands = [
        ("project", [sys.executable, "ios_player/scripts/verify-project.py"]),
        ("bridge", [node, "--test", "ios_player/Tests/native-client.test.mjs"])
    ]
    if (ROOT / "scripts/audit-ios-contracts.py").is_file() and (ROOT / "frontend/src").is_dir():
        commands.insert(0, ("inventory", [sys.executable, "scripts/audit-ios-contracts.py"]))
    else:
        skipped.append("inventory extraction requires full workspace; source archive includes prior inventory only")
    if args.swift_modules:
        commands.append(("swift-syntax", [sys.executable, "ios_player/scripts/check-swift-syntax.py", "--modules", str(args.swift_modules),
                                           "--output", str(OUTPUT / "swift-syntax.json")]))
    else:
        skipped.append("optional Swift syntax scan: validation modules not supplied")
    environment = dict(os.environ)
    if args.browser_module:
        environment["PLAYWRIGHT_MODULE"] = str(args.browser_module)
        commands.append(("web-resources", [node, "ios_player/scripts/verify-web-resources.cjs"]))
    else:
        skipped.append("optional Chromium HTTP resources: browser module not supplied")
    results = []
    for label, command in commands:
        process = subprocess.run(command, cwd=ROOT, env=environment, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                                 encoding="utf-8", errors="strict", timeout=120)
        (OUTPUT / (label + ".log")).write_text(process.stdout, encoding="utf-8")
        results.append({"name": label, "exitCode": process.returncode, "status": "passed" if process.returncode == 0 else "failed",
                        "log": label + ".log"})
        print(label + ": " + results[-1]["status"])
    report = {"batch": 17, "time": datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(),
              "results": results,
              "notRun": skipped + ["Xcode project loading/building", "Apple SDK typechecking", "native XCTest execution",
                         "WKWebView scheme runtime", "iPhone signing/install/background playback/download"],
              "status": "passed" if all(x["exitCode"] == 0 for x in results) else "failed"}
    (OUTPUT / "local-checks.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 0 if report["status"] == "passed" else 1


if __name__ == "__main__":
    raise SystemExit(main())
