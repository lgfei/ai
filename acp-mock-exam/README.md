# 阿里云大模型 ACP 在线模拟测试

基于 [阿里云大模型 ACP 认证教程](https://github.com/AlibabaCloudDocs/aliyun_acp_learning) 考试大纲制作的在线模拟测试网站。

## 考试大纲与知识点分布

| 考核知识点             | 试题比例 |
|------------------------|----------|
| 大模型应用开发         | 17%      |
| 大模型提示词工程       | 15%      |
| 大模型检索增强         | 20%      |
| 大模型微调             | 16%      |
| 多 Agent 及多模态应用  | 16%      |
| 生产环境应用实践       | 16%      |

## 功能说明

- **首页**：考试说明、知识点分布表（总题数 75、时长 120 分钟、单选 50×1 分 + 多选 25×2 分 = 100 分）
- **考试页**：120 分钟倒计时、单选题/多选题标识、题号导航、上一题/下一题、交卷
- **结果页**：得分 / 100、正确题数、用时、错题与解析（含多选正确答案展示）

## 本地运行

### 方式一：直接打开（推荐）

双击 `index.html` 或用浏览器打开即可。部分浏览器对本地文件有跨域限制，若题目不加载可改用下面方式。

### 方式二：本地静态服务

```bash
# 使用 Python 3
cd acp-mock-exam
python -m http.server 8080

# 或使用 Node.js (需先安装: npm i -g serve)
serve -p 8080
```

浏览器访问：`http://localhost:8080`

## 文件结构

```
acp-mock-exam/
├── index.html      # 首页与考试入口
├── exam.html       # 考试页
├── result.html     # 成绩与错题回顾
├── css/
│   └── style.css   # 样式
├── js/
│   ├── questions.js # 题库与抽题逻辑
│   └── exam.js      # 考试逻辑（计时、答题、交卷）
└── README.md
```

## 题库说明

- **总题数 75 题**：单选题 50 题（每题 1 分）+ 多选题 25 题（每题 2 分），总分 100 分，考试时长 120 分钟，及格 80 分。
- 题库共 **93 题**（68 单选 + 25 多选），每次考试按大纲比例随机抽取 75 题。题目与解析依据 [aliyun_acp_learning](https://github.com/AlibabaCloudDocs/aliyun_acp_learning) 课程原文，包括：

- **大模型应用开发**：百炼/千问 API、messages 与多轮对话、流式输出、temperature/top_p、上下文窗口等
- **提示词工程**：六要素（任务目标、上下文、角色、受众、样例、输出格式）、分隔符、LlamaIndex 默认模板等
- **检索增强**：建立索引四步（文档解析、文本分段、向量化、存储）、检索与生成、Ragas 指标（Answer Correctness、Faithfulness、Context Precision/Recall）、领域专家与 Ground Truth
- **微调**：损失函数与代价函数、指令微调、LoRA/PEFT
- **多 Agent**：Agent 四模块（思考与规划、感知、执行、记忆）、工具调用与意图识别
- **生产与安全**：直接调用与限流、vLLM 部署、SLO/TTFT/TPOT、提示词注入与指令注入、AI 安全护栏

每次考试按大纲比例从题库中随机抽题，保证与正式考试知识点分布一致。

## 参考

- [aliyun_acp_learning](https://github.com/AlibabaCloudDocs/aliyun_acp_learning) - 阿里云大模型 ACP 认证教程
