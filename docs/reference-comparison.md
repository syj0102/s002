# 参考项目对比

这个文档用来避免把「参考项目已有功能」和「本项目计划增强功能」混在一起。

## 参考项目：One-Man-Company/Skills-ContextManager

它更像一个：

```text
Skills / Workflows / Contexts 的 Web UI 管理器 + MCP Server
```

明确方向：

```text
把技能导入系统
在 Web UI 里管理
给技能分组
给技能开关
设置 always-loaded 或 dynamic
通过 MCP 让 Agent 加载技能
```

重点是：

> 技能进来以后，怎么管理、分组、开关、给 Agent 调用。

## 本项目：Agent Skills Manager

本项目更像一个：

```text
本地 Agent 技能扫描器 + 多 Agent 技能安装器
```

明确方向：

```text
扫描本机不同 Agent 的 skills 目录
找出重复技能
判断版本分叉
导入中央库
从中央库安装到指定 Agent
尽量用 symlink 避免重复复制
```

重点是：

> 技能已经散落在电脑里了，怎么找出来、看清楚、归档、同步。

## 差异表

| 能力 | Skills-ContextManager | 本项目 |
|---|---|---|
| Web UI 管理技能 | 已有 | 计划做 |
| Skills / Workflows / Contexts | 已有 | 可参考 |
| 多 Hub 工作区 | 已有 | 可参考 |
| 技能开关 | 已有 | 第二阶段 |
| Always-loaded / Dynamic | 已有 | 第二阶段 |
| MCP 动态加载 | 已有 | 第二阶段 |
| 从本地文件夹导入 | 已有 | 第一阶段 |
| 从 GitHub 导入 | 已有 | 后续考虑 |
| 从 Skills.sh 导入 | 已有 | 后续考虑 |
| 自动扫描 Claude / Cursor / .agents 等目录 | 未确认 | 第一阶段重点 |
| 重复技能检测 | 未确认 | 第一阶段重点 |
| 版本分叉比较 | 未确认 | 第一阶段重点 |
| 一键安装到不同 Agent | 未确认 | 第一阶段重点 |
| symlink 避免复制 | 未确认 | 第一阶段重点 |

## 本项目一句话

不要把本项目写成「又一个技能库」。

它应该写成：

> 一个能扫描本机 Agent 技能、发现重复、导入中央库，并安装到不同 Agent 的本地技能管理器。
