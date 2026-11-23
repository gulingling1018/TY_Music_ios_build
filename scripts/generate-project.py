"""用Python标准库生成独立Xcode原型工程；不修改Android或共用前端。"""
import hashlib
import json
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
NAME = "TYMusicProbe"


def identifier(name):
    return hashlib.sha256(name.encode()).hexdigest()[:24].upper()


def serialize(value, level=0):
    if isinstance(value, dict):
        rows = ["\t" * (level + 1) + json.dumps(key) + " = " + serialize(item, level + 1) + ";"
                for key, item in sorted(value.items())]
        return "{\n" + "\n".join(rows) + "\n" + "\t" * level + "}"
    if isinstance(value, list):
        return "(" + ", ".join(serialize(item, level) for item in value) + ")"
    if isinstance(value, int):
        return str(value)
    return json.dumps(value, ensure_ascii=False)


def generate(write=True):
    objects = {}

    def add(key, isa, **fields):
        result = identifier(key)
        if result in objects:
            raise ValueError("Duplicate object: " + key)
        objects[result] = {"isa": isa, **fields}
        return result

    def ref(path, kind):
        return add("ref:" + path, "PBXFileReference", path=path, sourceTree="SOURCE_ROOT", lastKnownFileType=kind)

    def build(path, file_ref):
        return add("build:" + path, "PBXBuildFile", fileRef=file_ref)

    app_sources, test_sources, all_refs, test_refs = [], [], [], []
    for folder, builds, refs in [("Sources", app_sources, all_refs), ("Tests", test_sources, test_refs)]:
        for path in sorted((ROOT / folder).rglob("*.swift")):
            relative = path.relative_to(ROOT).as_posix()
            file_ref = ref(relative, "sourcecode.swift")
            refs.append(file_ref)
            builds.append(build(relative, file_ref))
    resource = ref("AppAssets", "folder")
    fixtures = ref("Tests/Fixtures", "folder")
    info = ref("Config/Info.plist", "text.plist.xml")
    sqlite = add("ref:sqlite", "PBXFileReference", path="usr/lib/libsqlite3.tbd", sourceTree="SDKROOT", lastKnownFileType="sourcecode.text-based-dylib-definition")
    app_product = add("product:app", "PBXFileReference", path=NAME + ".app", sourceTree="BUILT_PRODUCTS_DIR", explicitFileType="wrapper.application", includeInIndex=0)
    test_product = add("product:tests", "PBXFileReference", path=NAME + "Tests.xctest", sourceTree="BUILT_PRODUCTS_DIR", explicitFileType="wrapper.cfbundle", includeInIndex=0)
    sources_group = add("group:sources", "PBXGroup", name="Sources", children=all_refs, sourceTree="<group>")
    tests_group = add("group:tests", "PBXGroup", name="Tests", children=test_refs + [fixtures], sourceTree="<group>")
    products = add("group:products", "PBXGroup", name="Products", children=[app_product, test_product], sourceTree="<group>")
    main = add("group:main", "PBXGroup", children=[sources_group, tests_group, resource, info, sqlite, products], sourceTree="<group>")

    def configs(key, extra):
        refs = []
        for mode in ("Debug", "Release"):
            settings = {"CLANG_ENABLE_MODULES": "YES", "SDKROOT": "iphoneos", "IPHONEOS_DEPLOYMENT_TARGET": "16.0",
                        "SWIFT_VERSION": "5.0", "SWIFT_OPTIMIZATION_LEVEL": "-Onone" if mode == "Debug" else "-O",
                        "DEBUG_INFORMATION_FORMAT": "dwarf" if mode == "Debug" else "dwarf-with-dsym"}
            if mode == "Debug":
                settings.update({"SWIFT_ACTIVE_COMPILATION_CONDITIONS": "DEBUG", "ENABLE_TESTABILITY": "YES"})
            settings.update(extra)
            refs.append(add(key + mode, "XCBuildConfiguration", name=mode, buildSettings=settings))
        return add(key + "list", "XCConfigurationList", buildConfigurations=refs, defaultConfigurationIsVisible=0, defaultConfigurationName="Release")

    project_id, app_id = identifier("project"), identifier("target:app")
    base = {"CODE_SIGN_STYLE": "Automatic", "DEVELOPMENT_TEAM": "", "TARGETED_DEVICE_FAMILY": "1,2",
            "SUPPORTED_PLATFORMS": "iphoneos iphonesimulator", "LD_RUNPATH_SEARCH_PATHS": ["$(inherited)", "@executable_path/Frameworks"]}
    app_configs = configs("appConfig", {**base, "PRODUCT_NAME": NAME, "PRODUCT_BUNDLE_IDENTIFIER": "site.meiluoluo.tymusic.ios",
                                         "INFOPLIST_FILE": "Config/Info.plist", "GENERATE_INFOPLIST_FILE": "NO"})
    test_configs = configs("testConfig", {**base, "PRODUCT_NAME": NAME + "Tests", "PRODUCT_BUNDLE_IDENTIFIER": "site.meiluoluo.tymusic.ios.tests",
                                           "GENERATE_INFOPLIST_FILE": "YES", "TEST_HOST": "$(BUILT_PRODUCTS_DIR)/" + NAME + ".app/" + NAME,
                                           "BUNDLE_LOADER": "$(TEST_HOST)"})
    project_configs = configs("projectConfig", {})

    def phase(key, kind, files):
        return add(key, kind, buildActionMask=2147483647, files=files, runOnlyForDeploymentPostprocessing=0)

    app_phases = [phase("phase:app:sources", "PBXSourcesBuildPhase", app_sources),
                  phase("phase:app:frameworks", "PBXFrameworksBuildPhase", [build("sqlite", sqlite)]),
                  phase("phase:app:resources", "PBXResourcesBuildPhase", [build("AppAssets", resource)])]
    test_phases = [phase("phase:test:sources", "PBXSourcesBuildPhase", test_sources),
                   phase("phase:test:frameworks", "PBXFrameworksBuildPhase", []),
                   phase("phase:test:resources", "PBXResourcesBuildPhase", [build("Fixtures", fixtures)])]
    add("target:app", "PBXNativeTarget", name=NAME, productName=NAME, productReference=app_product,
        productType="com.apple.product-type.application", buildConfigurationList=app_configs,
        buildPhases=app_phases, buildRules=[], dependencies=[])
    proxy = add("proxy:app", "PBXContainerItemProxy", containerPortal=project_id, proxyType=1, remoteGlobalIDString=app_id, remoteInfo=NAME)
    dependency = add("dependency:app", "PBXTargetDependency", target=app_id, targetProxy=proxy)
    test_id = add("target:tests", "PBXNativeTarget", name=NAME + "Tests", productName=NAME + "Tests", productReference=test_product,
                  productType="com.apple.product-type.bundle.unit-test", buildConfigurationList=test_configs,
                  buildPhases=test_phases, buildRules=[], dependencies=[dependency])
    add("project", "PBXProject", attributes={"LastUpgradeCheck": "1600", "TargetAttributes": {app_id: {"CreatedOnToolsVersion": "16.0"},
                                                                                              test_id: {"CreatedOnToolsVersion": "16.0", "TestTargetID": app_id}}},
        buildConfigurationList=project_configs, compatibilityVersion="Xcode 14.0", developmentRegion="zh_CN",
        knownRegions=["zh_CN", "en", "Base"], mainGroup=main, productRefGroup=products,
        projectDirPath="", projectRoot="", targets=[app_id, test_id])
    document = {"archiveVersion": 1, "classes": {}, "objectVersion": 56, "objects": objects, "rootObject": project_id}
    folder = ROOT / (NAME + ".xcodeproj")
    if write:
        folder.mkdir(exist_ok=True)
        (folder / "project.pbxproj").write_text("// !$*UTF8*$!\n" + serialize(document) + "\n", encoding="utf-8")
    schemes = folder / "xcshareddata/xcschemes"
    if write:
        schemes.mkdir(parents=True, exist_ok=True)

    def buildable(target, product, name):
        return f'<BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="{target}" BuildableName="{escape(product)}" BlueprintName="{name}" ReferencedContainer="container:{NAME}.xcodeproj"/>'

    app = buildable(app_id, NAME + ".app", NAME)
    tests = buildable(test_id, NAME + "Tests.xctest", NAME + "Tests")
    scheme = f'''<?xml version="1.0" encoding="UTF-8"?>
<Scheme LastUpgradeVersion="1600" version="1.3">
 <BuildAction parallelizeBuildables="YES" buildImplicitDependencies="YES"><BuildActionEntries>
  <BuildActionEntry buildForTesting="YES" buildForRunning="YES" buildForProfiling="YES" buildForArchiving="YES" buildForAnalyzing="YES">{app}</BuildActionEntry>
  <BuildActionEntry buildForTesting="YES" buildForRunning="NO" buildForProfiling="NO" buildForArchiving="NO" buildForAnalyzing="YES">{tests}</BuildActionEntry>
 </BuildActionEntries></BuildAction>
 <TestAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.IDEFoundation.Launcher.LLDB" shouldUseLaunchSchemeArgsEnv="YES"><Testables><TestableReference skipped="NO">{tests}</TestableReference></Testables></TestAction>
 <LaunchAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.IDEFoundation.Launcher.LLDB" launchStyle="0" useCustomWorkingDirectory="NO" ignoresPersistentStateOnLaunch="NO" debugDocumentVersioning="YES" debugServiceExtension="internal" allowLocationSimulation="YES"><BuildableProductRunnable runnableDebuggingMode="0">{app}</BuildableProductRunnable></LaunchAction>
 <ProfileAction buildConfiguration="Release" shouldUseLaunchSchemeArgsEnv="YES" savedToolIdentifier="" useCustomWorkingDirectory="NO" debugDocumentVersioning="YES"><BuildableProductRunnable runnableDebuggingMode="0">{app}</BuildableProductRunnable></ProfileAction>
 <AnalyzeAction buildConfiguration="Debug"/>
 <ArchiveAction buildConfiguration="Release" revealArchiveInOrganizer="YES"/>
</Scheme>'''
    if write:
        (schemes / (NAME + ".xcscheme")).write_text(scheme + "\n", encoding="utf-8")
    return document


if __name__ == "__main__":
    result = generate()
    print(f"Generated {NAME}.xcodeproj: {len(result['objects'])} objects")
