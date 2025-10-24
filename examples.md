# KAT-Coder 使用文档

## REST API 调用示例

### 基本API调用

使用 curl 命令调用 Vanchin 平台 API：

```bash
curl 'https://vanchin.streamlake.ai/api/gateway/v1/endpoints/chat/completions' \
-H "Authorization: Bearer $VC_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
    "model": "ep-59dwym-1761224975357840539", 
    "messages": [ 
        {
            "role": "system",
            "content": "You are an AI assistant."
        },
        {
            "role": "user",
            "content": "Please introduce the eight planets of the solar system"
        }
    ]
}'
```

### 参数说明

- `model`: 推理端点 ID（从 Vanchin 平台获取）
- `messages`: 对话消息数组，包含 system 和 user 角色
- `$VC_API_KEY`: 您的 Vanchin API Key

### 环境变量配置

```bash
export VC_API_KEY="your-api-key-here"
```

## OpenAI SDK 使用示例

### Python SDK 安装

```bash
pip install openai
```

### 基本使用示例

```python
import os
from openai import OpenAI

# 初始化 OpenAI 客户端
client = OpenAI(
    base_url="https://vanchin.streamlake.ai/api/gateway/v1/endpoints",
    api_key=os.environ.get("VC_API_KEY")
)

# 单轮对话
completion = client.chat.completions.create(
    model="ep-59dwym-1761224975357840539",
    messages=[
        {"role": "system", "content": "You are an AI assistant"},
        {"role": "user", "content": "Please introduce the eight planets of the solar system"},
    ],
)
print(completion.choices[0].message.content)
```

### 多轮对话示例

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://vanchin.streamlake.ai/api/gateway/v1/endpoints",
    api_key=os.environ.get("VC_API_KEY")
)

# 多轮对话
messages = [
    {"role": "system", "content": "You are a helpful coding assistant."}
]

# 第一轮对话
user_input = "帮我写一个Python函数来计算斐波那契数列"
messages.append({"role": "user", "content": user_input})

response = client.chat.completions.create(
    model="ep-59dwym-1761224975357840539",
    messages=messages
)

assistant_reply = response.choices[0].message.content
print(assistant_reply)

# 添加助手回复到对话历史
messages.append({"role": "assistant", "content": assistant_reply})

# 第二轮对话
user_input = "这个函数的时间复杂度是多少？"
messages.append({"role": "user", "content": user_input})

response = client.chat.completions.create(
    model="ep-59dwym-1761224975357840539",
    messages=messages
)

print(response.choices[0].message.content)
```

### 流式输出示例

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://vanchin.streamlake.ai/api/gateway/v1/endpoints",
    api_key=os.environ.get("VC_API_KEY")
)

# 流式输出
stream = client.chat.completions.create(
    model="ep-59dwym-1761224975357840539",
    messages=[
        {"role": "user", "content": "写一个快速排序算法的实现"}
    ],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")
```

## 开发工具集成

### Claude Code 集成

#### 安装 Claude Code

```bash
# macOS
npm install -g @anthropic-ai/claude-code

# Windows (需要先安装 WSL 或 Git for Windows)
# 请参考官方文档
```

#### 环境变量配置

```bash
# 设置代理端点
export ANTHROPIC_BASE_URL="https://vanchin.streamlake.ai/api/gateway/v1/endpoints/ep-59dwym-1761224975357840539/claude-code-proxy"

# 设置API Key
export ANTHROPIC_AUTH_TOKEN="$VC_API_KEY"

# Windows 环境变量设置
setx ANTHROPIC_AUTH_TOKEN "$VC_API_KEY"
```

#### 运行 Claude Code

```bash
claude
```

### Cline 集成

#### 安装步骤

1. 打开 VS Code 扩展市场
2. 搜索 "Cline" 并安装
3. 选择 "Use your own API Key" 选项
4. 配置以下信息：
   - API URL: `https://vanchin.streamlake.ai/api/gateway/v1/endpoints`
   - API Key: 您的 Vanchin API Key
   - Model ID: `ep-59dwym-1761224975357840539`

### Kilo Code 集成

#### 安装步骤

1. 在 IDE 中打开扩展市场
2. 搜索 "Kilo Code" 并安装
3. 选择 "Use your own API Key" 选项
4. 填写配置信息：
   - API 端点: `https://vanchin.streamlake.ai/api/gateway/v1/endpoints`
   - API Key: 您的 Vanchin API Key
   - 模型: `ep-59dwym-1761224975357840539`

### Roo Code 集成

#### 安装步骤

1. 在 IDE 中安装 Roo Code 插件
2. 配置 API 设置：
   - API URL: `https://vanchin.streamlake.ai/api/gateway/v1/endpoints`
   - API Key: 您的 Vanchin API Key
   - Model: `ep-59dwym-1761224975357840539`
3. 根据需要配置权限设置

## 常见问题

### Q: 如何获取 Vanchin API Key？

A: 登录 Vanchin 平台 > 左侧菜单 [API Key] > 点击"Create API Key"。请安全保管生成的 API Key。

### Q: 支持哪些开发工具？

A: 目前支持 Claude Code、Cline、Kilo Code 和 Roo Code 等主流开发工具。

### Q: 如何创建推理端点？

A: 登录 Vanchin 平台 > 左侧菜单 [模型] → [推理] > 点击"创建推理端点"，选择 KAT-Coder 模型并配置参数。

### Q: API Key 安全如何保障？

A: 请妥善保管您的 API Key，不要在代码中硬编码或在公共场合暴露。建议使用环境变量进行配置。

## 技术支持

如需更多技术支持，请参考：
- [集成指南](integration-guide.html)
- [文档](documentation.html)
- [StreamLake 官方文档](https://www.streamlake.ai)