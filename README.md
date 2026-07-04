# AI Skills Hub

中文名：AI 技能中控台

这个仓库是给多个 AI Agent 共用技能用的。

它的目标不是再造一个聊天机器人，而是解决一个很烦的问题：

> 写作 Agent、选题 Agent、图片 Agent、检查 Agent 都要用同一套技能，但每个 Agent 文件夹下面都复制一份，最后越改越乱。

所以这个项目的核心思路是：

> 技能只放一份，Agent 按需读取。

## 这个项目要解决什么

以前的做法：

```text
agent-writing/skills/公众号写作.md
agent-topic/skills/公众号写作.md
agent-image/skills/公众号写作.md
agent-check/skills/公众号写作.md
```

问题是：

```text
改一次，要改很多处
哪个版本最新，不知道
技能越来越多，目录越来越乱
Agent 多了以后，不是在变强，而是在变脏
```

现在的做法：

```text
AI-Skills-Hub/
  skills/
    common-writing/
    topic-selection/
    cover-prompt/
    reclaim-control-analyst/
  contexts/
    reverse-life-hub.md
  workflows/
    article-production.md
```

Agent 不再自己保存一堆重复技能，而是从这个中央仓库读取。

## 当前定位

这个仓库会先做成「反向生活家」自己的 AI 技能库。

第一阶段不急着做完整 Web UI，先把技能整理成统一结构。

第二阶段再考虑接入类似 `One-Man-Company/Skills-ContextManager` 的 Web UI 和 MCP 方式，让技能可以开关、分组、按需加载。

## 初始技能

| 技能 | 用途 |
|---|---|
| `common-writing` | 公众号文章基础写作规范 |
| `topic-selection` | 选题判断，判断一个话题值不值得写 |
| `cover-prompt` | 公众号封面图提示词生成 |
| `reclaim-control-analyst` | 「重获控制权」项目案例分析 |

## 推荐用法

在任何 Agent 的系统提示词里，不要复制完整技能，只写：

```text
执行任务前，优先读取本仓库对应的 SKILL.md。
不要复制技能内容到当前 Agent。
技能更新以本仓库为准。
```

比如写公众号文章时：

```text
读取 skills/common-writing/SKILL.md，再根据用户素材写文章。
```

做选题判断时：

```text
读取 skills/topic-selection/SKILL.md，先判断这个选题能不能回答一个好问题。
```

## 后续计划

- [ ] 补齐写作技能
- [ ] 补齐选题技能
- [ ] 补齐封面图技能
- [ ] 补齐新闻核查技能
- [ ] 补齐「重获控制权」案例分析技能
- [ ] 接入 MCP
- [ ] 接入 Web UI
- [ ] 支持技能开关和分组
- [ ] 支持多个 Agent 共用同一套技能

## 来源说明

本项目的方向参考了 `One-Man-Company/Skills-ContextManager` 的思路：用 Web UI 和 MCP 统一管理 AI skills、workflows、contexts。

当前仓库不是原项目的完整复制版，而是面向「反向生活家」内容创作和个人项目的中文化改造起步版。

如果后续直接引入原项目代码，需要保留原项目 MIT License 和版权说明。
