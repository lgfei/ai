/**
 * 阿里云大模型ACP认证 - 模拟试题库
 * 根据考试大纲知识点分布命题
 * 大模型应用开发17% | 提示词工程15% | 检索增强20% | 微调16% | 多Agent 16% | 生产实践16%
 */
const QUESTION_BANK = [
  // ========== 大模型应用开发 17% ==========
  {
    id: 1,
    category: "大模型应用开发",
    question: "使用通义千问 plus 生成代码时，为保证输出稳定，temperature应如何设置？",
    options: ["A. 调高", "B. 调低", "C. 保持默认", "D. 设为 2"],
    answer: "B",
    explanation: "生成代码等需要稳定输出的场景应调低 temperature，以减少随机性。"
  },
  {
    id: 2,
    category: "大模型应用开发",
    question: "若希望大模型在生成时从「累积概率达到某阈值的 token 集合」中采样，应调节哪个参数？",
    options: ["A. temperature", "B. top_p", "C. top_k", "D. seed"],
    answer: "B",
    explanation: "top_p 为核采样（nucleus sampling），从累积概率达到 p 的最小 token 集合中采样。"
  },
  {
    id: 3,
    category: "大模型应用开发",
    question: "希望用户尽早看到部分回复、减少等待感，调用 API 时应如何设置？",
    options: ["A. 关闭流式，等全部生成再返回", "B. 开启流式输出", "C. 增大 max_tokens", "D. 传单轮消息"],
    answer: "B",
    explanation: "流式输出（stream=True）边生成边返回，可改善首 token 延迟体验。"
  },
  {
    id: 4,
    category: "大模型应用开发",
    question: "用户先问「公司用什么项目管理工具」，再问「怎么申请账号」。要让模型正确理解「账号」指该工具，应怎样传参？",
    options: ["A. 传第二句问题", "B. 传第二句 + 上一轮回复", "C. 传完整多轮 user/assistant 历史", "D. 传 system 消息"],
    answer: "C",
    explanation: "多轮对话需将完整对话历史传入 messages，模型才能理解指代关系。"
  },
  {
    id: 5,
    category: "大模型应用开发",
    question: "希望模型在整个对话中扮演「公司客服」并遵守固定话术，应把该设定放在哪种消息里？",
    options: ["A. 放在最后一条 user 中", "B. 放在 role 为 system 的消息中", "C. 放在每条 assistant 中", "D. 不传，靠 temperature 控制"],
    answer: "B",
    explanation: "system 消息用于设定模型身份与规则，对后续对话全局生效。"
  },
  {
    id: 6,
    category: "大模型应用开发",
    question: "API 中用于限制「本次请求最多生成多少 token」的参数是？",
    options: ["A. 输入最大 token 数", "B. 上下文总长度", "C. max_tokens", "D. 每分钟 TPM 上限"],
    answer: "C",
    explanation: "max_tokens 限制单次生成的最大 token 数，起成本与长度兜底作用。"
  },
  {
    id: 7,
    category: "大模型应用开发",
    question: "下列哪种行为不能通过「仅调用大模型 API」完成？",
    options: ["A. 对一段话做情感分类", "B. 根据文档生成摘要", "C. 直接执行 SQL 更新数据库", "D. 批量改写文案风格"],
    answer: "C",
    explanation: "API 只返回文本，不能直接操作数据库，需由业务代码执行 SQL。"
  },
  {
    id: 8,
    category: "大模型应用开发",
    question: "OpenAI 兼容的 chat 接口中，每条消息通常包含哪两个字段？",
    options: ["A. id 与 timestamp", "B. role 与 content", "C. model 与 stream", "D. token 与 length"],
    answer: "B",
    explanation: "每条消息需包含 role（如 system/user/assistant）和 content。"
  },
  {
    id: 9,
    category: "大模型应用开发",
    question: "同一问题多次调用希望得到尽量一致的答案，除固定 seed 外，参数上应如何设置？",
    options: ["A. 调高 temperature", "B. 将 temperature 设为 0 或接近 0", "C. 调高 top_p", "D. 不传 system 消息"],
    answer: "B",
    explanation: "temperature 接近 0 时采样趋近贪婪，输出更稳定、可复现。"
  },
  {
    id: 10,
    category: "大模型应用开发",
    question: "百炼 API Key 推荐如何配置以便兼顾安全与更换方便？",
    options: ["A. 直接写在代码里", "B. 写在注释中", "C. 存环境变量或配置文件，代码中读取", "D. 不配置，用默认值"],
    answer: "C",
    explanation: "存环境变量或配置文件可避免泄露、便于轮换；代码中不写明文。"
  },

  // ========== 大模型提示词工程 15% ==========
  {
    id: 11,
    category: "大模型提示词工程",
    question: "下列哪一项不属于常见提示词设计要素？",
    options: ["A. 角色与受众", "B. 任务目标与上下文", "C. 模型权重文件路径", "D. 样例与输出格式"],
    answer: "C",
    explanation: "提示词框架要素包括任务目标、上下文、角色、受众、样例、输出格式，不涉及模型权重。"
  },
  {
    id: 12,
    category: "大模型提示词工程",
    question: "在长提示中插入 ###、--- 或【】等符号，主要为了达到什么效果？",
    options: ["A. 降低 token 数量", "B. 区分指令、参考与问题等不同部分", "C. 提高推理速度", "D. 替代 system 角色"],
    answer: "B",
    explanation: "分隔符用于区分不同部分，帮助模型抓住目标、减少混淆。"
  },
  {
    id: 13,
    category: "大模型提示词工程",
    question: "希望模型在整场对话中遵守「只回答与公司制度相关」的约束，该约束应放在何处？",
    options: ["A. 放在最后一轮 user 里", "B. 放在对话开头的 system 消息中", "C. 放在每条 assistant 回复末尾", "D. 通过 temperature 控制"],
    answer: "B",
    explanation: "system 消息在对话开头设定，对后续多轮全局生效。"
  },
  {
    id: 14,
    category: "大模型提示词工程",
    question: "提示词中写「{context_str}」「{query_str}」等占位符，便于程序替换为检索结果和用户问题，这种形式通常称为？",
    options: ["A. 模型配置文件", "B. 提示词模板", "C. 多模态输入", "D. 预训练权重"],
    answer: "B",
    explanation: "固定结构加占位符即为提示词模板，便于注入动态内容。"
  },
  {
    id: 15,
    category: "大模型提示词工程",
    question: "在提示词中给出 1～3 个「输入-输出」示例，让模型模仿格式作答，这种做法通常称为？",
    options: ["A. 零样本", "B. 少样本（Few-shot）", "C. system 设定", "D. 流式输出"],
    answer: "B",
    explanation: "Few-shot 通过少量示例引导模型按格式与风格输出。"
  },
  {
    id: 16,
    category: "大模型提示词工程",
    question: "要让答疑机器人既答得准又便于下游解析，提示词设计上更合理的做法是？",
    options: ["A. 写一句「请回答」", "B. 写明角色、约束和输出格式，必要时加示例", "C. 尽量写长段无结构说明", "D. 不使用 system，靠 user 控制"],
    answer: "B",
    explanation: "明确角色、约束和格式能提升准确性与可解析性。"
  },
  {
    id: 17,
    category: "大模型提示词工程",
    question: "在提示中要求模型「先一步步推理，再给出最终答案」，常用于哪类任务？",
    options: ["A. 压缩 token", "B. 数学、逻辑等需要推理步骤的任务", "C. 替代 RAG 检索", "D. 代码补全"],
    answer: "B",
    explanation: "Chain-of-Thought 类提示引导先推理再结论，常用于推理类任务。"
  },
  {
    id: 18,
    category: "大模型提示词工程",
    question: "RAG 中把「检索到的文档片段」和「用户问题」一起交给模型时，更推荐怎样组织？",
    options: ["A. 混在一段话里不区分", "B. 用分隔符标出「参考内容」与「用户问题」", "C. 把片段放在 system 里", "D. 不限制片段长度"],
    answer: "B",
    explanation: "用分隔符区分可减少模型混淆，提高依据文档作答的准确性。"
  },
  {
    id: 19,
    category: "大模型提示词工程",
    question: "在提示词里写「你是一名小学老师」或「你是法务顾问」，主要影响模型的什么？",
    options: ["A. 模型参数量", "B. 回答时的身份、口吻与专业范围", "C. 多轮对话轮数", "D. temperature 的默认值"],
    answer: "B",
    explanation: "角色设定约束模型的身份、语气与专业领域。"
  },
  {
    id: 20,
    category: "大模型提示词工程",
    question: "在提示中明确「请只输出 JSON，包含 name 和 score 字段」，主要为了？",
    options: ["A. 降低响应延迟", "B. 得到结构化输出便于程序解析", "C. 替代 max_tokens 限制", "D. 用于流式场景"],
    answer: "B",
    explanation: "输出格式说明使模型输出更稳定、便于后续解析与集成。"
  },

  // ========== 大模型检索增强 20% ==========
  {
    id: 21,
    category: "大模型检索增强",
    question: "RAG 在「建立索引」阶段一般不包含下列哪一步？",
    options: ["A. 文档解析", "B. 文本分段", "C. 模型预训练", "D. 文本向量化并存储"],
    answer: "C",
    explanation: "建立索引包括文档解析、文本分段、向量化、存储；预训练不属于 RAG 流程。"
  },
  {
    id: 22,
    category: "大模型检索增强",
    question: "RAG 在解析文档后会对文本做分段（chunk），这样做主要是为了？",
    options: ["A. 减小存储占用", "B. 便于后续按问题召回相关片段", "C. 方便前端展示", "D. 代替向量化步骤"],
    answer: "B",
    explanation: "分段后才能按片段做向量化与检索，便于找到与问题最相关的部分。"
  },
  {
    id: 23,
    category: "大模型检索增强",
    question: "RAG 的「检索」阶段通常做什么？",
    options: ["A. 删除不相关段落", "B. 将问题向量化并与向量库比较，召回相关片段", "C. 做关键词匹配", "D. 重新训练模型"],
    answer: "B",
    explanation: "检索阶段用 embedding 对问题向量化，与库中向量比较相似度并召回最相关片段。"
  },
  {
    id: 24,
    category: "大模型检索增强",
    question: "在召回多段文本后，再用一个模型对它们与问题的相关度打分并重排，这一步骤常称为？",
    options: ["A. 按字数排序", "B. 重排序（rerank）", "C. 替代向量检索", "D. 做展示用"],
    answer: "B",
    explanation: "Rerank 对召回结果再次排序，提升与问题的相关度顺序。"
  },
  {
    id: 25,
    category: "大模型检索增强",
    question: "「句子窗口」检索是指？",
    options: ["A. 减少 token 数", "B. 以句子为单位检索，返回时带上前后文", "C. 不用向量库", "D. 用于表格内容"],
    answer: "B",
    explanation: "句子窗口检索在句子级检索，返回时扩展为上下文窗口，平衡精度与上下文。"
  },
  {
    id: 26,
    category: "大模型检索增强",
    question: "Ragas 中用于衡量「答案与检索到的上下文在事实上是否一致」的指标是？",
    options: ["A. Context Recall", "B. Faithfulness", "C. Answer Relevancy", "D. Context Precision"],
    answer: "B",
    explanation: "Faithfulness 评估生成答案是否忠实于检索到的上下文，是否幻觉。"
  },
  {
    id: 27,
    category: "大模型检索增强",
    question: "Ragas 中用于衡量「召回的上下文中与正确答案相关的条目是否排得靠前、占比高」的指标是？",
    options: ["A. Answer Correctness", "B. Faithfulness", "C. Context Recall", "D. Context Precision"],
    answer: "D",
    explanation: "Context Precision 关注召回列表中相关条目的排名与占比（信噪比）。"
  },
  {
    id: 28,
    category: "大模型检索增强",
    question: "使用 LlamaIndex 构建 RAG 时，SimpleDirectoryReader 的主要作用是？",
    options: ["A. 训练 embedding 模型", "B. 加载并解析指定目录下的文件为 document", "C. 执行向量检索", "D. 调用大模型生成"],
    answer: "B",
    explanation: "SimpleDirectoryReader 将指定文件夹中的文件加载并解析为 document 对象，对应文档解析步骤。"
  },
  {
    id: 29,
    category: "大模型检索增强",
    question: "RAG 自动化评测时，Answer Correctness 的计算通常会结合哪两类信息？",
    options: ["A. 字符串匹配", "B. 语义相似度与事实准确度", "C. 检索召回率", "D. 首 token 延迟"],
    answer: "B",
    explanation: "Answer Correctness 结合 answer 与 ground_truth 的语义相似度及事实准确度（如观点列表比较）。"
  },
  {
    id: 30,
    category: "大模型检索增强",
    question: "LlamaIndex 默认的 RAG 提示模板中，用于填入「检索到的上下文」和「用户问题」的变量名分别是？",
    options: ["A. question 与 answer", "B. context_str 与 query_str", "C. doc 与 user", "D. input 与 output"],
    answer: "B",
    explanation: "默认模板使用 context_str（检索上下文）和 query_str（用户问题）作为占位符。"
  },
  {
    id: 31,
    category: "大模型检索增强",
    question: "RAG 中「生成」阶段与「检索」阶段的关系是？",
    options: ["A. 生成不依赖检索结果", "B. 检索得到相关片段后，再据此生成回答", "C. 检索，不生成", "D. 生成，不检索"],
    answer: "B",
    explanation: "RAG 先检索再生成：将检索到的片段与问题一起交给模型生成回答。"
  },
  {
    id: 32,
    category: "大模型检索增强",
    question: "Ragas 的 Context Recall 主要用于评估？",
    options: ["A. 答案是否与问题相关", "B. 有多少「应被召回」的相关资料被实际召回", "C. 生成速度", "D. 模型参数量"],
    answer: "B",
    explanation: "Context Recall 评估应被检索到的相关参考资料有多少被召回，得分越高遗漏越少。"
  },

  // ========== 大模型微调 16% ==========
  {
    id: 33,
    category: "大模型微调",
    question: "在已有基座模型上，用本公司客服对话数据再做一轮训练，以提升客服场景表现，这一过程通常称为？",
    options: ["A. 预训练", "B. 微调（Fine-tuning）", "C. 推理", "D. 知识蒸馏"],
    answer: "B",
    explanation: "微调是在预训练模型基础上用特定任务/领域数据继续训练，提升该场景表现。"
  },
  {
    id: 34,
    category: "大模型微调",
    question: "要做有监督微调，通常必须先具备什么？",
    options: ["A. 不需要数据", "B. 与任务相关的高质量标注或指令数据", "C. 大量未标注文本", "D. 必须从零训练"],
    answer: "B",
    explanation: "微调需要与目标任务匹配的优质数据（如指令-回答对）。"
  },
  {
    id: 35,
    category: "大模型微调",
    question: "微调流程中，在「选好基座与算法」之后、上线之前，通常还会包含哪些环节？",
    options: ["A. 推理", "B. 数据准备、训练、评测与部署", "C. 数据准备", "D. 部署"],
    answer: "B",
    explanation: "完整流程包括数据准备、格式、训练、评测和部署等。"
  },
  {
    id: 36,
    category: "大模型微调",
    question: "LoRA、QLoRA 与「全量微调」相比，主要优势在于？",
    options: ["A. 全量微调不更新任何参数", "B. 训练少量参数，显存与成本更低", "C. 必须用更大基座", "D. 全量微调效果一定更差"],
    answer: "B",
    explanation: "PEFT 只训练少量适配器参数，显存与算力需求更低。"
  },
  {
    id: 37,
    category: "大模型微调",
    question: "构建微调数据集时，除数据量外，更应关注？",
    options: ["A. 数据越多越好即可", "B. 质量、多样性、与任务一致性及格式统一", "C. 格式统一", "D. 标注速度"],
    answer: "B",
    explanation: "质量、多样性、任务一致性与格式统一对微调效果至关重要。"
  },
  {
    id: 38,
    category: "大模型微调",
    question: "微调时学习率通常如何设置更合理？",
    options: ["A. 与预训练相同或更大", "B. 一般比预训练小，避免破坏原有能力", "C. 越大收敛越快越好", "D. 固定为 1"],
    answer: "B",
    explanation: "微调常用较小学习率，在适应新任务的同时保持预训练知识。"
  },
  {
    id: 39,
    category: "大模型微调",
    question: "训练集准确率很高，但验证集准确率明显下降，这种现象通常称为？",
    options: ["A. 欠拟合", "B. 过拟合", "C. 收敛良好", "D. 数据增强不足"],
    answer: "B",
    explanation: "过拟合表现为训练集好、验证集差，模型记住了训练数据而泛化不足。"
  },
  {
    id: 40,
    category: "大模型微调",
    question: "指令微调（Instruction Tuning）常用的训练数据形式是？",
    options: ["A. 原始长文本", "B. 指令-回答对或多轮对话", "C. 分类标签", "D. 图像-文本对"],
    answer: "B",
    explanation: "指令微调使用指令-回答对或对话数据，教模型按指令作答。"
  },
  {
    id: 41,
    category: "大模型微调",
    question: "微调中「损失函数」与「代价函数」的关系，下列哪项正确？",
    options: ["A. 两者无关", "B. 损失度量单样本误差，代价为整批/全量损失的平均或求和", "C. 代价函数用于推理", "D. 损失函数即梯度"],
    answer: "B",
    explanation: "损失函数度量单样本误差，代价函数为训练集上损失的平均（如 MSE），寻参即求代价最小。"
  },
  {
    id: 42,
    category: "大模型微调",
    question: "下列哪一类方法属于「参数高效微调」？",
    options: ["A. SGD 优化器", "B. LoRA、Adapter、QLoRA", "C. 全量微调", "D. LSTM 结构"],
    answer: "B",
    explanation: "LoRA、QLoRA、Adapter 等只训练少量参数，属于参数高效微调。"
  },

  // ========== 多Agent及多模态应用 16% ==========
  {
    id: 43,
    category: "多Agent及多模态应用",
    question: "智能体（Agent）在「思考-行动-观察」闭环中，一般不包含下列哪一类能力？",
    options: ["A. 理解意图与任务拆解", "B. 接收用户输入与 API 响应", "C. 模型预训练与从零训练", "D. 调用 API、查库与记忆"],
    answer: "C",
    explanation: "Agent 核心为思考与规划、感知、执行、记忆；预训练属于模型训练阶段而非 Agent 运行能力。"
  },
  {
    id: 44,
    category: "多Agent及多模态应用",
    question: "希望机器人能根据用户问题「自动选择」调用搜索、查库或计算器，下列哪种方式更可维护？",
    options: ["A. 用 if/elif 根据关键词写死分支", "B. 在提示中列出工具说明，由大模型选择工具及入参", "C. 每次请求都执行全部工具", "D. 不开放任何工具"],
    answer: "B",
    explanation: "由大模型根据提示中的工具列表做意图识别并选择工具，比关键词路由更灵活、可扩展。"
  },
  {
    id: 45,
    category: "多Agent及多模态应用",
    question: "「多模态」大模型应用是指？",
    options: ["A. 使用多种基座模型", "B. 支持文本、图像、语音等多种输入或输出", "C. 调用多种 API 厂商", "D. 使用多种开发框架"],
    answer: "B",
    explanation: "多模态指支持多种模态（文本、图像、语音、视频等）的输入或输出。"
  },
  {
    id: 46,
    category: "多Agent及多模态应用",
    question: "用户上传图片并问「图中有什么」，模型既能看图又能生成文字回答，这类能力属于？",
    options: ["A. 文本单模态", "B. 多模态理解与生成", "C. 数据库查询", "D. 静态模板"],
    answer: "B",
    explanation: "同时处理图像输入与文本输出属于多模态理解与生成。"
  },
  {
    id: 47,
    category: "多Agent及多模态应用",
    question: "智能体在执行「查数据库」类工具时，若用户输入被恶意拼接了 SQL 片段，可能引发什么风险？",
    options: ["A. 响应变慢", "B. 指令注入导致未授权数据被修改", "C. 多消耗 token", "D. 模型幻觉"],
    answer: "B",
    explanation: "指令注入可在工具入参中夹带恶意 SQL 等，若未做校验可能被执行，威胁数据安全。"
  },
  {
    id: 48,
    category: "多Agent及多模态应用",
    question: "Tool Use（工具调用）在智能体中的作用是？",
    options: ["A. 调用其他大模型", "B. 由模型决定是否调用检索、API 等外部能力完成任务", "C. 写日志", "D. 做缓存"],
    answer: "B",
    explanation: "工具调用让模型能按需使用检索、计算、API 等外部能力完成复杂任务。"
  },
  {
    id: 49,
    category: "多Agent及多模态应用",
    question: "实现「先搜索再总结再发邮件」这类多步任务，系统设计上通常需要？",
    options: ["A. 一次 prompt 调用", "B. 状态与多步编排、分支与结果汇总", "C. 固定单工具流水线", "D. 多模型并行推理"],
    answer: "B",
    explanation: "多步任务需要状态管理、步骤编排与结果汇总等设计。"
  },
  {
    id: 50,
    category: "多Agent及多模态应用",
    question: "百炼平台上的 Agent 除对话外，一般还支持哪些能力？",
    options: ["A. 单轮问答", "B. 规划、工具调用、记忆与多轮推理", "C. 文档解析", "D. 模型训练"],
    answer: "B",
    explanation: "百炼 Agent 支持规划、工具调用、记忆与多轮推理等。"
  },
  {
    id: 51,
    category: "多Agent及多模态应用",
    question: "多 Agent 协作时，负责「把任务拆解并分发给不同 Agent、汇总结果」的层级常称为？",
    options: ["A. 存储层", "B. 编排层", "C. 训练层", "D. 展示层"],
    answer: "B",
    explanation: "编排层负责任务分解、路由与协调多 Agent。"
  },
  {
    id: 52,
    category: "多Agent及多模态应用",
    question: "Qwen-VL 这类模型能够「看图说话」或根据图片回答问题，属于？",
    options: ["A. 纯文本模型", "B. 多模态模型", "C. 语音模型", "D. 检索模型"],
    answer: "B",
    explanation: "能同时处理图像与文本的模型属于多模态模型。"
  },

  // ========== 生产环境应用实践 16% ==========
  {
    id: 53,
    category: "生产环境应用实践",
    question: "直接使用百炼等托管 API、不自建推理服务时，下列哪项说法不正确？",
    options: ["A. 按 token 计费，无需管 GPU", "B. 存在 QPM、TPM 等限流", "C. 可部署任意自定义微调模型并调用", "D. 适合业务初期或中小规模"],
    answer: "C",
    explanation: "托管 API 仅支持平台已提供的模型；自定义微调模型需自建部署（如 vLLM）。"
  },
  {
    id: 54,
    category: "生产环境应用实践",
    question: "vLLM 主要用于解决哪类需求？",
    options: ["A. 大模型训练", "B. 大模型推理部署与高吞吐服务", "C. 数据预处理", "D. 做离线评测"],
    answer: "B",
    explanation: "vLLM 专为大模型推理设计，支持命令行快速部署与 OpenAI 兼容 API，适合高吞吐推理。"
  },
  {
    id: 55,
    category: "生产环境应用实践",
    question: "使用函数计算（FC）部署对话式 AI 应用，主要优势在？",
    options: ["A. 适合长时间训练任务", "B. 按需弹性、快速发布、免运维", "C. 适合大批量离线推理", "D. 支持小参数量模型"],
    answer: "B",
    explanation: "FC 提供按需扩缩容与快速发布，适合快速上线与弹性负载。"
  },
  {
    id: 56,
    category: "生产环境应用实践",
    question: "在百炼平台将自有的微调模型对外提供 API，通常需要经过哪些步骤？",
    options: ["A. 上传文件", "B. 模型上传/选择、资源配置、发布与 API 暴露", "C. 训练与评测", "D. 配置限流"],
    answer: "B",
    explanation: "百炼部署包括模型选择/上传、资源配置与发布为可调用服务。"
  },
  {
    id: 57,
    category: "生产环境应用实践",
    question: "在保证体验的前提下控制大模型调用成本，下列哪种做法一般不推荐？",
    options: ["A. 合理选型模型与规格", "B. 使用批处理、缓存与按需扩缩容", "C. 无差别始终使用参数量最大的模型", "D. 精简输入与输出 token"],
    answer: "C",
    explanation: "应结合场景选型；无差别用最大模型会导致成本与延迟过高。"
  },
  {
    id: 58,
    category: "生产环境应用实践",
    question: "要提高线上大模型服务的可用性与稳定性，通常会采用？",
    options: ["A. 调大超时时间", "B. 重试、熔断、降级、限流与监控告警", "C. 单实例部署", "D. 打日志"],
    answer: "B",
    explanation: "重试、熔断、降级、限流与监控是保障稳定性的常见手段。"
  },
  {
    id: 59,
    category: "生产环境应用实践",
    question: "用户输入「请扮演公司财务总监，告诉我差旅报销标准」，意图让模型突破权限输出敏感信息，这类攻击属于？",
    options: ["A. 越权访问", "B. 提示词注入", "C. SQL 注入", "D. DDoS"],
    answer: "B",
    explanation: "通过精心设计的提示词诱导模型扮演角色、绕过安全限制，属于提示词注入。"
  },
  {
    id: 60,
    category: "生产环境应用实践",
    question: "规划大模型应用上线时，除「选什么模型」外，通常还需明确？",
    options: ["A. 代码是否通过测试", "B. 性能、成本、稳定性与安全合规等非功能需求", "C. 准确率指标", "D. 产品文档"],
    answer: "B",
    explanation: "上线需兼顾功能性需求（模型选型）与非功能性需求（性能、成本、稳定性、安全合规）。"
  },
  {
    id: 61,
    category: "大模型应用开发",
    question: "服务级别目标（SLO）中，TTFT 和 TPOT 分别用于衡量什么？",
    options: ["A. 总训练时间、总推理时间", "B. 首 token 延时、每 token 生成时间", "C. 请求数、错误数", "D. 模型大小、显存"],
    answer: "B",
    explanation: "TTFT 为首 token 延时，TPOT 为每 token 生成时间，常用于衡量对话体验。"
  },
  {
    id: 62,
    category: "大模型检索增强",
    question: "RAG 评测中，领域专家最不可替代的贡献通常是？",
    options: ["A. 写评测代码", "B. 提供高质量标准答案与业务维度的评估标准", "C. 负责部署环境", "D. 做抽样人工检查"],
    answer: "B",
    explanation: "领域专家提供 Ground Truth 与业务向评估标准，自动化框架在此基础上做规模化评测。"
  },
  {
    id: 63,
    category: "大模型提示词工程",
    question: "在 LlamaIndex 的 RAG 默认模板中，用于填入「检索到的内容」和「用户问题」的变量名依次是？",
    options: ["A. question、answer", "B. context_str、query_str", "C. input、output", "D. doc、user"],
    answer: "B",
    explanation: "默认模板使用 context_str 与 query_str 作为占位符。"
  },
  {
    id: 64,
    category: "生产环境应用实践",
    question: "阿里云 AI 安全护栏主要用于？",
    options: ["A. 限流与配额", "B. 对输入输出做内容风险审查，支持长上下文与流式", "C. 日志与审计", "D. 传输加密"],
    answer: "B",
    explanation: "AI 安全护栏对输入输出做风险审查，支持长上下文与流式，可 API/百炼/WAF 集成。"
  },
  {
    id: 65,
    category: "生产环境应用实践",
    question: "智能体在执行「查库」类工具时，用户输入中被拼接了恶意 SQL 片段并被执行，这类风险称为？",
    options: ["A. 越权", "B. 指令注入", "C. 网络攻击", "D. 模型幻觉"],
    answer: "B",
    explanation: "在用户输入中注入恶意指令（如 SQL）并由智能体执行，属于指令注入。"
  },
  {
    id: 66,
    category: "大模型应用开发",
    question: "在大模型对话的API中，assistant角色的作用是什么？",
    options: ["A. 提供用户输入", "B. 监控对话的安全性", "C. 设定对话的背景信息", "D. 代表模型本身，返回模型生成的回复"],
    answer: "D",
    explanation: "assistant 是模型在对话中“说话”的身份标记，每次生成的回答都会被记录为 assistant 消息，确保模型能理解自己之前说过什么"
  },
  {
    id: 67,
    category: "大模型微调",
    question: "微调时「代价函数」通常如何用于求最优参数？",
    options: ["A. 与参数无关", "B. 通过最小化代价函数（如训练集上损失平均）求参数", "C. 用于推理阶段", "D. 等价于梯度"],
    answer: "B",
    explanation: "寻参等价于求代价函数最小值（如 MSE 最小）。"
  },
  {
    id: 68,
    category: "大模型检索增强",
    question: "Ragas 计算 Answer Correctness 时，除语义相似度外，还会用到？",
    options: ["A. 字面匹配", "B. 事实准确度（如将答案与标准答案拆成观点列表再比较）", "C. 检索召回率", "D. 延迟"],
    answer: "B",
    explanation: "Answer Correctness 结合语义相似度与事实准确度（如观点列表比较）。"
  },

  // ========== 多选题 25 题（每题 2 分）==========
  {
    id: 69,
    category: "大模型应用开发",
    question: "OpenAI 兼容的 chat 接口中，messages 里每条消息的 role 可以是？（多选）",
    options: ["A. system", "B. user", "C. assistant", "D. admin"],
    answer: ["A", "B", "C"],
    explanation: "常见角色为 system、user、assistant；无 admin。"
  },
  {
    id: 70,
    category: "大模型应用开发",
    question: "要保证多轮对话中模型「记得」前面说过的话，下列哪些做法是合理的？（多选）",
    options: ["A. 把完整对话历史依次传入 messages", "B. 轮次过多时对历史做截断或摘要", "C. 用 system 设定角色与规则", "D. 每轮传当前一句 user，不传历史"],
    answer: ["A", "B", "C"],
    explanation: "完整历史保证上下文；过长可截断/摘要；system 设定行为。仅传当前句会丢失上下文。"
  },
  {
    id: 71,
    category: "大模型提示词工程",
    question: "设计提示词时，常纳入的要素包括？（多选）",
    options: ["A. 任务目标", "B. 角色与受众", "C. 样例与输出格式", "D. 模型权重路径"],
    answer: ["A", "B", "C"],
    explanation: "常见要素包括任务目标、上下文、角色、受众、样例、输出格式；不包含模型权重。"
  },
  {
    id: 72,
    category: "大模型提示词工程",
    question: "设计 RAG 的提示模板时，下列哪些做法有助于提高「依据文档作答」的准确性？（多选）",
    options: ["A. 用分隔符区分参考内容与用户问题", "B. 明确写「请依据上下文回答」", "C. 把检索结果和问题混在一段不区分", "D. 预设角色与注意事项"],
    answer: ["A", "B", "D"],
    explanation: "分隔符与约束能减少混淆；预设角色与注意事项是常见做法。无结构混合易混淆。"
  },
  {
    id: 73,
    category: "大模型检索增强",
    question: "RAG 在「建立索引」阶段通常包含下列哪些步骤？（多选）",
    options: ["A. 文档解析", "B. 文本分段", "C. 文本向量化", "D. 存储索引"],
    answer: ["A", "B", "C", "D"],
    explanation: "建立索引四步：文档解析、文本分段、向量化、存储索引。"
  },
  {
    id: 74,
    category: "大模型检索增强",
    question: "Ragas 用于评估 RAG 的指标包括？（多选）",
    options: ["A. Answer Correctness", "B. Faithfulness、Answer Relevancy", "C. Context Precision、Context Recall", "D. 模型参数量"],
    answer: ["A", "B", "C"],
    explanation: "Ragas 指标含答案正确性、忠实度、答案相关性、上下文精确率与召回率；参数量非 Ragas 指标。"
  },
  {
    id: 75,
    category: "大模型检索增强",
    question: "为提升 RAG 检索效果，可采用的策略包括？（多选）",
    options: ["A. 使用更强的 embedding 模型", "B. 对召回结果做 rerank", "C. 使用句子窗口检索", "D. 不做文本分段，整篇检索"],
    answer: ["A", "B", "C"],
    explanation: "更强 embedding、rerank、句子窗口检索均为常见优化；分段是建立索引的必要步骤。"
  },
  {
    id: 76,
    category: "大模型微调",
    question: "微调前数据准备阶段，通常需要关注？（多选）",
    options: ["A. 与任务相关的高质量标注或指令数据", "B. 数据格式统一", "C. 大量未标注文本即可", "D. 数据多样性与任务一致性"],
    answer: ["A", "B", "D"],
    explanation: "微调需要高质量、与任务一致的数据及统一格式；仅未标注文本常用于预训练。"
  },
  {
    id: 77,
    category: "大模型微调",
    question: "下列哪些属于参数高效微调（PEFT）方法？（多选）",
    options: ["A. LoRA", "B. QLoRA", "C. Adapter", "D. 全量微调"],
    answer: ["A", "B", "C"],
    explanation: "LoRA、QLoRA、Adapter 等为 PEFT；全量微调会更新全部参数，不属于参数高效。"
  },
  {
    id: 78,
    category: "多Agent及多模态应用",
    question: "智能体（Agent）通常具备的核心能力模块包括？（多选）",
    options: ["A. 思考与规划", "B. 感知", "C. 执行", "D. 记忆"],
    answer: ["A", "B", "C", "D"],
    explanation: "Agent 四模块：思考与规划、感知、执行、记忆，构成思考-行动-观察闭环。"
  },
  {
    id: 79,
    category: "多Agent及多模态应用",
    question: "智能体使用工具时，下列哪些做法更合理？（多选）",
    options: ["A. 在提示中列出工具及说明，由模型选择工具与入参", "B. 对工具调用做权限与安全校验", "C. 每次请求都强制执行全部工具", "D. 用关键词 if/elif 写死路由"],
    answer: ["A", "B"],
    explanation: "由模型按需选工具更灵活；工具调用前做安全校验可防范指令注入。"
  },
  {
    id: 80,
    category: "生产环境应用实践",
    question: "直接使用百炼等托管 API 的特点包括？（多选）",
    options: ["A. 无需自建部署，按 token 计费", "B. 存在 QPM、TPM 等限流", "C. 适合业务初期或中小规模", "D. 可部署并调用任意自定义微调模型"],
    answer: ["A", "B", "C"],
    explanation: "托管 API 有限流且仅支持平台已提供模型；自定义微调模型需自建部署。"
  },
  {
    id: 81,
    category: "生产环境应用实践",
    question: "提升大模型应用稳定性的常见手段包括？（多选）",
    options: ["A. 重试与熔断", "B. 降级与限流", "C. 监控与告警", "D. 调大单次请求超时"],
    answer: ["A", "B", "C"],
    explanation: "重试、熔断、降级、限流与监控是常见稳定性手段；仅调超时不够全面。"
  },
  {
    id: 82,
    category: "生产环境应用实践",
    question: "大模型应用在安全与合规方面通常需要关注？（多选）",
    options: ["A. 输入输出内容安全（涉敏、违规等）", "B. 提示词注入、指令注入等攻击", "C. 数据隐私与访问控制", "D. 关注推理延迟"],
    answer: ["A", "B", "C"],
    explanation: "内容安全、注入防护、数据隐私与访问控制均为安全合规要点；延迟属于性能。"
  },
  {
    id: 83,
    category: "大模型应用开发",
    question: "开启流式输出（stream=True）后，下列哪些说法正确？（多选）",
    options: ["A. 用户能更早看到部分回复", "B. 模型推理逻辑与答案质量会改变", "C. 适合对话、客服等实时场景", "D. 必须同时使用多轮对话"],
    answer: ["A", "C"],
    explanation: "流式改善首 token 体验、适合实时场景；不改变推理与答案质量，也不必绑定多轮。"
  },
  {
    id: 84,
    category: "大模型检索增强",
    question: "RAG 的「生成」阶段通常包括？（多选）",
    options: ["A. 将检索片段与问题按模板组装成提示", "B. 调用大模型基于该提示生成回复", "C. 不注入检索内容，用模型自身知识", "D. 可用 system 或模板约束输出格式"],
    answer: ["A", "B", "D"],
    explanation: "生成阶段将检索内容与问题注入提示并调用模型，可加格式约束；不注入则非 RAG 生成。"
  },
  {
    id: 85,
    category: "大模型微调",
    question: "微调训练时，下列哪些说法正确？（多选）",
    options: ["A. 学习率一般比预训练时小", "B. 需关注过拟合（训练集好、验证集差）", "C. 指令微调常用指令-回答对或对话数据", "D. 不需要验证集，看训练损失即可"],
    answer: ["A", "B", "C"],
    explanation: "小学习率、防过拟合、指令数据形式为常见做法；需验证集评估泛化。"
  },
  {
    id: 86,
    category: "生产环境应用实践",
    question: "使用 vLLM 部署大模型推理服务时，其特点包括？（多选）",
    options: ["A. 面向大模型推理，支持高吞吐", "B. 可通过命令行等方式快速部署", "C. 提供 OpenAI 兼容的 HTTP 接口", "D. 用于训练，不用于推理"],
    answer: ["A", "B", "C"],
    explanation: "vLLM 面向推理部署，支持命令行部署与 OpenAI 兼容 API。"
  },
  {
    id: 87,
    category: "大模型提示词工程",
    question: "在提示词中使用【】、###、--- 或 xml 标签等分隔符，可以起到哪些作用？（多选）",
    options: ["A. 区分指令、上下文、用户输入等部分", "B. 帮助模型聚焦关键内容", "C. 形式可灵活选择", "D. 必须与正文已大量使用的符号一致"],
    answer: ["A", "B", "C"],
    explanation: "分隔符用于区分与聚焦；形式多样；若正文已大量使用某符号，应避免重复以免混淆。"
  },
  {
    id: 88,
    category: "多Agent及多模态应用",
    question: "多模态大模型应用可能涉及哪些模态？（多选）",
    options: ["A. 文本与图像", "B. 语音", "C. 视频", "D. 纯文本"],
    answer: ["A", "B", "C"],
    explanation: "多模态包括文本、图像、语音、视频等；仅纯文本为单模态。"
  },
  {
    id: 89,
    category: "生产环境应用实践",
    question: "为降低延迟或成本，课程中提到的性能优化手段包括？（多选）",
    options: ["A. 模型量化、剪枝、知识蒸馏", "B. 上下文缓存、批处理", "C. 精简输入输出 token、设置 max_tokens", "D. 无差别增大模型规模"],
    answer: ["A", "B", "C"],
    explanation: "量化/剪枝/蒸馏、缓存/批处理、精简 token 为常见手段；增大规模通常增加延迟与成本。"
  },
  {
    id: 90,
    category: "大模型检索增强",
    question: "Ragas 计算 Answer Correctness 时会用到？（多选）",
    options: ["A. 语义相似度（如 embedding 后余弦相似度）", "B. 事实准确度（如观点列表比较）", "C. 字符串完全匹配", "D. 检索召回率"],
    answer: ["A", "B"],
    explanation: "Answer Correctness 结合语义相似度与事实准确度。"
  },
  {
    id: 91,
    category: "大模型应用开发",
    question: "关于 temperature 与 top_p，下列哪些说法正确？（多选）",
    options: ["A. temperature 越低，输出越稳定", "B. top_p 控制参与采样的 token 集合范围", "C. 二者功能相同可互换", "D. 可配合使用以权衡多样性与稳定性"],
    answer: ["A", "B", "D"],
    explanation: "temperature 控制随机性，top_p 控制候选集合；二者不同但可配合使用。"
  },
  {
    id: 92,
    category: "生产环境应用实践",
    question: "阿里云 AI 安全护栏可以用于？（多选）",
    options: ["A. 对输入、输出做内容风险审查", "B. 支持长上下文与流式审核", "C. 通过 API、百炼、WAF 等集成", "D. 替代模型推理并直接返回安全结果"],
    answer: ["A", "B", "C"],
    explanation: "安全护栏做输入输出审查，支持长上下文与流式，可多种方式集成；不替代模型推理。"
  },
  {
    id: 94,
    category: "大模型应用开发",
    question: "使用 DashScope 调用通义千问模型时，需要配置哪些关键参数？",
    options: ["A. model 和 api_key", "B. model、api_key 和 api_base", "C. 只需要 model", "D. 只需 api_key"],
    answer: "B",
    explanation: "调用 DashScope API 需要指定模型名称、API密钥以及 API 端点地址。"
  },
  {
    id: 95,
    category: "大模型应用开发",
    question: "在多轮对话中，如果对话历史过长可能导致什么问题？",
    options: ["A. 模型响应更快", "B. 超过模型的上下文窗口限制", "C. 回答更准确", "D. 减少 token 消耗"],
    answer: "B",
    explanation: "过长的对话历史会超出模型的上下文窗口限制，需要进行截断或摘要处理。"
  },
  {
    id: 96,
    category: "大模型提示词工程",
    question: "在提示词中使用【】、###、--- 等符号的主要目的是？",
    options: ["A. 增加 token 数量", "B. 区分指令、上下文、用户输入等不同部分", "C. 提高生成速度", "D. 替代 system 消息"],
    answer: "B",
    explanation: "分隔符用于区分提示词中的不同部分，帮助模型正确理解各部分的作用。"
  },
  {
    id: 97,
    category: "大模型提示词工程",
    question: "设计 RAG 系统的提示模板时，更推荐的做法是？",
    options: ["A. 将检索内容和用户问题混合在一起", "B. 用分隔符区分参考内容与用户问题", "C. 不添加任何约束", "D. 只提供用户问题"],
    answer: "B",
    explanation: "用分隔符区分检索内容与用户问题可以提高模型依据文档作答的准确性。"
  },
  {
    id: 98,
    category: "大模型检索增强",
    question: "RAG 应用中，文档解析阶段可能遇到的问题包括？",
    options: ["A. 部分文档格式不支持解析", "B. 表格、图片等内容难以正确提取", "C. 文本分段后信息不完整", "D. 以上都有可能"],
    answer: "D",
    explanation: "文档解析可能面临格式支持、特殊内容提取、分段信息丢失等多种问题。"
  },
  {
    id: 99,
    category: "大模型检索增强",
    question: "在 RAG 切片过程中，切片过大可能带来什么问题？",
    options: ["A. 引入过多干扰信息", "B. 丢失关键信息", "C. 向量维度变高", "D. 检索速度加快"],
    answer: "A",
    explanation: "切片过大会包含过多不相关的内容，增加噪声影响模型回答准确性。"
  },
  {
    id: 100,
    category: "大模型检索增强",
    question: "句子窗口检索（Sentence Window Retrieval）的特点是什么？",
    options: ["A. 只返回当前句子，不包含上下文", "B. 每个切片包含周围句子作为上下文窗口", "C. 按段落检索", "D. 不需要向量化"],
    answer: "B",
    explanation: "句子窗口检索在返回切片时包含周围的句子作为上下文，平衡精度与上下文完整性。"
  },
  {
    id: 101,
    category: "大模型检索增强",
    question: "语义切片（Semantic Splitter）与其他切片方法的主要区别是？",
    options: ["A. 按固定字符数分割", "B. 根据语义相关性自适应选择分割点", "C. 按句子结束符分割", "D. 按标题层级分割"],
    answer: "B",
    explanation: "语义切片根据文本内容在语义转折点自动识别分割位置，更适合逻辑性强的文档。"
  },
  {
    id: 102,
    category: "大模型检索增强",
    question: "在 RAG 评测中，Context Recall 指标主要用于评估？",
    options: ["A. 答案与问题的相关程度", "B. 检索到的内容中有多少是真正相关的", "C. 生成答案的流畅度", "D. 模型的推理能力"],
    answer: "B",
    explanation: "Context Recall 评估应被检索到的相关内容实际被召回的比例。"
  },
  {
    id: 103,
    category: "大模型检索增强",
    question: "RAG 系统中，意图空间与知识空间的关系可以描述为？",
    options: ["A. 两者完全独立", "B. 存在交集与差异，需要优化匹配", "C. 知识空间大于意图空间即可", "D. 意图空间不需要知识空间支撑"],
    answer: "B",
    explanation: "用户意图空间与知识库存在交集与差异，需要通过优化提升匹配效果。"
  },
  {
    id: 104,
    category: "大模型检索增强",
    question: "使用 DashScopeParse 解析文档的主要优势是？",
    options: ["A. 可以直接生成 Markdown 格式", "B. 支持 PDF、Word 等多种格式", "C. 可以提取图片中的文本信息", "D. 以上都是"],
    answer: "D",
    explanation: "DashScopeParse 背后使用文档智能服务，支持多种格式解析和图片文本提取。"
  },
  {
    id: 105,
    category: "大模型检索增强",
    question: "在 LlamaIndex 中，SimilarityTopK 参数用于控制什么？",
    options: ["A. 生成答案的长度", "B. 检索时返回的相关文档切片数量", "C. 模型的 temperature", "D. 文本分块的大小"],
    answer: "B",
    explanation: "SimilarityTopK 控制检索阶段返回的最相关文档切片数量。"
  },
  {
    id: 106,
    category: "大模型微调",
    question: "在微调过程中，如果训练 loss 持续下降但验证 loss 上升，说明发生了什么？",
    options: ["A. 模型正在学习", "B. 过拟合现象", "C. 学习率过低", "D. 数据量不足"],
    answer: "B",
    explanation: "训练 loss 下降但验证 loss 上升是典型的过拟合现象，模型过度记忆训练数据。"
  },
  {
    id: 107,
    category: "大模型微调",
    question: "PEFT（参数高效微调）方法相比全量微调的主要优势是？",
    options: ["A. 效果一定更好", "B. 训练时间更长", "C. 显存需求更低，可训练参数更少", "D. 需要更多数据"],
    answer: "C",
    explanation: "PEFT 通过训练少量适配器参数大幅降低显存和计算成本。"
  },
  {
    id: 108,
    category: "大模型微调",
    question: "在微调数据准备中，数据质量与数据量的关系应该是？",
    options: ["A. 数量比质量重要", "B. 质量比数量更重要", "C. 两者同等重要", "D. 数量越大越好"],
    answer: "B",
    explanation: "高质量的数据比大量低质量数据更重要，质量决定了微调效果的上限。"
  },
  {
    id: 109,
    category: "多Agent及多模态应用",
    question: "百炼平台构建智能体时，工具调用的核心作用是？",
    options: ["A. 生成更长的回答", "B. 让模型能够调用外部 API 完成特定任务", "C. 减少 token 消耗", "D. 提高模型温度"],
    answer: "B",
    explanation: "工具调用让智能体能够使用检索、计算、数据库等外部能力完成复杂任务。"
  },
  {
    id: 110,
    category: "多Agent及多模态应用",
    question: "在多 Agent 系统中，负责协调各 Agent 工作的层级通常称为？",
    options: ["A. 执行层", "B. 编排层", "C. 存储层", "D. 展示层"],
    answer: "B",
    explanation: "编排层负责任务分解、路由和多 Agent 之间的协调工作。"
  },
  {
    id: 111,
    category: "多Agent及多模态应用",
    question: "多模态大模型与纯文本模型的主要区别是？",
    options: ["A. 参数更多", "B. 支持处理图像、语音等多种模态的输入输出", "C. 推理更快", "D. 价格更低"],
    answer: "B",
    explanation: "多模态模型能够同时处理文本、图像、语音等不同模态的数据。"
  },
  {
    id: 112,
    category: "生产环境应用实践",
    question: "vLLM 框架主要用于解决什么问题？",
    options: ["A. 模型训练", "B. 大模型高吞吐推理部署", "C. 数据标注", "D. 模型评测"],
    answer: "B",
    explanation: "vLLM 专为大模型推理设计，提供高吞吐量的推理服务。"
  },
  {
    id: 113,
    category: "生产环境应用实践",
    question: "使用函数计算（FC）部署 AI 应用的主要优势是？",
    options: ["A. 需要长期占用资源", "B. 按需弹性伸缩，免运维", "C. 只能部署小模型", "D. 不支持高并发"],
    answer: "B",
    explanation: "函数计算提供按需扩缩容能力，适合快速上线和弹性负载场景。"
  },
  {
    id: 114,
    category: "生产环境应用实践",
    question: "在生产环境中，提升大模型服务稳定性的常见措施不包括？",
    options: ["A. 增加超时时间", "B. 重试与熔断", "C. 限流与降级", "D. 监控与告警"],
    answer: "A",
    explanation: "仅增加超时时间不能解决稳定性问题，需要综合使用重试、熔断、限流等措施。"
  },
  {
    id: 115,
    category: "生产环境应用实践",
    question: "SLO 中 TTFT 指标衡量的是？",
    options: ["A. 整体响应时间", "B. 首 token 延迟", "C. 每个 token 的生成时间", "D. 模型加载时间"],
    answer: "B",
    explanation: "TTFT（Time To First Token）衡量从请求到收到第一个 token 的时间。"
  },
  {
    id: 116,
    category: "生产环境应用实践",
    question: "阿里云 AI 安全护栏的主要功能是？",
    options: ["A. 模型加速", "B. 对输入输出做内容风险审查", "C. 数据存储", "D. 日志分析"],
    answer: "B",
    explanation: "AI 安全护栏对输入输出进行内容安全审查，支持多种集成方式。"
  },
  {
    id: 117,
    category: "大模型检索增强",
    question: "在 RAG 系统中，余弦相似度用于衡量什么？",
    options: ["A. 两个向量的夹角余弦值，越大表示越相似", "B. 文本长度差异", "C. token 数量差异", "D. 模型参数量"],
    answer: "A",
    explanation: "余弦相似度衡量向量方向的相似程度，值越大表示语义越相近。"
  },
  {
    id: 118,
    category: "大模型检索增强",
    question: "使用更强的 Embedding 模型对 RAG 效果的影响是？",
    options: ["A. 可能提升检索质量", "B. 一定会降低效果", "C. 没有影响", "D. 只影响生成速度"],
    answer: "A",
    explanation: "新版本 Embedding 模型通常能提供更好的向量化效果，提升检索准确性。"
  },
  {
    id: 119,
    category: "大模型提示词工程",
    question: "上下文工程框架的主要作用是？",
    options: ["A. 控制模型参数", "B. 结构化组织提示词中的上下文信息", "C. 减少 token 消耗", "D. 替代模型调用"],
    answer: "B",
    explanation: "上下文工程框架帮助结构化组织提示词，提升模型对信息的理解能力。"
  },
  {
    id: 120,
    category: "多Agent及多模态应用",
    question: "Agent 在执行工具调用时，如果用户输入包含恶意指令，可能导致什么风险？",
    options: ["A. 响应变慢", "B. 指令注入攻击", "C. token 消耗增加", "D. 模型知识过时"],
    answer: "B",
    explanation: "恶意指令可能被工具执行，导致未授权操作或数据泄露。"
  },
  {
    id: 121,
    category: "大模型应用开发",
    question: "批量生成（Batch Generate）与流式生成（Streaming）的主要区别是？",
    options: ["A. 批量生成一次返回全部结果", "B. 流式生成一次返回全部结果", "C. 两者无区别", "D. 批量生成不支持多轮对话"],
    answer: "A",
    explanation: "批量生成一次性处理多个请求并返回全部结果，流式则边生成边返回。"
  },
  {
    id: 122,
    category: "大模型检索增强",
    question: "在 RAG 系统中，未被覆盖的意图空间通常会导致什么问题？",
    options: ["A. 回答更加准确", "B. 模型可能产生幻觉", "C. 检索速度加快", "D. 减少 token 消耗"],
    answer: "B",
    explanation: "缺乏知识库支撑的意图空间，大模型容易生成不准确的幻觉回答。"
  },
  {
    id: 123,
    category: "大模型微调",
    question: "指令微调（Instruction Tuning）常用的训练数据形式是？",
    options: ["A. 原始长文本", "B. 指令-回答对", "C. 图像标注对", "D. 无标注数据"],
    answer: "B",
    explanation: "指令微调使用指令-回答对或对话数据，训练模型按指令执行任务。"
  },
  {
    id: 124,
    category: "大模型检索增强",
    question: "MarkdownNodeParser 主要用于什么场景？",
    options: ["A. 处理 JSON 文件", "B. 处理 Markdown 格式文档", "C. 处理音频文件", "D. 处理视频文件"],
    answer: "B",
    explanation: "MarkdownNodeParser 专门针对 Markdown 文档按标题层级进行智能分割。"
  },
  {
    id: 125,
    category: "生产环境应用实践",
    question: "在成本优化方面，不推荐的做法是？",
    options: ["A. 使用缓存减少重复调用", "B. 根据场景选择合适规模的模型", "C. 无差别使用最大模型", "D. 精简输入 token"],
    answer: "C",
    explanation: "应根据实际需求选择合适模型，无差别使用最大模型会导致成本浪费。"
  },
  {
    id: 126,
    category: "大模型应用开发",
    question: "调用 OpenAI 兼容接口时，messages 数组中 assistant 角色的作用是？",
    options: ["A. 表示用户输入", "B. 表示系统设定", "C. 模拟对话历史中模型的回复", "D. 用于工具调用"],
    answer: "C",
    explanation: "assistant 角色用于记录对话历史中模型的回复，帮助模型理解上下文。"
  },

  // ========== 多选题 新增 ==========
  {
    id: 127,
    category: "大模型检索增强",
    question: "RAG 系统中常用的文档切片方法包括？（多选）",
    options: ["A. Token 切片", "B. 句子切片", "C. 句子窗口切片", "D. 语义切片"],
    answer: ["A", "B", "C", "D"],
    explanation: "RAG 常用切片方法包括 Token、句子、句子窗口、语义和 Markdown 切片等。"
  },
  {
    id: 128,
    category: "大模型检索增强",
    question: "评估 RAG 效果时，Ragas 框架提供的指标包括？（多选）",
    options: ["A. Answer Correctness", "B. Context Precision", "C. Context Recall", "D. 生成 Token 数"],
    answer: ["A", "B", "C"],
    explanation: "Ragas 提供答案正确性、上下文精确率、召回率、忠实度等指标。"
  },
  {
    id: 129,
    category: "大模型检索增强",
    question: "以下哪些方法可以帮助提升 RAG 检索效果？（多选）",
    options: ["A. 使用更强的 Embedding 模型", "B. 对召回结果做重排序", "C. 使用句子窗口检索", "D. 增大每次召回的切片数量"],
    answer: ["A", "B", "C"],
    explanation: "优化 Embedding、使用 rerank、句子窗口检索均可提升效果；单纯增加召回量可能引入噪声。"
  },
  {
    id: 130,
    category: "大模型微调",
    question: "微调时可能遇到的常见问题包括？（多选）",
    options: ["A. 过拟合", "B. 欠拟合", "C. 灾难性遗忘", "D. 数据泄露"],
    answer: ["A", "B", "C"],
    explanation: "过拟合、欠拟合、灾难性遗忘是微调常见问题，需要通过正则化、验证集等方法应对。"
  },
  {
    id: 131,
    category: "多Agent及多模态应用",
    question: "多模态大模型应用可以处理哪些模态？（多选）",
    options: ["A. 文本", "B. 图像", "C. 语音", "D. 视频"],
    answer: ["A", "B", "C", "D"],
    explanation: "多模态模型支持文本、图像、语音、视频等多种模态的输入输出。"
  },
  {
    id: 132,
    category: "生产环境应用实践",
    question: "部署大模型推理服务时，可选方案包括？（多选）",
    options: ["A. vLLM", "B. 函数计算 FC", "C. PAI", "D. 直接使用本地 CPU"],
    answer: ["A", "B", "C"],
    explanation: "vLLM、函数计算、PAI 都是常见的云上部署方案，本地 CPU 不适合大规模部署。"
  },
  {
    id: 133,
    category: "大模型应用开发",
    question: "调用大模型 API 时，可以通过哪些方式控制输出稳定性？（多选）",
    options: ["A. 调整 temperature 参数", "B. 调整 top_p 参数", "C. 设置固定的 seed 值", "D. 增大 max_tokens"],
    answer: ["A", "B", "C"],
    explanation: "temperature、top_p 和 seed 都可以影响输出的随机性和稳定性。"
  },
  {
    id: 134,
    category: "大模型检索增强",
    question: "构建知识库时，文档解析阶段可能遇到哪些挑战？（多选）",
    options: ["A. 不同格式文档的支持", "B. 表格内容的提取", "C. 图片中文字的识别", "D. 音频文件的转录"],
    answer: ["A", "B", "C"],
    explanation: "文档解析需处理格式支持、表格提取、图文识别等问题，音频不属于文档解析范畴。"
  },
  {
    id: 135,
    category: "大模型提示词工程",
    question: "在设计提示词时，应该包含哪些要素？（多选）",
    options: ["A. 任务目标", "B. 上下文信息", "C. 输出格式要求", "D. 模型权重路径"],
    answer: ["A", "B", "C"],
    explanation: "提示词设计要素包括任务目标、上下文、角色设定、输出格式等，不需要模型权重路径。"
  },
  {
    id: 136,
    category: "生产环境应用实践",
    question: "大模型应用的安全防护措施包括？（多选）",
    options: ["A. 输入输出内容审核", "B. 提示词注入检测", "C. 指令注入防护", "D. 完全禁用 API 调用"],
    answer: ["A", "B", "C"],
    explanation: "安全防护包括内容审核、注入检测等措施，不需要禁用 API 调用。"
  },
  {
    id: 137,
    category: "大模型检索增强",
    question: "在 LlamaIndex 中，可以通过哪些方式优化 RAG 效果？（多选）",
    options: ["A. 调整 similarity_top_k 参数", "B. 使用不同的节点分割器", "C. 更换 Embedding 模型", "D. 修改系统提示词"],
    answer: ["A", "B", "C"],
    explanation: "调整召回数量、选择合适的分割器、更换 Embedding 模型都可以优化 RAG 效果。"
  },
  {
    id: 138,
    category: "大模型微调",
    question: "参数高效微调（PEFT）方法包括？（多选）",
    options: ["A. LoRA", "B. QLoRA", "C. Adapter", "D. 全参数训练"],
    answer: ["A", "B", "C"],
    explanation: "LoRA、QLoRA、Adapter 都是 PEFT 方法，全参数训练不属于参数高效微调。"
  },
  {
    id: 139,
    category: "多Agent及多模态应用",
    question: "智能体的核心能力模块包括？（多选）",
    options: ["A. 思考与规划", "B. 感知与理解", "C. 执行与行动", "D. 记忆与存储"],
    answer: ["A", "B", "C", "D"],
    explanation: "智能体具备思考规划、感知理解、执行行动、记忆存储四大核心能力。"
  },
  {
    id: 140,
    category: "大模型检索增强",
    question: "选择 Embedding 模型时应该考虑哪些因素？（多选）",
    options: ["A. 模型版本新旧", "B. 语义理解能力", "C. 输入长度限制", "D. 价格因素"],
    answer: ["A", "B", "C", "D"],
    explanation: "选择 Embedding 模型需综合考虑性能、输入限制、成本等多方面因素。"
  },
  {
    id: 141,
    category: "生产环境应用实践",
    question: "在大模型应用的成本优化中，可以采取哪些措施？（多选）",
    options: ["A. 使用上下文缓存", "B. 批处理请求", "C. 精简输入输出 token", "D. 始终使用最大模型"],
    answer: ["A", "B", "C"],
    explanation: "缓存、批处理、精简 token 均可降低成本，不应根据场景选择合适模型。"
  },

  // ========== 补充题目到200题 ==========
  // 大模型应用开发 17% - 补充约6题
  {
    id: 142,
    category: "大模型应用开发",
    question: "在使用 OpenAI 兼容 API 时，以下哪个参数可以控制生成文本的随机性？",
    options: ["A. max_tokens", "B. temperature", "C. model", "D. stream"],
    answer: "B",
    explanation: "temperature 参数控制生成文本的随机性，值越高越随机，越低越确定。"
  },
  {
    id: 143,
    category: "大模型应用开发",
    question: "流式输出（Streaming）与普通输出相比，主要优势是什么？",
    options: ["A. 答案更准确", "B. 用户可以更早看到部分结果", "C. 消耗更少 token", "D. 支持更长上下文"],
    answer: "B",
    explanation: "流式输出让用户无需等待完整响应即可看到部分结果，改善体验。"
  },
  {
    id: 144,
    category: "大模型应用开发",
    question: "在使用百炼平台 API 时，API Key 通常应该如何存储？",
    options: ["A. 写在代码里方便调用", "B. 存在环境变量或配置中心", "C. 硬编码在 HTML 文件中", "D. 存放在前端 JavaScript 中"],
    answer: "B",
    explanation: "API Key 应存放在环境变量或配置中心，避免明文暴露在代码中。"
  },
  {
    id: 145,
    category: "大模型应用开发",
    question: "对话历史中，system 消息的作用是什么？",
    options: ["A. 提供用户当前问题", "B. 定义模型的角色和行为规则", "C. 存储模型的历史回答", "D. 用于传递工具调用结果"],
    answer: "B",
    explanation: "system 消息用于设定模型的身份、行为规范和全局约束。"
  },
  {
    id: 146,
    category: "大模型应用开发",
    question: "max_tokens 参数的主要作用是什么？",
    options: ["A. 控制输入长度", "B. 限制输出 token 的最大数量", "C. 设置生成速度", "D. 控制 temperature"],
    answer: "B",
    explanation: "max_tokens 限制单次请求生成的最大 token 数，起到成本和长度控制作用。"
  },
  {
    id: 147,
    category: "大模型应用开发",
    question: "在使用大模型 API 时，如果需要保持对话上下文，应该如何处理？",
    options: ["A. 每次只传当前问题", "B. 将历史对话消息全部传入 messages", "C. 不传任何历史", "D. 只传 system 消息"],
    answer: "B",
    explanation: "多轮对话需要将完整对话历史传入 messages，模型才能理解上下文。"
  },

  // 大模型提示词工程 15% - 补充约12题
  {
    id: 148,
    category: "大模型提示词工程",
    question: "在设计提示词时，角色设定的作用是什么？",
    options: ["A. 增加模型参数", "B. 影响模型回答的风格和专业范围", "C. 提高推理速度", "D. 减少 token 消耗"],
    answer: "B",
    explanation: "角色设定让模型以特定身份回答，影响回答的口吻、专业领域和风格。"
  },
  {
    id: 149,
    category: "大模型提示词工程",
    question: "Few-shot（少样本）学习的核心思想是什么？",
    options: ["A. 不给任何示例直接让模型回答", "B. 提供少量示例帮助模型理解任务要求", "C. 让模型自己学习", "D. 使用多个模型"],
    answer: "B",
    explanation: "Few-shot 通过提供1-3个示例，帮助模型理解期望的输出格式和风格。"
  },
  {
    id: 150,
    category: "大模型提示词工程",
    question: "提示词模板中，使用占位符（如 {query}、{context}）的主要目的是？",
    options: ["A. 增加 token 数量", "B. 便于程序动态替换内容", "C. 减少模型参数量", "D. 加快生成速度"],
    answer: "B",
    explanation: "占位符允许程序在运行时将用户问题、检索内容等动态注入提示词。"
  },
  {
    id: 151,
    category: "大模型提示词工程",
    question: "在 RAG 场景中，提示词通常需要包含哪些部分？",
    options: ["A. 只需要用户问题", "B. 检索到的上下文和用户问题", "C. 大量无关信息", "D. 模型配置参数"],
    answer: "B",
    explanation: "RAG 提示词需要包含检索到的参考内容以及用户问题，让模型依据文档作答。"
  },
  {
    id: 152,
    category: "大模型提示词工程",
    question: " Chain-of-Thought（思维链）提示主要用于什么场景？",
    options: ["A. 简单问答", "B. 需要推理步骤的复杂问题", "C. 文本分类", "D. 情感分析"],
    answer: "B",
    explanation: "思维链提示引导模型先展示推理过程再给出答案，适合数学、逻辑等任务。"
  },
  {
    id: 153,
    category: "大模型提示词工程",
    question: "在设计输出格式时，明确格式要求（如 JSON）的主要目的是？",
    options: ["A. 增加回答长度", "B. 便于程序解析和处理", "C. 减少 token 消耗", "D. 提高模型准确率"],
    answer: "B",
    explanation: "明确输出格式使模型输出更规范，便于后续程序解析和集成。"
  },
  {
    id: 154,
    category: "大模型提示词工程",
    question: "提示词中的上下文信息主要用于什么？",
    options: ["A. 增加 token 消耗", "B. 为模型提供回答问题所需的背景知识", "C. 替代模型推理", "D. 控制随机性"],
    answer: "B",
    explanation: "上下文信息为模型提供回答问题所需的背景资料，帮助生成更准确的答案。"
  },
  {
    id: 155,
    category: "大模型提示词工程",
    question: "在长文档处理场景中，使用分隔符区分不同部分的作用是？",
    options: ["A. 让文档更长", "B. 帮助模型正确理解各部分的作用", "C. 增加存储空间", "D. 加快检索速度"],
    answer: "B",
    explanation: "分隔符帮助模型区分指令、上下文、问题等不同部分，减少混淆。"
  },
  {
    id: 156,
    category: "大模型提示词工程",
    question: "零样本（Zero-shot）提示的特点是什么？",
    options: ["A. 需要大量示例", "B. 不提供任何示例，直接让模型推理", "C. 必须使用 system 消息", "D. 需要人工标注数据"],
    answer: "B",
    explanation: "零样本提示不给示例，直接描述任务要求，让模型凭自身能力完成。"
  },
  {
    id: 157,
    category: "大模型提示词工程",
    question: "在设计提示词时，任务目标描述应该遵循什么原则？",
    options: ["A. 越模糊越好", "B. 清晰明确", "C. 越长越好", "D. 使用专业术语越多越好"],
    answer: "B",
    explanation: "清晰明确的任务目标有助于模型准确理解需求，提高回答质量。"
  },
  {
    id: 158,
    category: "大模型提示词工程",
    question: "Meta Prompting 元提示方法的核心思想是什么？",
    options: ["A. 使用更多模型", "B. 让模型自己优化提示词", "C. 固定使用一个模板", "D. 减少提示词长度"],
    answer: "B",
    explanation: "元提示让模型分析和优化自身的提示策略，提升任务完成效果。"
  },
  {
    id: 159,
    category: "大模型提示词工程",
    question: "在提示词中指定受众的作用是什么？",
    options: ["A. 影响回答的专业程度和表达方式", "B. 增加 token", "C. 改变模型参数", "D. 加快生成速度"],
    answer: "A",
    explanation: "明确受众可以让模型调整回答的专业程度和表达方式，更符合读者需求。"
  },

  // 大模型检索增强 20% - 补充约8题
  {
    id: 160,
    category: "大模型检索增强",
    question: "RAG 系统中，文本向量化的主要目的是什么？",
    options: ["A. 压缩存储空间", "B. 将文本转换为数学向量，便于语义相似度计算", "C. 加密文本", "D. 加快读取速度"],
    answer: "B",
    explanation: "向量化将文本转换为向量表示，通过向量相似度实现语义检索。"
  },
  {
    id: 161,
    category: "大模型检索增强",
    question: "在 RAG 检索中，相似度阈值（Similarity Threshold）的作用是？",
    options: ["A. 限制返回结果的数量", "B. 过滤掉低于阈值的低相关性结果", "C. 控制向量维度", "D. 调整生成速度"],
    answer: "B",
    explanation: "相似度阈值用于过滤掉相关性低的结果，提高召回质量。"
  },
  {
    id: 162,
    category: "大模型检索增强",
    question: "重排序（Rerank）阶段的主要作用是什么？",
    options: ["A. 减少向量数量", "B. 对初步检索结果进行二次排序，提升相关性", "C. 过滤敏感词", "D. 压缩文档"],
    answer: "B",
    explanation: "Rerank 对初步召回结果进行更精细的排序，提高顶部结果的相关性。"
  },
  {
    id: 163,
    category: "大模型检索增强",
    question: "向量数据库的主要功能是什么？",
    options: ["A. 存储结构化数据", "B. 存储和检索向量数据", "C. 执行 SQL 查询", "D. 缓存 HTTP 响应"],
    answer: "B",
    explanation: "向量数据库专门用于存储和高效检索向量数据，支持相似度搜索。"
  },
  {
    id: 164,
    category: "大模型检索增强",
    question: "在 RAG 中，文档预处理阶段通常不包括以下哪项？",
    options: ["A. 文档格式转换", "B. 文本清洗", "C. 模型预训练", "D. 去除噪声"],
    answer: "C",
    explanation: "文档预处理包括格式转换、清洗、分段等，不包括模型预训练。"
  },
  {
    id: 165,
    category: "大模型检索增强",
    question: "RAG 系统中，ground_truth（标准答案）的主要作用是什么？",
    options: ["A. 训练模型", "B. 作为评测参考答案，用于评估生成质量", "C. 过滤检索结果", "D. 压缩存储"],
    answer: "B",
    explanation: "Ground truth 作为标准答案，用于 RAG 效果评测，对比生成结果与标准答案的差异。"
  },
  {
    id: 166,
    category: "大模型检索增强",
    question: "自动合并检索（Auto-merging Retrieval）的主要特点是什么？",
    options: ["A. 按固定大小合并", "B. 根据语义相关性自动合并小切片为大切片", "C. 删除重复内容", "D. 加密文档"],
    answer: "B",
    explanation: "自动合并检索将语义相关的小切片自动合并，提供更完整的上下文。"
  },
  {
    id: 167,
    category: "大模型检索增强",
    question: "在 RAG 评测中，Answer Relevancy 指标衡量的是什么？",
    options: ["A. 答案与标准答案的字面匹配度", "B. 答案与问题的语义相关程度", "C. 检索召回率", "D. 模型推理速度"],
    answer: "B",
    explanation: "Answer Relevancy 评估生成的答案与用户问题的语义相关程度。"
  },

  // 大模型微调 16% - 补充约14题
  {
    id: 168,
    category: "大模型微调",
    question: "微调数据集的格式通常是什么？",
    options: ["A. 纯文本文件", "B. 指令-回答对或对话格式", "C. 图片文件", "D. 音频文件"],
    answer: "B",
    explanation: "微调数据通常采用指令-回答对或对话轮次格式，便于模型学习。"
  },
  {
    id: 169,
    category: "大模型微调",
    question: "灾难性遗忘（Catastrophic Forgetting）是指什么问题？",
    options: ["A. 训练速度太慢", "B. 微调后模型遗忘了原有的通用能力", "C. 过拟合现象", "D. 数据不足"],
    answer: "B",
    explanation: "灾难性遗忘指模型在微调后遗忘预训练阶段学到的知识，导致原有能力下降。"
  },
  {
    id: 170,
    category: "大模型微调",
    question: "LoRA 方法的核心思想是什么？",
    options: ["A. 训练全部参数", "B. 训练低秩矩阵作为适配器", "C. 压缩模型体积", "D. 增加模型层数"],
    answer: "B",
    explanation: "LoRA 通过训练低秩矩阵（适配器）来改变模型行为，效率高且效果好。"
  },
  {
    id: 171,
    category: "大模型微调",
    question: "在微调时，学习率设置过大可能导致什么问题？",
    options: ["A. 训练太慢", "B. 模型无法收敛或性能下降", "C. 减少过拟合", "D. 提高泛化能力"],
    answer: "B",
    explanation: "过大的学习率会导致训练不稳定，模型无法收敛或性能下降。"
  },
  {
    id: 172,
    category: "大模型微调",
    question: "微调数据集的质量对最终效果有什么影响？",
    options: ["A. 影响不大", "B. 质量越高，效果越好", "C. 数量比质量重要", "D. 没有影响"],
    answer: "B",
    explanation: "高质量的训练数据是微调效果的关键，低质量数据可能导致模型学习错误模式。"
  },
  {
    id: 173,
    category: "大模型微调",
    question: "在微调过程中，验证集的主要作用是什么？",
    options: ["A. 训练模型", "B. 评估模型泛化能力，防止过拟合", "C. 减少成本", "D. 加快推理"],
    answer: "B",
    explanation: "验证集用于评估模型在未见数据上的表现，帮助判断是否过拟合。"
  },
  {
    id: 174,
    category: "大模型微调",
    question: "QLoRA 与 LoRA 相比，主要改进是什么？",
    options: ["A. 训练更多参数", "B. 结合量化技术，进一步降低显存需求", "C. 加快推理速度", "D. 提高模型准确率"],
    answer: "B",
    explanation: "QLoRA 在 LoRA 基础上结合量化技术，可以用更少显存微调大模型。"
  },
  {
    id: 175,
    category: "大模型微调",
    question: "微调时如果数据分布与预训练数据差异过大，应该如何处理？",
    options: ["A. 直接开始训练", "B. 混合通用数据进行训练", "C. 减少训练轮次", "D. 使用更小模型"],
    answer: "B",
    explanation: "混合通用数据可以缓解分布差异导致的灾难性遗忘问题。"
  },
  {
    id: 176,
    category: "大模型微调",
    question: "在构建微调数据集时，数据多样性的作用是什么？",
    options: ["A. 没有作用", "B. 提高模型泛化能力", "C. 减少训练时间", "D. 降低显存需求"],
    answer: "B",
    explanation: "多样化的数据帮助模型学习不同场景，提升泛化能力。"
  },
  {
    id: 177,
    category: "大模型微调",
    question: "指令微调（Instruction Tuning）与预训练的主要区别是什么？",
    options: ["A. 使用相同数据", "B. 指令微调使用指令-回答对数据", "C. 不需要标注数据", "D. 两者没有区别"],
    answer: "B",
    explanation: "指令微调使用有标注的指令-回答对数据，有针对性地训练模型按指令执行任务。"
  },
  {
    id: 178,
    category: "大模型微调",
    question: "在微调时，early stopping（早停）的作用是什么？",
    options: ["A. 加快训练速度", "B. 在验证集性能下降时停止训练，防止过拟合", "C. 减少数据量", "D. 压缩模型"],
    answer: "B",
    explanation: "早停机制监控验证集性能，在性能下降时停止训练，避免过拟合。"
  },
  {
    id: 179,
    category: "大模型微调",
    question: "微调完成后，通常需要进行什么评估？",
    options: ["A. 不需要评估", "B. 在测试集上评估模型性能", "C. 只看训练损失", "D. 评估训练时间"],
    answer: "B",
    explanation: "测试集评估可以验证模型在真实任务上的效果，是必要的步骤。"
  },
  {
    id: 180,
    category: "大模型微调",
    question: "Adapter 方法的核心特点是什么？",
    options: ["A. 训练全部模型参数", "B. 在模型中插入小型适配器模块", "C. 压缩模型结构", "D. 减少训练数据"],
    answer: "B",
    explanation: "Adapter 在模型层之间插入小型模块，只训练这些适配器参数。"
  },
  {
    id: 181,
    category: "大模型微调",
    question: "微调时数据标注质量低会导致什么问题？",
    options: ["A. 训练更快", "B. 模型学习错误模式，效果下降", "C. 减少过拟合", "D. 提高泛化能力"],
    answer: "B",
    explanation: "低质量标注会让模型学习错误模式，导致实际应用效果不佳。"
  },

  // 多Agent及多模态应用 16% - 补充约14题
  {
    id: 182,
    category: "多Agent及多模态应用",
    question: "Agent 系统中，工具（Tool）的主要作用是什么？",
    options: ["A. 生成文本", "B. 让模型能够执行特定操作，如搜索、计算等", "C. 存储对话历史", "D. 压缩数据"],
    answer: "B",
    explanation: "工具扩展了 Agent 的能力，让其能够执行搜索、计算、数据库操作等。"
  },
  {
    id: 183,
    category: "多Agent及多模态应用",
    question: "在多 Agent 系统中，协调器（Coordinator）的主要职责是什么？",
    options: ["A. 执行具体任务", "B. 分配任务给各 Agent 并汇总结果", "C. 存储数据", "D. 用户界面展示"],
    answer: "B",
    explanation: "协调器负责任务分解、分配给合适的 Agent，并整合各 Agent 的结果。"
  },
  {
    id: 184,
    category: "多Agent及多模态应用",
    question: "Agent 的记忆（Memory）模块主要用于什么？",
    options: ["A. 增加推理速度", "B. 存储对话历史和上下文信息", "C. 减少 token 消耗", "D. 压缩模型"],
    answer: "B",
    explanation: "记忆模块让 Agent 记住之前的对话内容和中间结果，支持多轮交互。"
  },
  {
    id: 185,
    category: "多Agent及多模态应用",
    question: "在 Agent 中，意图识别的主要作用是什么？",
    options: ["A. 压缩数据", "B. 理解用户想要执行的操作类型", "C. 加快生成速度", "D. 减少 token"],
    answer: "B",
    explanation: "意图识别帮助 Agent 理解用户真实需求，选择合适的工具或策略。"
  },
  {
    id: 186,
    category: "多Agent及多模态应用",
    question: "多模态模型能够处理哪些类型的输入？",
    options: ["A. 只有文本", "B. 文本、图像、语音等", "C. 只有图像", "D. 只有语音"],
    answer: "B",
    explanation: "多模态模型支持同时处理文本、图像、语音、视频等多种模态。"
  },
  {
    id: 187,
    category: "多Agent及多模态应用",
    question: "在设计 Agent 工作流时，循环（Loop）和条件分支（Conditional Branch）的作用分别是？",
    options: ["A. 没有作用", "B. 循环处理重复任务，条件分支处理不同情况", "C. 只用于打印日志", "D. 加快启动速度"],
    answer: "B",
    explanation: "循环处理需要多次迭代的任务，条件分支根据情况选择不同处理路径。"
  },
  {
    id: 188,
    category: "多Agent及多模态应用",
    question: "Agent 工具调用时，需要对用户输入做什么处理？",
    options: ["A. 直接传递即可", "B. 做安全校验，防止注入攻击", "C. 转换为图片", "D. 减少长度"],
    answer: "B",
    explanation: "用户输入可能包含恶意指令，需要做安全校验和过滤，防止注入攻击。"
  },
  {
    id: 189,
    category: "多Agent及多模态应用",
    question: "视觉语言模型（VLM）的主要能力是什么？",
    options: ["A. 只处理图像", "B. 理解和分析图像内容并生成文本描述", "C. 只处理文本", "D. 压缩图像"],
    answer: "B",
    explanation: "视觉语言模型能够“看懂”图像，并基于图像内容进行问答或推理。"
  },
  {
    id: 190,
    category: "多Agent及多模态应用",
    question: "在百炼平台构建 Agent 时，工具描述通常以什么形式提供？",
    options: ["A. 自然语言描述", "B. 代码注释", "C. 图片格式", "D. 音频格式"],
    answer: "A",
    explanation: "工具描述采用自然语言形式，让模型理解工具的功能和参数。"
  },
  {
    id: 191,
    category: "多Agent及多模态应用",
    question: "Agent 系统的反射（Reflection）能力是指什么？",
    options: ["A. 反射光线", "B. 让 Agent 评估自身行为结果并进行调整", "C. 处理图像", "D. 压缩数据"],
    answer: "B",
    explanation: "反射能力让 Agent 能够评估上次行动的结果，必要时调整策略重新尝试。"
  },
  {
    id: 192,
    category: "多Agent及多模态应用",
    question: "在多 Agent 系统中，不同 Agent 之间通常通过什么进行通信？",
    options: ["A. 电子邮件", "B. 消息传递或共享状态", "C. 文件传输", "D. 电话"],
    answer: "B",
    explanation: "Agent 间通过结构化消息或共享状态进行协作和信息交换。"
  },
  {
    id: 193,
    category: "多Agent及多模态应用",
    question: "Qwen-VL 模型属于什么类型的模型？",
    options: ["A. 纯文本模型", "B. 视觉语言多模态模型", "C. 语音识别模型", "D. 推荐系统模型"],
    answer: "B",
    explanation: "Qwen-VL 是阿里发布的视觉语言模型，能够同时处理图像和文本。"
  },
  {
    id: 194,
    category: "多Agent及多模态应用",
    question: "在 Agent 规划能力中，任务分解的作用是什么？",
    options: ["A. 直接给出答案", "B. 将复杂任务拆解为简单子任务", "C. 压缩数据", "D. 减少交互轮次"],
    answer: "B",
    explanation: "任务分解将复杂问题拆分为可管理的子任务，逐步完成。"
  },
  {
    id: 195,
    category: "多Agent及多模态应用",
    question: "多模态应用在内容审核场景中可以实现什么？",
    options: ["A. 只审核文本", "B. 同时审核文本、图像、视频等多模态内容", "C. 压缩存储", "D. 加快网络速度"],
    answer: "B",
    explanation: "多模态能力让内容审核覆盖文本、图像、视频等多种形式的内容。"
  },

  // 生产环境应用实践 16% - 补充约6题
  {
    id: 196,
    category: "生产环境应用实践",
    question: "在生产环境中，限流（Rate Limiting）的主要目的是什么？",
    options: ["A. 加快响应速度", "B. 保护系统不被过载，保护服务质量", "C. 增加成本", "D. 减少功能"],
    answer: "B",
    explanation: "限流通过限制请求速率，防止系统过载，确保服务稳定性。"
  },
  {
    id: 197,
    category: "生产环境应用实践",
    question: "熔断（Circuit Breaker）机制的作用是什么？",
    options: ["A. 加快请求速度", "B. 在服务异常时快速失败，防止故障扩散", "C. 增加存储", "D. 减少日志"],
    answer: "B",
    explanation: "熔断机制在检测到服务异常时快速切断请求，防止故障蔓延影响整体系统。"
  },
  {
    id: 198,
    category: "生产环境应用实践",
    question: "在选择大模型部署方案时，需要考虑哪些因素？",
    options: ["A. 只看价格", "B. 吞吐量、延迟、运维成本、扩展性等", "C. 只需要延迟", "D. 只需要价格"],
    answer: "B",
    explanation: "部署方案选择需综合考虑性能、成本、运维难度、扩展性等多方面因素。"
  },
  {
    id: 199,
    category: "生产环境应用实践",
    question: "降级（Degradation）策略在什么场景下使用？",
    options: ["A. 系统正常时", "B. 当服务部分不可用时提供简化功能", "C. 从不使庺", "D. 只在测试环境使用"],
    answer: "B",
    explanation: "降级策略在服务部分不可用时提供简化功能，保证核心业务可用。"
  },
  {
    id: 200,
    category: "生产环境应用实践",
    question: "在大模型应用中，监控告警通常关注哪些指标？",
    options: ["A. 只监控 token 数量", "B. 延迟、错误率、QPS、token 消耗等", "C. 只监控成本", "D. 只监控用户数量"],
    answer: "B",
    explanation: "生产环境监控包括延迟、错误率、吞吐量、资源消耗等多个维度。"
  },

  // ========== 补充多选题到200题 ==========
  {
    id: 201,
    category: "大模型应用开发",
    question: "在调用大模型 API 时，可以通过哪些方式控制生成质量？（多选）",
    options: ["A. temperature", "B. top_p", "C. max_tokens", "D. model"],
    answer: ["A", "B", "C"],
    explanation: "temperature、top_p 控制随机性，max_tokens 限制长度，model 选择模型。"
  },
  {
    id: 202,
    category: "大模型应用开发",
    question: "多轮对话实现的关键技术包括？（多选）",
    options: ["A. 对话历史管理", "B. 上下文窗口控制", "C. 消息格式组织", "D. 模型参数调整"],
    answer: ["A", "B", "C"],
    explanation: "多轮对话需要管理历史、控制窗口长度、正确组织消息格式。"
  },
  {
    id: 203,
    category: "大模型提示词工程",
    question: "以下哪些是有效的提示词设计要素？（多选）",
    options: ["A. 任务目标", "B. 上下文信息", "C. 角色设定", "D. 输出格式"],
    answer: ["A", "B", "C", "D"],
    explanation: "有效的提示词应包含任务目标、上下文、角色设定和输出格式要求。"
  },
  {
    id: 204,
    category: "大模型检索增强",
    question: "RAG 系统中，向量检索的特点包括？（多选）",
    options: ["A. 基于语义相似度匹配", "B. 支持高维向量计算", "C. 需要向量化模型", "D. 只支持关键词匹配"],
    answer: ["A", "B", "C"],
    explanation: "向量检索基于语义匹配，需要向量化模型支持，不只是关键词匹配。"
  },
  {
    id: 205,
    category: "大模型检索增强",
    question: "文档切片策略需要考虑哪些因素？（多选）",
    options: ["A. 切片大小", "B. 切片重叠度", "C. 业务场景特点", "D. 切片数量越多越好"],
    answer: ["A", "B", "C"],
    explanation: "切片策略需平衡大小、重叠度，并结合业务场景调整，非数量越多越好。"
  },
  {
    id: 206,
    category: "大模型微调",
    question: "微调时防止过拟合的方法包括？（多选）",
    options: ["A. 使用验证集", "B. Early stopping", "C. 正则化技术", "D. 无限增加训练轮次"],
    answer: ["A", "B", "C"],
    explanation: "验证集、早停、正则化都是防止过拟合的有效方法。"
  },
  {
    id: 207,
    category: "大模型微调",
    question: "LoRA 微调的特点包括？（多选）",
    options: ["A. 训练少量参数", "B. 显存需求低", "C. 可以集成到原模型", "D. 需要训练全部参数"],
    answer: ["A", "B", "C"],
    explanation: "LoRA 只训练适配器参数，显存需求低，可与原模型集成，无需训练全部参数。"
  },
  {
    id: 208,
    category: "多Agent及多模态应用",
    question: "Agent 系统的核心能力包括？（多选）",
    options: ["A. 规划分解", "B. 工具调用", "C. 记忆存储", "D. 反射调整"],
    answer: ["A", "B", "C", "D"],
    explanation: "Agent 具备规划、工具、记忆、反射等核心能力。"
  },
  {
    id: 209,
    category: "多Agent及多模态应用",
    question: "多模态模型可以应用在哪些场景？（多选）",
    options: ["A. 图像描述生成", "B. 视频内容理解", "C. 语音助手", "D. 纯文本分类"],
    answer: ["A", "B", "C"],
    explanation: "多模态模型适用于图像描述、视频理解、语音交互等场景。"
  },
  {
    id: 210,
    category: "生产环境应用实践",
    question: "保障大模型服务稳定性的措施包括？（多选）",
    options: ["A. 多副本部署", "B. 限流熔断", "C. 监控告警", "D. 降级策略"],
    answer: ["A", "B", "C", "D"],
    explanation: "多副本、限流熔断、监控告警、降级策略共同保障服务稳定性。"
  },
  {
    id: 211,
    category: "生产环境应用实践",
    question: "大模型应用的合规要求包括？（多选）",
    options: ["A. 内容安全审核", "B. 数据隐私保护", "C. 版权合规", "D. 可以随意使用任何数据"],
    answer: ["A", "B", "C"],
    explanation: "内容安全、隐私保护、版权合规都是必要的合规要求。"
  },
  {
    id: 212,
    category: "大模型检索增强",
    question: "RAG 评测中，可以从哪些维度评估效果？（多选）",
    options: ["A. 检索质量", "B. 生成质量", "C. 答案准确性", "D. 响应速度"],
    answer: ["A", "B", "C", "D"],
    explanation: "RAG 评测涵盖检索、生成、准确性、响应速度等多个维度。"
  },
  {
    id: 213,
    category: "大模型应用开发",
    question: "使用流式输出时，客户端需要做什么处理？（多选）",
    options: ["A. 实时处理增量响应", "B. 处理不完整的句子", "C. 等待完整响应后再显示", "D. 支持断开重连"],
    answer: ["A", "B", "D"],
    explanation: "流式输出需要实时处理增量响应、处理不完整句子、支持断连重连。"
  },
  {
    id: 214,
    category: "大模型提示词工程",
    question: "设计提示词时，避免使用的做法是？（多选）",
    options: ["A. 模糊不清的任务描述", "B. 矛盾的要求", "C. 过多无关信息", "D. 清晰明确的指令"],
    answer: ["A", "B", "C"],
    explanation: "模糊、矛盾、过多无关信息都是应该避免的提示词设计方式。"
  },
  {
    id: 215,
    category: "大模型微调",
    question: "微调数据集构建的常见方法包括？（多选）",
    options: ["A. 人工标注", "B. 利用大模型生成", "C. 从日志中挖掘", "D. 随机生成"],
    answer: ["A", "B", "C"],
    explanation: "人工标注、大模型生成、日志挖掘都是有效的微调数据构建方法。"
  },
  {
    id: 216,
    category: "多Agent及多模态应用",
    question: "Agent 工具调用的安全考虑包括？（多选）",
    options: ["A. 输入验证", "B. 参数校验", "C. 权限控制", "D. 随意传递用户输入"],
    answer: ["A", "B", "C"],
    explanation: "工具调用需要输入验证、参数校验、权限控制等安全措施。"
  },
  {
    id: 217,
    category: "生产环境应用实践",
    question: "成本优化的常见手段包括？（多选）",
    options: ["A. 模型量化", "B. 请求缓存", "C. 合理选型", "D. 批处理"],
    answer: ["A", "B", "C", "D"],
    explanation: "量化、缓存、合理选型、批处理都是有效的成本优化手段。"
  },
  {
    id: 218,
    category: "大模型检索增强",
    question: "Embedding 模型的选择依据包括？（多选）",
    options: ["A. 语义理解能力", "B. 输入长度限制", "C. 推理速度", "D. 价格成本"],
    answer: ["A", "B", "C", "D"],
    explanation: "选择 Embedding 需综合考虑性能、输入限制、速度、成本等因素。"
  },
  {
    id: 219,
    category: "大模型应用开发",
    question: "在设计 API 接口时，需要考虑哪些因素？（多选）",
    options: ["A. 认证授权", "B. 错误处理", "C. 限流策略", "D. 返回格式"],
    answer: ["A", "B", "C", "D"],
    explanation: "API 设计需考虑认证、错误处理、限流、返回格式等多个方面。"
  },
  {
    id: 220,
    category: "大模型提示词工程",
    question: "Few-shot 示例的选择原则包括？（多选）",
    options: ["A. 与任务相关", "B. 多样性", "C. 正确答案示例", "D. 越多越好"],
    answer: ["A", "B", "C"],
    explanation: "Few-shot 示例应选择与任务相关、多样性、正确答案的样本，非越多越好。"
  }
];

