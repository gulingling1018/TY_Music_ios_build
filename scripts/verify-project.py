"""验证生成工程的引用、资源与编码；不能替代Xcode编译。"""
import json
import plistlib
import runpy
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
module = runpy.run_path(str(ROOT / "scripts/generate-project.py"))
model = module["generate"](write=False)
objects = model["objects"]
actual = (ROOT / "TYMusicProbe.xcodeproj/project.pbxproj").read_text(encoding="utf-8")
assert actual == "// !$*UTF8*$!\n" + module["serialize"](model) + "\n", "Project is stale; regenerate it"
single_refs = {"fileRef", "mainGroup", "productRefGroup", "productReference", "buildConfigurationList", "containerPortal", "target", "targetProxy", "remoteGlobalIDString"}
array_refs = {"children", "buildConfigurations", "buildPhases", "dependencies", "targets", "files"}
for obj in objects.values():
    for key, value in obj.items():
        if key in single_refs:
            assert value in objects, (key, value)
        if key in array_refs:
            assert all(ref in objects for ref in value), (key, value)
    if obj["isa"] == "PBXFileReference" and obj.get("sourceTree") == "SOURCE_ROOT":
        assert (ROOT / obj["path"]).exists(), "Missing source/resource: " + obj["path"]
scheme = ET.parse(ROOT / "TYMusicProbe.xcodeproj/xcshareddata/xcschemes/TYMusicProbe.xcscheme")
for node in scheme.findall(".//BuildableReference"):
    assert node.attrib["BlueprintIdentifier"] in objects
with (ROOT / "Config/Info.plist").open("rb") as stream:
    info = plistlib.load(stream)
assert info["UIBackgroundModes"] == ["audio"]
assert info["UIApplicationSceneManifest"]["UISceneConfigurations"]["UIWindowSceneSessionRoleApplication"][0]["UISceneDelegateClassName"] == "$(PRODUCT_MODULE_NAME).SceneDelegate"
assert "UILaunchScreen" in info
assert "NSAppTransportSecurity" not in info, "Prototype must not disable ATS globally"
checked = 0
for path in ROOT.rglob("*"):
    if path.suffix in (".swift", ".mjs", ".html", ".css", ".plist", ".py", ".json", ".md", ".pbxproj", ".xcscheme"):
        content = path.read_text(encoding="utf-8")
        assert "\ufffd" not in content, str(path)
        checked += 1
print(json.dumps({"status": "passed", "objects": len(objects), "textFiles": checked,
                  "scope": "project references, resources, plist, scheme, UTF-8 only; not Swift typechecking or iOS runtime"}))
