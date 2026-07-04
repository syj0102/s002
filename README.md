# Agent Skills Manager

中文名：Agent 技能管理器

这个项目的核心不是「我自己写一堆技能」。

它真正要做的是：

> 安装以后，扫描本地已经存在的各类 Agent 技能目录，把分散的 skills 统一显示、统一管理、统一安装、统一同步。

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

## 核心功能

### 1. 扫描本地技能

自动扫描常见路径：

```text
~/.claude/skills/
~/.cursor/skills/
~/.agents/skills/
~/.copilot/skills/
~/.codeium/windsurf/skills/
当前项目/.claude/skills/
当前项目/.cursor/skills/
当前项目/.agents/skills/
```

识别里面的：

```text
SKILL.md
Skill.md
README.md
.agent.md
其他 markdown 技能文件
```

### 2. 统一展示

Web UI 里显示：

```text
技能名称
技能来源
所属 Agent
所在路径
最后修改时间
是否重复
是否可安装
是否已启用
```

### 3. 去重和版本判断

发现多个 Agent 下面有同名技能时，提示：

```text
这个技能在 4 个地方存在
哪个是最新的
哪些内容不同
是否合并
是否只保留中央版本
```

### 4. 安装到指定 Agent

从中央技能库选择一个技能，一键安装到：

```text
Claude Code
Cursor
Codex / .agents
Windsurf
GitHub Copilot
指定项目目录
```

优先使用软链接 symlink。

如果 Windows 权限不允许软链接，再退回复制。

### 5. 中央技能库

扫描到的技能可以导入中央库：

```text
library/skills/
```

后续所有 Agent 尽量从中央库安装，避免重复复制。

### 6. Web UI

需要一个本地 Web 页面：

```text
http://localhost:3000
```

页面至少有：

```text
技能列表
扫描按钮
重复技能提醒
安装到 Agent
从 Agent 导入
查看技能内容
编辑技能内容
```

### 7. MCP 接入

后续通过 MCP 给 Agent 提供能力：

```text
list_skills()
load_skill(name)
install_skill(name, target_agent)
scan_local_skills()
```

这样 Agent 自己也能知道本地有哪些技能。

## 不是做什么

这个项目不是：

```text
不是单纯的技能库
不是公众号写作技能合集
不是提示词收藏夹
不是给每个 Agent 再复制一份技能
```

它是：

```text
本地 Agent 技能扫描器
本地 Agent 技能管理器
多 Agent 技能安装器
重复技能清理工具
```

## 第一阶段目标

先做最小可用版：

```text
1. 扫描本地常见 skills 路径
2. 在 Web UI 显示技能列表
3. 标记重复技能
4. 可以把某个技能导入中央库
5. 可以把中央库技能安装到指定 Agent
```

## 参考项目

方向参考：

```text
One-Man-Company/Skills-ContextManager
ai-agent-manager/agent-manager
```

但本项目重点更明确：

> 先扫描和管理本机已有 Agent 技能，再谈技能创作和 MCP 动态加载。

## 项目状态

当前是需求定义阶段。

下一步要做：

```text
docs/scan-design.md       扫描规则
src/scanner/              本地扫描模块
src/library/              中央技能库模块
src/installers/           安装到各 Agent 的模块
web/                      本地 Web UI
```
