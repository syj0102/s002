# Agent Skills Manager

中文名：Agent 技能管理器

这个项目不是单纯的「技能库」，也不是提示词收藏夹。

它真正要做的是：

> 管理本地多个 AI Agent 已经存在的 skills，把分散、重复、版本混乱的技能统一扫描、展示、整理、导入和安装。

## 先说清楚：参考项目已有功能和本项目计划功能不是一回事

本项目参考了 `One-Man-Company/Skills-ContextManager`，但不会把参考项目已经有的功能和我们准备增强的功能混在一起说。

### 参考项目已经明确有的能力

`One-Man-Company/Skills-ContextManager` 更像是：

```text
导入 skills / workflows / contexts
用本地 Web UI 管理
给技能分组
给技能开关
设置 always-loaded 或 dynamic
通过 MCP 让 Agent 按需加载技能
```

也就是说，它的重点是：

> 把技能放进一个管理界面里，再通过 MCP 给 Agent 调用。

### 本项目准备重点增强的能力

本项目要更偏「本机扫描和多 Agent 技能管理」。

重点是：

```text
扫描本机各类 Agent 的 skills 目录
找出重复技能
判断版本分叉
把已有技能导入中央库
从中央库安装到指定 Agent
尽量用软链接避免重复复制
```

也就是说，本项目更像是：

> 先把你电脑里散落在各个 Agent 下面的技能找出来，再统一管理。

## 要解决的问题

现在很多 AI 工具都有自己的技能目录。

比如：

```text
Claude Code 有自己的 skills
Cursor 有自己的 skills
Codex / .agents 有自己的 skills
Windsurf 有自己的 skills
项目目录下面也可能有自己的 skills
```

结果就是：

```text
同一个技能到处复制
每个 Agent 下面都有一份
改完不知道同步到哪里了
旧版本、新版本混在一起
想查本地到底有多少技能，也看不清
```

这个项目要做的不是再造技能，而是做一个本地技能管理器。

## 第一阶段：最小可用版

第一版只做最关键的事。

```text
1. 扫描本地常见 skills 路径
2. 在 Web UI 显示技能列表
3. 标记重复技能
4. 可以把某个技能导入中央库
5. 可以把中央库技能安装到指定 Agent
```

第一阶段不做复杂功能：

```text
不做账号系统
不做云同步
不做技能市场
不做多人协作
不做复杂权限
```

## 核心功能设计

### 1. 扫描本地技能

默认扫描常见路径：

```text
~/.claude/skills/
~/.cursor/skills/
~/.agents/skills/
~/.copilot/skills/
~/.codeium/windsurf/skills/
~/.kiro/skills/
当前项目/.claude/skills/
当前项目/.cursor/skills/
当前项目/.agents/skills/
当前项目/.github/copilot/skills/
当前项目/.windsurf/skills/
当前项目/.kiro/skills/
```

同时允许用户手动添加自定义路径。

### 2. 识别技能文件

识别规则先保持简单。

如果一个目录里存在下面这些文件，就认为它可能是一个 skill：

```text
SKILL.md
Skill.md
skill.md
README.md
manifest.json
skill.json
agent.json
```

### 3. 统一展示

Web UI 里显示：

```text
技能名称
来源 Agent
所在路径
入口文件
最后修改时间
文件大小
内容 hash
是否重复
是否已导入中央库
是否已安装到某个 Agent
```

### 4. 去重和版本判断

发现多个 Agent 下面有同名技能时，提示：

```text
这个技能在几个地方存在
哪些是完全一样的
哪些内容不同
哪个最后修改时间最新
是否导入中央库
是否清理旧副本
```

注意：第一版只做提醒，不自动删除用户文件。

### 5. 中央技能库

扫描到的技能可以导入中央库：

```text
library/skills/
```

导入后结构：

```text
library/skills/<skill-name>/SKILL.md
library/skills/<skill-name>/metadata.json
```

中央库不是为了再写一堆技能，而是为了把本机已有技能统一归档。

### 6. 安装到指定 Agent

从中央库选择一个技能，安装到：

```text
Claude Code
Cursor
Codex / .agents
Windsurf
GitHub Copilot
Kiro
指定项目目录
```

优先使用软链接 symlink。

如果 Windows 权限不允许软链接，再退回复制。

### 7. Web UI

本地页面：

```text
http://localhost:3000
```

第一版页面包括：

```text
扫描路径设置
开始扫描按钮
技能列表
重复技能提醒
技能详情
导入中央库
安装到 Agent
```

### 8. MCP 接入

MCP 是第二阶段。

后续可以给 Agent 暴露这些能力：

```text
scan_local_skills()
list_skills()
load_skill(name)
install_skill(name, target_agent)
```

这样 Agent 自己也能知道本地有哪些技能，而不是每次都靠人手动找。

## 不做什么

这个项目不是：

```text
不是公众号写作技能合集
不是个人提示词收藏夹
不是单纯复制 One-Man-Company/Skills-ContextManager
不是把每个 Agent 再塞满一堆重复技能
```

它是：

```text
本地 Agent 技能扫描器
本地 Agent 技能管理器
多 Agent 技能安装器
重复技能清理工具
```

## 项目结构规划

```text
docs/
  scan-design.md              本地扫描规则
  reference-comparison.md      参考项目和本项目差异

src/
  scanner/                    扫描本地 skills
  library/                    中央技能库
  installers/                 安装到各 Agent
  dedupe/                     重复检测

web/
  本地 Web UI

library/
  skills/                     中央技能库目录
```

## 参考项目

```text
One-Man-Company/Skills-ContextManager
ai-agent-manager/agent-manager
```

一句话定位：

> 参考项目偏「技能导入、开关、MCP 动态加载」，本项目偏「扫描本机已有 Agent 技能、去重、归档、安装」。

## 当前状态

需求定义阶段。

下一步先做扫描模块，不急着堆技能内容。