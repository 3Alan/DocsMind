query 返回的结果

```json
{
  "extra_info": null,
  "response": "\n根据上下文信息，可以总结出，文中提到了Fusce ultrices faucibus lectus，sed tincidunt massa sollicitud in vitae，Donec mollis metus neque，at vehicula lorem scelerisque at，Aenean sit amet nunc sed mauris tincidunt luctus at sed massa，Aliquam velit ligula，dapibus sed dui quis，vestibulum luctus orci，Phasellus vitae arcu eu magna eleifend hendrerit sed eget quam，Nulla facilisi，Duis eu posuere lorem，Sed malesuada ut ipsum vitae fermentum，Aliquam eget blandit augue，in iaculis sem，Quisque ac nulla ligula，Curabitur lacinia",
  "source_nodes": [
    {
      "doc_id": "e3d4df7c-0742-4c07-81b9-4c4fa7b4c309",
      "extra_info": null,
      "image": null,
      "node_info": {
        "end": 10424,
        "start": 9409
      },
      "similarity": 0.7389058416469247,
      "source_text": "eu. Fusce \nultrices faucibus lectus, sed tincidunt massa sollicitud in vitae. Donec mollis metus neque, at vehicula \nlorem scelerisque at. Aenean sit amet nunc sed mauris tincidunt luctus at sed massa. Aliquam velit \nligula, dapibus sed dui quis, vestibulum luctus orci.  \n \n \n \nPhasellus vitae arcu eu magna eleifend hendrerit sed eget quam. Nulla facilisi. Duis eu posuere \nlorem. Sed malesuada ut ipsum vitae fermentum. Aliquam eget blandit augue, in iaculis sem. \nQuisque ac nulla ligula. Curabitur lacinia leo erat, vitae ultrices metus ultrices congue. Pellentesque \nsemper fringil la libero. Ut faucibus purus vel arcu cursus, quis consequat massa ultrices. Praesent \nrutrum vehicula nunc sit amet consectetur.  Donec ut felis augue. Praesent vel ante massa. Nulla \nrutrum arcu vitae dolor aliquet pretium. Curabitur sed libero accumsan tur pis vestibulum porttitor et \ncondimentum sapien.  \n 0.00 zł2.00 zł4.00 zł6.00 zł8.00 zł10.00 zł12.00 zł14.00 zł16.00 zł\nItem 1 Item 2 Item 3 Item 4 Item 5Average sales"
    }
  ]
}
```

## Feature

- [ ] 预测 token 耗费 MockLLMPredictor
- [x] 可以使用其他 Embeddings 如 LangchainEmbedding（基于 cohere 也不免费）,看 Embeddings 章节
- [ ] 添加一个插件系统，可以让使用者自己进行写 chunk 逻辑
- [ ] stream 流返回
- [ ] Mac 滚动无效
- [x] 点击对话滚动到高亮区域
- [ ] 请求错误全局处理
- [ ] 打包成应用
  - [ ] `"build-api": "pyinstaller --onefile app.py --collect-all llama_index --collect-all langchain  --distpath src-tauri/bin/api"`
- [ ] Demo 部署
- [ ] 浏览器插件
- [ ] 分 chunk 逻辑加单元测试
- [ ] 回复支持 md
- [ ] 支持下载 md
- [ ] pdf,word 转 md
- [ ] 划词解释
- [ ] embedding 耗费 token 数
- [ ] i18n

## 需要攻克的问题

- https://github.com/jerryjliu/llama_index/blob/main/examples/paul_graham_essay/InsertDemo.ipynb

## 宣传语

- 开箱即用
- 高亮
- 交互友好
- 例子耗费 13618token 约 $0.0054472
- 开源协议选择