// 单选题：answer 为字符串；多选题：answer 为数组
function isMultipleChoice(q) {
  return Array.isArray(q.answer);
}

// 总题数 75：单选题 50 题（每题 1 分），多选题 25 题（每题 2 分），总分 100，时长 120 分钟
function getExamQuestions() {
  const SINGLE_COUNT = 50;
  const MULTI_COUNT = 25;
  const ratio = {
    "大模型应用开发": 0.17,
    "大模型提示词工程": 0.15,
    "大模型检索增强": 0.20,
    "大模型微调": 0.16,
    "多Agent及多模态应用": 0.16,
    "生产环境应用实践": 0.16
  };
  const singlePool = QUESTION_BANK.filter(q => !isMultipleChoice(q));
  const multiPool = QUESTION_BANK.filter(q => isMultipleChoice(q));

  function sampleByCategory(pool, count) {
    const byCat = {};
    pool.forEach(q => {
      if (!byCat[q.category]) byCat[q.category] = [];
      byCat[q.category].push(q);
    });
    const result = [];
    for (const [cat, pct] of Object.entries(ratio)) {
      const n = Math.max(0, Math.round(count * pct));
      const list = [...(byCat[cat] || [])];
      for (let i = 0; i < n && list.length > 0; i++) {
        const idx = Math.floor(Math.random() * list.length);
        result.push(list.splice(idx, 1)[0]);
      }
    }
    const used = new Set(result);
    while (result.length < count) {
      const left = pool.filter(q => !used.has(q));
      if (left.length === 0) break;
      const idx = Math.floor(Math.random() * left.length);
      const picked = left[idx];
      result.push(picked);
      used.add(picked);
    }
    return result.slice(0, count);
  }

  const singleSelected = sampleByCategory(singlePool, SINGLE_COUNT);
  const multiSelected = sampleByCategory(multiPool, MULTI_COUNT);
  const combined = singleSelected.concat(multiSelected);
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined;
}
