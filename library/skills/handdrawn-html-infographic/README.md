# handdrawn-html-infographic

把长文章、方法论和流程说明整理成手绘风 HTML 信息图的通用 Agent Skill。

它解决的核心问题是：AI 生成图片时，中文容易乱码。这个 Skill 改用真实 HTML 文本、CSS 和内联 SVG 来完成视觉表达，因此文字可复制、可修改，也更适合手机浏览和截图成长图。

## 文件说明

- `SKILL.md`：技能规则和执行流程
- `template.html`：可直接修改的单文件模板
- `metadata.json`：技能元数据

## 使用方法

把整个文件夹下载到 Agent 的 skills 目录，或者直接把 `SKILL.md` 交给支持自定义规则的 Agent。

调用示例：

```text
@handdrawn-html-infographic
把下面文章做成一份手机可看的手绘风 HTML 信息图，保留关键流程和警告，不要把中文生成进图片。
```

## 兼容方式

- Claude Code：放入 `.claude/skills/`
- Codex / OpenAI Agent：放入 `.agents/skills/`
- Cursor：可放入项目规则目录，或让 Agent 读取 `SKILL.md`
- Windsurf、Cline、Roo Code、Gemini CLI：把 `SKILL.md` 作为项目规则或系统提示使用
- 普通网页版 AI：上传 `SKILL.md` 和 `template.html` 后要求按规则执行

不同 Agent 的自动发现规则不同，但技能正文是通用 Markdown，不依赖某一家模型。

## 输出特点

- 单文件 HTML
- UTF-8 中文真实文本
- 手机浏览器可直接打开
- 可复制、可搜索、可继续编辑
- 可截图成长图
- 不依赖外部图片和 JavaScript

## 下载

在 GitHub 页面点击 `Code` → `Download ZIP`，或者只下载本目录中的三个文件。

## 许可

可自由学习、修改和用于个人或商业项目。保留来源说明即可。
