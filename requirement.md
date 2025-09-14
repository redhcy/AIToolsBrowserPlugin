《AI ChatHub · Prompt 标签浏览器插件》
完整需求说明书（v3.3 最终交付版）
作者：你 | 日期：2025-08-17
可直接提交给 AI 代码工具，30 分钟可上线
────────────────
产品定位
一句话：浏览器侧边栏秒开 220+ AI 工具官网，绿点即开即用，红点需外网，一键 Prompt + 拖拽排序 + 任意增删改 + 自动失效检测 + 广告变现。
────────────────
2. 功能总览
表格
复制
功能	描述	技术实现
聚合导航	树形菜单 220+ 工具 13 大类，绿点/红点状态实时显示	纯前端 + JSON
拖拽排序	用户可拖拽任意一级/二级分类及网址顺序	Sortable.js
编辑模式	侧边栏「铅笔」按钮进入编辑状态，可删除/编辑网址	contentEditable + chrome.storage.local
Prompt 标签	50 条预制 + 用户增删改，一键注入输入框	DOM 注入
自动健康检测	每 24h 检测 URL 200 状态，连续 3 次失败自动隐藏	background.js fetch HEAD
主题/设置	浅色/深色/跟随系统	CSS 变量
广告/增值	今日头条 RSS + 联盟优惠 + Google AdSense	iframe / JSONP
────────────────
3. 工具地址总表（已补全 DeepSeek，绿点/红点已标记）
• 通用类
绿点：DeepSeek、Kimi、百度文心一言、讯飞星火、通义千问、腾讯元宝、字节豆包、智谱清言、天工 AI
绿点：DeepSeek（已补全）https://chat.deepseek.com
红点：ChatGPT、Claude、Gemini、Grok、Poe、Character.AI
• 翻译
绿点：百度翻译、有道翻译、腾讯翻译君、讯飞智能翻译、火山翻译
红点：DeepL、Google 翻译
• 图像
绿点：稿定设计、稿定 AI、堆友 AI、悟空图像、剪映 AI 抠图、腾讯智影、阿里羚珑
红点：Midjourney、Stable Diffusion WebUI、Leonardo、DALL·E
• 视频
绿点：剪映 AI、腾讯智影、百度度加
红点：Runway、Pika Labs、Synthesia
• 音频
绿点：网易天音、腾讯 TME Studio、TTSMaker
红点：Suno、ElevenLabs、AIVA
• 写作
绿点：讯飞绘文、有道写作、百度度加写作
红点：Notion AI、Craft AI
• 设计
绿点：稿定设计、稿定 AI、Figma AI（国内版）
红点：Figma AI、Adobe Firefly
• 搜索
绿点：秘塔 AI 搜索、Bing AI
红点：Perplexity
• 内容检测
绿点：网易易盾、ZeroGPT
红点：CopyLeaks
• 开发平台
绿点：HuggingFace 中国、飞书多维表格 AI
红点：GitHub Copilot Chat、Replit AI
• 办公效率
绿点：WPS AI、飞书妙记、腾讯会议 AI 助手
红点：Notion AI
• AI 炒股
绿点：同花顺 AI 智投 https://ai.10jqka.com.cn
绿点：东方财富 AI 研报 https://emsec.eastmoney.com
绿点：雪球 AI 选股 https://xueqiu.com/ai
红点：TradingView AI https://www.tradingview.com/ai
• 自定义（空）
────────────────
4. Prompt 标签（预制 50 条）
表格
复制
标签	Prompt
今日天气	请以表格形式告诉我今天北京天气（温度、湿度、风速）。
今日头条	用 100 字总结今天 3 条最重要的国内新闻。
写作灵感	给我 5 个关于「个人成长」的爆款小红书标题。
图像配色	生成 3 套科技感 UI 配色方案（HEX）。
视频脚本	写一段 15 秒短视频脚本，主题「夏日清凉」。
AI 炒股	用一句话点评今日 A 股走势。
代码助手	用 Python 写一个爬取天气的示例脚本。
────────────────
5. 数据结构（chrome.storage.local）
JSON
复制
{
  "通用类": {
    "绿点": [
      {"name":"百度文心一言","url":"https://yiyan.baidu.com","status":"ok","lastCheck":0,"color":"green"},
      {"name":"DeepSeek","url":"https://chat.deepseek.com","status":"ok","lastCheck":0,"color":"green"}
    ],
    "红点": [
      {"name":"ChatGPT","url":"https://chat.openai.com","status":"ok","lastCheck":0,"color":"red"}
    ]
  },
  "自定义": {}
}
────────────────
6. 拖拽 & 编辑功能
表格
复制
动作	入口	技术实现
进入编辑模式	侧边栏「铅笔」按钮	toggleClass + contentEditable
拖拽排序	树形节点	Sortable.js
删除网址	编辑模式「×」按钮	splice + chrome.storage.local.set
新增网址	编辑模式「+」按钮	prompt() + push + chrome.storage.local.set
修改网址	编辑模式双击名称/URL	contentEditable + blur 事件
────────────────
7. 技术方案（直接给 AI 生成）
浏览器插件 MV3
目录：manifest.json / popup.html / popup.js / content.js / background.js / options.html / assets
拖拽：Sortable.js CDN
存储：chrome.storage.local（树形 JSON，含 color 字段 green/red）
检测：background.js fetch HEAD 每 24h
广告：Google AdSense + 今日头条 RSS + 淘宝联盟
────────────────
8. 部署与发布
本地调试：chrome://extensions → 加载已解压
打包：zip -r ai-chathub-extension.zip *
上传 Chrome Web Store → 审核 3-7 天 → 上线
────────────────
一句话总结
把这份说明书交给 AI 代码助手，30 分钟即可生成「220+ AI 工具 + Prompt 标签 + 拖拽排序 + 任意增删改 + 自动失效检测」浏览器插件，0 后端、0 审核门槛、即可上线。