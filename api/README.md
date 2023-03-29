## Feature

- [ ] 预测 token 耗费 MockLLMPredictor
- [x] 可以使用其他 Embeddings 如 LangchainEmbedding（基于 cohere 也不免费）,看 Embeddings 章节
- [ ] 添加一个插件系统，可以让使用者自己进行写 chunk 逻辑
- [ ] stream 流返回
- [ ] Mac 滚动无效
- [x] 点击对话滚动到高亮区域
- [ ] 打包成应用
  - [ ] `"build-server": "pyinstaller --onefile app.py --collect-all llama_index --collect-all langchain  --distpath src-tauri/binaries/api"`
- [ ] Demo 部署
- [ ] 浏览器插件
- [ ] 分 chunk 逻辑加单元测试
- [ ] 回复支持 md
- [ ] 支持从网上下载 md
- [ ] pdf,word 转 md
- [ ] 划词解释
- [ ] i18n

## 需要攻克的问题

- https://github.com/jerryjliu/llama_index/blob/main/examples/paul_graham_essay/InsertDemo.ipynb
- 安装应用时初始化 userData 目录

## 宣传语

- 开箱即用
- 高亮
- 交互友好
- 例子耗费 13618token 约 $0.0054472
- 开源协议选择
- 每次提问耗费的 token 数

```
pyinstaller --onefile app.py --collect-all llama_index --collect-all langchain --hidden-import=tiktoken_ext.openai_public
```

The New Project
I want this project has a great UX. But PDF files can be difficult to handle, such as highlighting pdf content, so I may develop a new project.

Here are my interesting ideas for the new project:

Support Markdown files or converting PDF files to Markdown format (which may result in some loss of information and style).
A cross-platform application that supports macOS and Windows.
Out of box, no need to install any environment.
Highlighting relevant Markdown content in response.
If you are also interested in the new project, let me know in discussion.
