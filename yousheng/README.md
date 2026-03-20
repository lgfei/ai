# README.md

# 优声 (YouSheng) - 老年人友好的文字转语音应用

一款专为老年人设计的安卓文字转语音应用，操作简单，界面清晰。

## 功能特点

- 🎤 **文字转语音**：将输入的文字转换为清晰的语音朗读
- 👓 **大字体设计**：所有文字和按钮都采用大尺寸，方便阅读
- 🎯 **简单操作**：一键朗读，一键停止，操作直观
- 🌟 **高对比度界面**：文字与背景对比明显，减少视觉疲劳
- 📱 **竖屏锁定**：专为单手操作优化

## 系统要求

- Android 5.0 (API 21) 或更高版本
- 需要安装 TTS 语音引擎（系统自带或从应用商店安装）

## 安装方法

### 方法一：使用 Android Studio

1. 打开 Android Studio
2. 选择 "Open an Existing Project"
3. 选择本项目目录
4. 等待 Gradle 同步完成
5. 连接安卓设备或启动模拟器
6. 点击 "Run" 按钮

### 方法二：手动安装 APK

```bash
# 构建 APK
./gradlew assembleDebug

# 安装到设备
adb install app/build/outputs/apk/debug/app-debug.apk
```

## 使用说明

1. **输入文字**：在文本框中输入或粘贴要朗读的文字
2. **开始朗读**：点击绿色的"开始朗读"按钮
3. **暂停/继续**：点击橙色按钮暂停或继续朗读
4. **停止朗读**：点击红色的"停止"按钮
5. **清空文字**：点击"清空"按钮清除文本框内容

## 项目结构

```
yousheng/
├── app/
│   ├── src/main/
│   │   ├── java/com/yousheng/tts/
│   │   │   └── MainActivity.kt       # 主界面和 TTS 逻辑
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   │   └── activity_main.xml # 主界面布局
│   │   │   └── values/               # 字符串、颜色、样式资源
│   │   └── AndroidManifest.xml       # 应用清单
│   └── build.gradle                  # 应用构建配置
├── build.gradle                      # 项目构建配置
└── settings.gradle                   # Gradle 设置
```

## 技术栈

- **语言**: Kotlin
- **框架**: Android SDK
- **核心技术**: Android TextToSpeech API
- **UI 框架**: Material Design 3

## 后续优化方向

- 添加语音语速、音调调节滑块
- 支持从文件导入文字
- 添加夜间模式
- 支持保存朗读历史
- 添加语音识别（语音转文字）功能

## 许可证

本项目仅供学习交流使用。

---

**开发提示**：首次运行需要确保设备已安装中文语音包。
