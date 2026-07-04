# 本地技能扫描设计

## 目标

扫描本机和当前项目里已经存在的 Agent skills。

重点不是生成技能，而是把已经散落在不同 Agent 目录下的技能找出来。

## 默认扫描路径

### 用户级目录

```text
~/.claude/skills/
~/.cursor/skills/
~/.agents/skills/
~/.copilot/skills/
~/.codeium/windsurf/skills/
~/.kiro/skills/
```

### 项目级目录

```text
./.claude/skills/
./.cursor/skills/
./.agents/skills/
./.github/copilot/skills/
./.windsurf/skills/
./.kiro/skills/
```

### 自定义目录

允许用户在 UI 里添加自定义扫描目录。

比如：

```text
C:\Users\Administrator\.qclaw\workspace\
D:\AI\skills\
```

## 技能识别规则

一个目录被判断为 skill，需要满足下面任一条件：

```text
包含 SKILL.md
包含 Skill.md
包含 skill.md
包含 README.md 且父目录名在 skills 下
包含 manifest.json / skill.json / agent.json
```

## 技能元数据

扫描后提取：

```text
name              技能名
source_agent      来源 Agent
source_path       原路径
entry_file        入口文件
summary           简短说明
last_modified     最后修改时间
size              文件大小
hash              内容 hash
duplicate_group   重复分组
install_status    安装状态
```

## 重复判断

### 同名重复

目录名相同，先判定为可能重复。

### 内容重复

入口文件 hash 相同，判定为完全重复。

### 相似重复

名称相同但 hash 不同，判定为版本分叉。

UI 需要提示：

```text
同名技能存在多个版本
可以比较差异
可以选择一个导入中央库
```

## 中央库目录

默认中央库：

```text
./library/skills/
```

导入后结构：

```text
library/skills/<skill-name>/SKILL.md
library/skills/<skill-name>/metadata.json
```

## 安装规则

优先软链接：

```text
中央库 skill -> 目标 Agent skills 目录
```

如果软链接失败，再复制目录。

Windows 下要检测：

```text
是否开启开发者模式
是否有管理员权限
是否允许创建 symlink
```

## UI 页面

第一版只做 5 个页面区域：

```text
扫描路径设置
技能列表
重复技能提醒
技能详情
安装目标选择
```

## 第一版不做

```text
不做账号系统
不做云同步
不做多人协作
不做复杂权限
不做技能市场
```
