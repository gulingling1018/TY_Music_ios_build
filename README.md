# [17] TY_Music iOS 风险验证工程

> **本仓库是主仓库 `TY_Music` 中 `ios_player/` 的公开构建镜像，源码公开可见。** 请勿直接在此仓库开发：改动应回到主仓库，再同步过来。本文中 `ios_player/` 前缀在本仓库对应根目录，例如 `python ios_player/scripts/verify-project.py` 对应 `python scripts/verify-project.py`。

这是已批准第17批的A/B阶段产物，供验证原生播放、后台队列、资源容器、SQLite和下载可行性。**已通过GitHub Actions完成Xcode设备版Release编译并产出未签名IPA；尚未在iPhone上运行，不是全功能iOS版本。** 正式Vue界面已接入为默认入口，播放管理、本地搜索和B站下载仍在迁移中。

## [01] 目录与依赖

- `Sources/App`：应用装配、生命周期、WKWebView验证入口。
- `Sources/Bridge`：来源检查、消息协议、操作路由、自定义资源scheme。
- `Sources/Capabilities`：路径规则、文件选择、媒体解析、SQLite检查。
- `Sources/Domain`：原生队列/AVPlayer、B站匿名解析、原型后台传输。
- `Sources/Data`：原子JSON持久化、媒体副本存储。
- `Resources/Web`：独立验证页面，不修改现有Vue产品页面。
- `Tests`：原生XCTest和本地Node桥测试；两者验证范围不同。
- `scripts`：标准库Xcode工程生成、资源暂存和本地验证。

App只用系统UIKit、WebKit、AVFoundation、MediaPlayer、UniformTypeIdentifiers、SQLite3；没有新增第三方运行时。采用UIScene生命周期并配置Launch Screen，符合[Apple的iOS27启动要求](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle)。Python3用于工程生成；Node用于本地桥接测试。可选Tree-sitter仅做语法检查，Playwright仅做HTTP资源页面验证，均不是App依赖。

## [02] Windows可执行的本地检查

在仓库根目录执行：

```powershell
python scripts/audit-ios-contracts.py
python ios_player/scripts/generate-project.py
python ios_player/scripts/verify-project.py
node --test ios_player/Tests/native-client.test.mjs
```

也可在GitHub Actions运行镜像仓库的`iOS 未签名安装包（IPA）`workflow，获得未签名IPA；它仍不是Mac真机验收。

Xcode工程已生成并保存，可直接复制`ios_player`目录到Mac打开。新增/删除Swift文件后先重新生成；生成器会覆盖工程配置，签名团队建议在Xcode中选择或命令行传入，不写私钥到工程。

独立源码ZIP包含原型及本轮清点报告，不包含整个Android项目；清点脚本需要完整工作区。源码包中运行本地检查时，会明确跳过缺少完整工作区的重新清点，其余工程和桥接检查仍可执行。

搜索库可选暂存（约102MiB，来源为现有Android只读内置库）：

```powershell
python ios_player/scripts/stage-search-db.py
```

暂存后用SHA256确认副本一致，不运行建库/迁移。未暂存时SQLite按钮明确返回`not_staged`，不能算数据库兼容通过。资源目录以folder reference加入Xcode，暂存数据库后无需修改工程文件。

可选语法检查，验证环境需有`tree-sitter`与`tree-sitter-swift`：

```powershell
python ios_player/scripts/check-swift-syntax.py --modules <验证工具目录>
```

可选浏览器检查，需已有Playwright/Chromium；可用`PLAYWRIGHT_MODULE`指定模块：

```powershell
node ios_player/scripts/verify-web-resources.cjs
```

它只验证Chromium下HTTP资源、JS模块、Worker、图片、Blob和存储回读。普通浏览器拒绝原生桥是预期行为；不能用该测试替代WKWebView自定义scheme验收。

## [03] Mac首次构建与测试

用户设备信息为iPhone12 mini、iOS27，暂无开发者账号。请选择Apple官方表中支持该设备具体系统版本的macOS/Xcode；本轮查到Xcode27系列需要macOS Tahoe26.6或更新，实际使用前再核对系统要求。无需现在购买硬件。

