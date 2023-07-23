# 2023 夏《Web 前端技术实训课程》大作业
2023/07/22

## 附：Git Commit Message 规范

Conventional Commits 是由众多开源项目贡献者共同约定的一个规范，用来约定 Git Commit 内容的书写方式，让 commit 内容更有价值、条理，使提交历史明确可追溯。一条规范的 commit 的通常结构如下：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Message 结构化

#### type

commit 的类型如下，其中删除线标注部分为本次项目正常情况下不会涉及的条目：

- feat：实现了新功能或新特性
- build：用于影响项目构建的修改或依赖项修改
- fix：修复 bug
- perf：更改了代码，以提高程序性能
- refa：代码重构
- docs：文档修改
- style：代码风格和格式修改
- test：用于测试用例的新增与修改
- chore：其他修改（不在上述类型中的修改）
- revert：恢复上一次提交
- ~~ci：持续集成相关文件修改~~
- ~~workflow：工作流相关文件修改~~
- ~~release: 发布新版本~~

#### scope（可选）

commit 影响的范围，例如：route，component，utils，build……

#### subject

一个简短的概述，用于描述这次 commit 的修改内容。

#### body（可选）

commit 的具体修改内容，可以分为多行。

#### footer（可选）

本次修改的脚注，通常是 BREAKING CHANGE 或者所修复 bug 的 issue 标号。针对重大修改使用「`BREAKING CHANGE: `」来标记。

### Commit Message 示例

Conventional Commits 不仅约定了一个很好的规范，还提供了可扩展性。下面是一些对比示例：

```diff
- fix a bug
+ fix(scripts): 修复了 JavaScript 脚本中绘图部分折线图代表色不是 #39C5BB 的问题 (#39)
```

注：

1. 注意全角和半角标点符号的使用问题。结构化 commit 中连接 `<type>(<scope>)` 部分与 `<subject>` 部分的冒号应为半角符号，`<footer>` 部分涉及 issue 标号的部分应使用半角括号包裹起来（上述 commit message 表示修复了 issue#39 所反映的问题）。
2. 非汉字字符与汉字字符（除汉字标点符号）间应保留空格。
3. `<subject>` 和 `<body>` 部分的语种没有限制。

## 附：Merge/Pull Request 规范

Merge Request（或者 Pull Request）将开发者开发的代码内容以一种请求合并的方式来合并到它的目标分支上，这个请求的接收人（Reviewer）一般是项目、团队的负责人或者其他合作成员。

在 Github 上，一次完整的「开发-请求合并-合并成功」流程如下所示：

1. 创建新分支，并在这个分支上进行代码的修改。分支的名称应当能够大体反映本次开发流程的主题：<img src="file:///C:\Users\leyancui\AppData\Roaming\Tencent\Users\1273425757\QQ\WinTemp\RichOle\V1RUQ9BE6CM$JPPS%ZGSLKB.png" alt="img"  />

2. 拉取远程仓库，并在本地跟踪新建分支，在该分支上完成一切后续开发工作。

   ```shell
   $ git clone ...
   $ git checkout --track origin/your-branch-name
   ```

3. 在 Github 上提交 Pull request
