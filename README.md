# Universe 科学课堂 · 离线 App

当前离线版本：**2.2.15**。教师版和学生版可独立运行，课程场景、动画、视频和教师版幻灯片包含在安装包中，无需首次联网加载。外部参考网站及检查、下载更新需要联网。

[下载网站](https://universe-science-classroom.vercel.app/#versions) · [版本说明和校验文件](https://github.com/bcmyongjie-png/universe-app-downloads/releases/tag/offline-v2.2.15)

## Windows

[教师版 EXE](https://github.com/bcmyongjie-png/universe-app-downloads/releases/download/offline-v2.2.15/Universe-Teacher-Offline-2.2.15-Setup.exe) · [学生版 EXE](https://github.com/bcmyongjie-png/universe-app-downloads/releases/download/offline-v2.2.15/Universe-Student-Offline-2.2.15-Setup.exe)

适用于 x64 Windows。**安装包和 App 尚无受信任的发布者签名；Smart App Control 或学校电脑的安全策略仍可能阻止安装、启动。此版本没有解决签名拦截，也不会修改系统安全策略。**

## Mac

[教师版 DMG](https://github.com/bcmyongjie-png/universe-app-downloads/releases/download/offline-v2.2.15/Universe-Teacher-Offline-2.2.15-Mac.dmg) · [学生版 DMG](https://github.com/bcmyongjie-png/universe-app-downloads/releases/download/offline-v2.2.15/Universe-Student-Offline-2.2.15-Mac.dmg)

要求 macOS 13 Ventura 或更新，参见 [Electron 官方系统要求](https://www.electronjs.org/blog/electron-44-0)。通用 DMG 包含 Apple Silicon 与 Intel x86_64 程序。Apple Silicon 是已完成实际 DMG 自动回测的环境；Intel 云端机器没有可用的 WebGL 图形加速，Rosetta 自动测试也未能完成，**实体 Intel Mac 运行仍待验证**。

打开 DMG，将 App 拖到 Applications（应用程序）。Mac 包使用 ad-hoc 签名，**尚无 Apple Developer ID 签名或公证**。首次打开提示和机构管理限制见 [Apple 官方说明](https://support.apple.com/102445)。

## 更新与投影

联网后自动检查更新；下载和安装分别由用户选择。旧版可在「教学设置 → 检查更新」查找 2.2.15。选择稍后更新或关闭 App 不会强制安装。Mac 更新打开正常的 DMG 安装流程。

Windows 临时启用扩展投影后，结束投影或退出 App 会尝试恢复原显示模式，保留用户期间手动调整的布局。MacBook 接一台投影仪时会尝试自动扩展，并将教学控制窗口留在内置屏幕；使用不创建新桌面空间的全屏。**实体 MacBook 与投影仪组合尚待验证，不能保证所有组合都自动切换。**

## 本版检查记录

- [Windows 与 Mac 构建、全部 46 个主题及视频离线检查](https://github.com/bcmyongjie-png/universe-app-downloads/actions/runs/37887091761)：两个 build 作业通过，包括课次筛选、完整入口、星系名称、三条恒星演化路线和小窗口标签布局。
- [实际 DMG 回测与发布](https://github.com/bcmyongjie-png/universe-app-downloads/actions/runs/37887091761)：检查 DMG、签名、版本、两种架构，Apple Silicon 原生启动、离线 WebGL、全屏进入/退出及教学窗口可见性，并再次检查全部课程、视频和导航。
- [Mac 诊断记录](https://github.com/bcmyongjie-png/universe-app-downloads/actions/runs/37881237943)：CDP 模拟 F11 不会触发 Electron 原生按键事件，实际原生按键能够进入简单全屏；Intel 测试机的图形加速不可用。上述失败记录保留，不表示 Intel 已验证。

安装包来自源码提交 `92683780182e142ded4754402c7248c0dc9b1ffb`。源码压缩包 SHA-256 为 `23b5da1f0bf6b06cef1796540885f96f006b03b6be049dd813baa96cea1ccc84`。本次重新构建包含更新检查状态覆盖修复及 Mac 课堂全屏按钮退出修复；全屏按钮、F11、Esc 和退出 App 使用统一的原生全屏控制。

仓库根目录的 main.cjs 等文件保留早期在线包装版本；本版离线程序来自 offline-source-2.2.15.zip。公开安装包的校验值见 Release 内 SHA256SUMS-offline.txt。
