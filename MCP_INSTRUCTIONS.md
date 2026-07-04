# MCP 使用说明草稿

这个文件是给未来接入 MCP 的 Agent 用的。

目标很简单：

> Agent 不要把所有技能都塞进自己的提示词里，而是需要哪个技能，就从中央技能库加载哪个技能。

## Agent 工作规则

1. 先判断当前任务属于哪类任务。
2. 再从 `skills/` 目录选择对应技能。
3. 如果是常用基础技能，可以默认加载。
4. 如果是特殊任务技能，只在需要时加载。
5. 任务完成后，不要把技能复制到 Agent 自己的目录。

## 推荐加载方式

### 写公众号文章

读取：

```text
skills/common-writing/SKILL.md
contexts/reverse-life-hub.md
```

### 判断选题

读取：

```text
skills/topic-selection/SKILL.md
contexts/reverse-life-hub.md
```

### 生成封面图提示词

读取：

```text
skills/cover-prompt/SKILL.md
contexts/reverse-life-hub.md
```

### 分析失控行为案例

读取：

```text
skills/reclaim-control-analyst/SKILL.md
contexts/reverse-life-hub.md
```

## 后续 MCP 工具设想

未来可以做 3 个工具：

```text
list_available_skills()
load_skill(name)
load_context(name)
```

这样 Agent 不需要提前背完整技能，只需要按任务调用。
