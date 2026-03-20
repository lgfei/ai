# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

这是一个为老年人设计的安卓文字转语音应用（优声/YouSheng）。

### 核心功能
- 文字转语音（TTS）功能
- 大字体、大按钮界面设计，适配老年人使用
- 简单直观的操作流程（仅4个按钮）
- 支持中文语音合成
- 暂停/继续功能
- 清空文本功能

### 技术栈
- **语言**: Kotlin
- **最低支持**: Android API 21 (Android 5.0+)
- **构建工具**: Gradle 8.0
- **Kotlin版本**: 1.9.0
- **Android Gradle Plugin**: 8.1.0
- **核心库**: AndroidX, Material Design 3
- **核心技术**: Android TextToSpeech API

### 关键文件结构
```
/mnt/e/Test/llm/yousheng/
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml              # 应用清单
│   │   ├── java/com/yousheng/tts/           # Kotlin 源码
│   │   │   └── MainActivity.kt               # 主活动逻辑 (TTS实现)
│   │   └── res/                             # 资源文件
│   │       ├── layout/                      # 布局文件
│   │       │   └── activity_main.xml        # 主界面布局 (大字体/大按钮)
│   │       ├── values/                      # 值资源
│   │       │   ├── strings.xml              # 字符串资源 (中文化)
│   │       │   ├── colors.xml               # 颜色资源 (高对比度)
│   │       │   └── styles.xml               # 样式资源 (大字体样式定义)
│   │       ├── drawable/                    # 图形资源
│   │       │   └── btn_primary.xml          # 按钮样式
│   │       ├── xml/                         # XML配置文件
│   │       │   ├── backup_rules.xml         # 备份规则
│   │       │   └── data_extraction_rules.xml # 数据提取规则
│   │       └── mipmap-hdpi/                 # 应用图标 (当前为空)
│   └── build.gradle                          # 应用模块构建配置
├── build.gradle                              # 项目根构建配置
├── settings.gradle                           # Gradle 设置
└── gradle/wrapper/
    └── gradle-wrapper.properties             # Gradle 包装器配置
```

### 构建和运行

**准备工作**:
- 确保已安装 Android Studio
- 在 Android Studio 中打开此目录
- 等待 Gradle 同步完成

**构建应用**:
```bash
# 构建调试版本
./gradlew assembleDebug

# 构建发布版本
./gradlew assembleRelease
```

**安装到设备**:
```bash
# 安装调试版本
./gradlew installDebug

# 或使用 adb
adb install app/build/outputs/apk/debug/app-debug.apk
```

**运行应用**:
```bash
adb shell am start -n com.yousheng.tts/.MainActivity
```

**清理构建**:
```bash
./gradlew clean
```

### 测试要点

1. **语音引擎测试**:
   - 确保设备已安装中文语音包
   - 测试首次启动时的语音初始化
   - 测试语言设置回退机制

2. **功能测试**:
   - 测试开始朗读功能
   - 测试暂停/继续功能
   - 测试停止功能
   - 测试清空文本功能
   - 测试不同长度文本朗读

3. **界面测试**:
   - 测试竖屏锁定
   - 测试按钮响应
   - 测试不同屏幕尺寸下的显示
   - 测试文字对比度和可读性

4. **生命周期测试**:
   - 测试切换应用后的行为
   - 测试后台运行后返回
   - 测试 TTS 资源释放

### 特殊考虑

**老年人友好设计**:
- 字体大小：标题 28sp，正文 20sp，按钮 24sp+
- 对比度：深色文字 (#212121) 配浅色背景 (#FFFFFF)
- 按钮尺寸：最小 64dp 高，200dp 宽，触摸目标至少 48dp
- 按钮颜色区分：
  - 绿色按钮 (#4CAF50) - 开始朗读
  - 红色按钮 (#F44336) - 停止
  - 橙色按钮 (#FF9800) - 暂停/继续
- 竖屏锁定，避免误操作
- 状态实时反馈（正在朗读/已暂停/已停止）

**TTS 配置要点**:
- 语音语言：zh-CN（简体中文，Locale.CHINA）
- 语速：0.8（稍慢，适合老年人）
- 音调：1.0（适中）
- 语音完成监听：使用 UtteranceProgressListener
- 语音 ID：使用类名作为 utteranceId

### 关键代码路径

- **TTS 初始化**: MainActivity.kt:50-109
- **朗读逻辑**: MainActivity.kt:133-147
- **暂停/继续**: MainActivity.kt:149-166
- **停止逻辑**: MainActivity.kt:168-177
- **界面布局**: activity_main.xml
- **样式定义**: styles.xml

### 注意事项

1. **图标缺失**: 当前项目缺少应用图标文件（mipmap-hdpi 目录为空），首次运行时可能显示默认图标。
2. **中文语音包**: 需要设备支持中文 TTS，如果没有会自动回退到系统默认语言。
3. **权限**: 无需特殊权限，使用系统 TTS API。
4. **兼容性**: 适配 API 21+，建议在 Android 6.0+ 测试。

### 未来扩展建议

- 添加语音语速、音调调节滑块
- 支持从文件导入文本
- 添加夜间模式
- 记录朗读历史
- 添加语音识别功能（语音输入）
