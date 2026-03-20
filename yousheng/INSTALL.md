# 安装和运行指南

## 环境要求

- **Android Studio**: 最新版本（推荐 Arctic Fox 或更高）
- **JDK**: 11 或更高版本
- **Android SDK**: API 34
- **目标设备**: Android 5.0 (API 21) 或更高版本

## 完整安装步骤

### 1. 安装 Android Studio

访问 [Android Studio 官网](https://developer.android.com/studio) 下载并安装。

### 2. 配置 Android SDK

打开 Android Studio 后：
- Tools → SDK Manager
- 确保安装了以下组件：
  - Android SDK Platform 34
  - Android SDK Build-Tools 34.0.0
  - Android Emulator（如果需要模拟器）

### 3. 打开项目

- File → Open
- 选择项目目录：`/mnt/e/Test/llm/yousheng`
- 点击 "OK"

### 4. 同步 Gradle

首次打开会自动同步，如未同步：
- File → Sync Project with Gradle Files
- 等待下载依赖（需要网络连接）

### 5. 连接设备或启动模拟器

**使用真机**：
- 打开手机开发者选项
- 启用 USB 调试
- 通过 USB 连接电脑
- 在 Android Studio 中选择设备

**使用模拟器**：
- Tools → Device Manager
- 点击 "Create Device"
- 选择设备型号和系统镜像
- 启动模拟器

### 6. 运行应用

点击工具栏的绿色运行按钮（▶），或使用快捷键：
- Windows/Linux: Shift + F10
- Mac: Control + R

### 7. 验证安装

应用应该在设备上启动，显示：
- 应用标题 "优声"
- 文本输入框
- 四个操作按钮（朗读、停止、暂停/继续、清空）

## 命令行方式

### 构建

```bash
# 在项目根目录执行
./gradlew assembleDebug
```

生成的 APK 位置：
```
app/build/outputs/apk/debug/app-debug.apk
```

### 安装

```bash
# 自动安装到连接的设备
./gradlew installDebug

# 或使用 adb
adb install app/build/outputs/apk/debug/app-debug.apk
```

### 启动应用

```bash
adb shell am start -n com.yousheng.tts/.MainActivity
```

## 故障排除

### Gradle 同步失败

**问题**: Could not resolve all dependencies

**解决方案**:
- 检查网络连接
- 确保可以访问 `google()` 和 `mavenCentral()` 仓库
- 尝试使用代理或镜像

### 无法找到设备

**问题**: No connected devices found

**解决方案**:
- 确保已启用 USB 调试
- 检查 USB 连接
- 安装设备驱动程序
- 运行 `adb devices` 验证设备是否被识别

### 中文语音无法使用

**问题**: 语音朗读为英文或无声

**解决方案**:
1. 在设备上安装中文语音包：
   - 设置 → 语言和输入法 → 文字转语音
   - 下载并安装中文（普通话）语音包
   - 设置默认语音引擎为支持中文的引擎

2. 或在应用中手动选择语音引擎

### 应用闪退

**问题**: 应用启动后立即崩溃

**解决方案**:
- 查看 Logcat 日志定位错误
- 确保设备满足最低要求（Android 5.0+）
- 清理项目并重新构建：
  ```bash
  ./gradlew clean
  ./gradlew assembleDebug
  ```

## 首次使用提示

1. **检查语音引擎**: 首次运行时，应用会初始化 TTS 引擎，状态栏会显示 "正在初始化语音引擎..."
2. **等待初始化**: 语音引擎就绪后，"开始朗读"按钮会变为可用状态
3. **测试功能**: 输入一些文字，点击"开始朗读"测试功能

## 后续开发

### 修改应用配置

编辑 `app/build.gradle`:
```gradle
defaultConfig {
    applicationId "com.yousheng.tts"  // 修改包名
    versionCode 1                       // 版本号
    versionName "1.0.0"                 // 版本名称
}
```

### 修改界面

- 布局文件: `app/src/main/res/layout/activity_main.xml`
- 样式文件: `app/src/main/res/values/styles.xml`
- 颜色文件: `app/src/main/res/values/colors.xml`

### 修改业务逻辑

主代码文件: `app/src/main/java/com/yousheng/tts/MainActivity.kt`

## 构建发布版本

```bash
# 构建 Release 版本
./gradlew assembleRelease

# 生成的 APK 位置
app/build/outputs/apk/release/app-release-unsigned.apk
```

**注意**: 发布版本需要签名才能安装到设备。生成签名密钥：

```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

更多发布信息请参考 [Android 官方文档](https://developer.android.com/studio/publish)。

