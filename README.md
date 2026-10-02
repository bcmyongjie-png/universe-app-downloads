# Universe 科学课堂 · 离线 App

当前离线版本：**2.2.13**。教师版和学生版均可独立运行，不需要另外打开浏览器。课程场景、动画、视频，以及教师版的幻灯片已包含在安装包中；首次使用课程也不需要联网。外部参考网站及检查、下载更新需要联网。

## Mac 下载与系统要求

- **macOS 13 Ventura 或更新版本**。当前安装包使用 Electron 44，不支持 macOS 12 及更早系统，参见 [Electron 官方系统要求](https://www.electronjs.org/blog/electron-44-0)。
- 一个通用 DMG 同时包含 **Apple Silicon（M 系列）和 Intel x86_64** 程序，不需要选择芯片版本。3D 课程需要可用的 WebGL 图形加速；当前 Intel 真机完整运行仍待验证。
- [下载教师版 Mac DMG](https://github.com/bcmyongjie-png/universe-app-downloads/releases/download/offline-v2.2.13/Universe-Teacher-Offline-2.2.13-Mac.dmg)
- [下载学生版 Mac DMG](https://github.com/bcmyongjie-png/universe-app-downloads/releases/download/offline-v2.2.13/Universe-Student-Offline-2.2.13-Mac.dmg)

打开 DMG，将 Universe App 拖到 **Applications（应用程序）**，然后从应用程序文件夹打开。

目前 Mac 包已进行 ad-hoc 签名，但**尚未使用 Apple Developer ID 签名或完成 Apple 公证**。首次打开可能被 macOS 拦截。在确认下载来源为本仓库后，可按 [Apple 官方说明](https://support.apple.com/102445)在“系统设置 → 隐私与安全性”中针对该 App 选择“仍要打开”。无需关闭整台电脑的 Gatekeeper 保护。受学校或机构管理的 Mac 可能需要管理员允许安装。

## Windows

[下载教师版](https://github.com/bcmyongjie-png/universe-app-downloads/releases/download/offline-v2.2.13/Universe-Teacher-Offline-2.2.13-Setup.exe) · [下载学生版](https://github.com/bcmyongjie-png/universe-app-downloads/releases/download/offline-v2.2.13/Universe-Student-Offline-2.2.13-Setup.exe)

## 更新与投影

联网后 App 会自动检查更新；下载和安装分别保留用户选择。选择稍后更新或关闭 App 都不会强制安装。Mac 更新使用正常的 DMG 安装流程。

老师和学生显示不同画面时，投影仪须设置为扩展桌面。实体投影仪仍需在实际教室设备上验证。

## 验证记录

- [2.2.13 构建与离线测试](https://github.com/bcmyongjie-png/universe-app-downloads/actions/runs/36655543851)：Windows 与 macOS 教师/学生版在阻断外部网络下启动，检查全部 46 个主题、交互和视频播放。
- [已发布 DMG 的双芯片回测](https://github.com/bcmyongjie-png/universe-app-downloads/actions/workflows/mac-verify.yml)：直接下载发布文件，核对 SHA-256、DMG、签名和两种架构，分别在 macOS 15 Apple Silicon 与 Intel 主机运行教师/学生版。Intel 云端测试机没有可用 GPU，因此仅在该测试进程中使用 SwiftShader 软件渲染；Apple Silicon 使用默认图形配置，发布的 App 保持默认图形配置。2026-10-02 的结果：Apple Silicon / macOS 15.7.9 教师版和学生版全部通过；Intel 版进程能启动，但测试机在默认和软件图形配置下均无法创建 WebGL，3D 回测失败，尚不能据此确认 Intel 真机完整运行。详见 [本轮结果](https://github.com/bcmyongjie-png/universe-app-downloads/actions/runs/36966423731)。
- 测试通过不等于所有历史 macOS、所有硬件或 Gatekeeper 首次安装流程均已验证。

仓库根目录的 main.cjs 等文件保留早期在线包装版本；当前离线安装包由 offline-release.yml 和经过场景验证的离线源码产物生成。完整版本及校验清单请见 [Releases](https://github.com/bcmyongjie-png/universe-app-downloads/releases)。