自动构建运行在公开镜像仓库[`gulingling1018/TY_Music_ios_build`](https://github.com/gulingling1018/TY_Music_ios_build)的`.github/workflows/ios-build.yml`：在macOS runner上校验工程、运行Node桥接测试、用Release/iphoneos编译设备版本并打包成未签名IPA（artifact名`ios-unsigned-ipa`）。IPA不含证书或描述文件，需自行用Sideloadly、AltStore、ESign等工具签名后安装；免费Apple ID签名仍为7天有效期。模拟器XCTest改为手动可选，原因是Xcode 26.6 + iOS 26.5模拟器在安装阶段存在`Missing bundle ID`运行时问题。该镜像仓库源码公开可见，CI通过不替代下文Mac与iPhone真机验收。

将`ios_player`及可选搜索库副本放入可用Mac，在该目录执行：

```sh
xcodebuild -version
xcodebuild -list -project TYMusicProbe.xcodeproj
xcodebuild -project TYMusicProbe.xcodeproj -scheme TYMusicProbe \
  -configuration Debug -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath build/DerivedData build
xcrun simctl list devices available
```

选取实际存在的iOS模拟器UDID后运行原生测试（替换占位值）：

```sh
xcodebuild -project TYMusicProbe.xcodeproj -scheme TYMusicProbe \
  -configuration Debug -destination 'platform=iOS Simulator,id=SIMULATOR_UDID' \
  -derivedDataPath build/DerivedData -resultBundlePath build/NativeTests.xcresult \
  test
```

测试目标包括队列模式/随机置换、重复身份、持久化、目录穿越/符号链接、桥接消息和B站解析规则。Tree-sitter通过不代表这些XCTest已执行。原生编译或测试失败必须先修复，再进入下一阶段。

模拟器构建使用Xcode默认的ad-hoc签名，不要加`CODE_SIGNING_ALLOWED=NO`。Xcode 26.6 + iOS 26.5的模拟器在安装阶段可能报`Missing bundle ID`（加不加签名都会出现，属于运行时问题），这不影响设备版IPA打包。

## [04] iPhone签名与安装

1. 在Mac打开`TYMusicProbe.xcodeproj`，在Xcode登录自己的Apple账号；账号操作由用户在Xcode中完成，无需提供密码给助手。
2. 选择`TYMusicProbe`目标的Signing & Capabilities，启用自动签名，选择自己的Personal Team；如标识冲突，设为自己账号下唯一Bundle ID。
3. 连接iPhone，完成信任与设备要求的开发者模式设置，选择设备运行。远程Mac方式需要先明确设备连接/配对或签名安装路径，不保证只有远程构建就能直接安装。
4. 免费Personal Team的安装描述文件有效期7天，到期需重建/重装。先验证安装、重装保留数据与续签，再安排长期使用。
5. 也可以不使用Xcode：从镜像仓库Actions下载`ios-unsigned-ipa`，用Sideloadly、AltStore、ESign等工具自行签名安装。签名工具会注入自己的证书和描述文件，免费个人签名同样受7天有效期限制。
6. 外部CI只负责未签名编译和IPA打包，不接触证书、私钥或描述文件；是否为长期使用开通付费账号，另行决定。

## [05] B阶段设备验收顺序

1. 冷启动页面，检测资源：模块、动态import、fetch、图片、Worker、Blob、IndexedDB和localStorage；刷新、退出重开、覆盖安装后检查旧值仍可读。自定义scheme任何关键能力失败时先调整容器方案。
2. 检测SQLite FTS4/FTS5；暂存搜索库后检查只读打开、歌曲数与FTS查询。正式搜索算法及结果一致性留待C阶段，不能据此标记已完成搜索移植。
3. 导入至少两首本地音频，检查播放/暂停、前后切歌、进度定位、三种模式、关闭重开恢复；原型冷启动恢复后保持暂停，由用户开始播放。
4. 连续锁屏至少30分钟并跨越多首歌；操作锁屏卡片和耳机，检查拔出耳机暂停、来电中断、前后台恢复。不能只凭通知卡片存在判断后台播放通过。
5. 使用自己可访问的HTTPS音频测试网络播放/下载；下载成功后加入队列验证实际可播，检查错误HTTP、取消、弱网和系统恢复。用户强退后传输停止是系统边界，不承诺绕过。
6. 输入实际BV号/完整视频URL和分P，测试匿名DASH音频下载与本地播放。短链接、AV号、登录资源、分段和转码目前未实现，不能宣称覆盖Android下载全部能力。
7. 记录设备、系统补丁版本、Xcode、签名团队类型、构建日志、XCTest结果、截图及30分钟播放证据。所有B阶段门槛满足后，再继续C阶段完整业务。

## [06] 原型限制

- 正式歌单、完整搜索、统计、皮肤、扫码登录、授权目录原位扫描和完整下载策略尚未移植。
- 本地音频当前复制导入，资源ID用于原型；正式路径身份需遵守第15批路径独立规则。
- 新增音频会重置原型队列游标；最多1000首、8个同时传输、1000条原型任务记录。正式前端接入前需要对齐现有队列交互和保留策略。
- 网络地址可能过期；原型不持久保存B站已解析的签名URL，只保存下载记录。手工加入的网络音频地址会存在本机队列恢复文件中，不对外上传。
- 原生下载完成仅表示得到媒体文件，格式是否能播放仍以AVPlayer实测为准；没有完整转码链。
- 当前没有Mac，因此Xcode工程格式、Apple SDK类型检查、原生XCTest与iPhone行为均待验收；Windows检查不是iOS编译成功证明。

## [07] 正式前端接入（2026-11-23）

- 默认入口改为`Resources/WebApp/index.html`，即`frontend/dist`的生产构建产物；探针页仍保留在`Resources/Web/index.html`。
- `tymusic://`自定义scheme根目录改为`Resources`，前端相对资源可直接加载；`/api/cover/*`统一返回内置占位封面。
- 新增`AndroidAPIHandler`，在文档开始注入`window.Android`兼容层并把`callApiAsync`转给Swift；当前已实现`/api/playlists`与内置歌单空详情，其余接口显式返回501。
- 构建产物内的`file:///android_asset/`已替换为`tymusic://app/WebApp/`，避免iOS加载Android私有路径。
- 未完成：真实歌单数据、播放管理、本地搜索、B站下载；按模块继续接入。
- 复现说明：`frontend/dist`由Vite生产构建生成；当前Vite 7.3.3对该`index.html`的内联样式报html-inline-proxy错误，暂用现有生产产物，修复构建后再改为CI内重建。

方案与契约见`docs/[17]IOS_EXPANSION_PLAN_20261114.md`及`docs/[17]IOS_BRIDGE_CONTRACT_20261114.md`。
