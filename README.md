# Free PTE 机经练习 · PTE 练习项目

PTE 备考练习网站（参考 Free PTE 机经练习页面设计），含首页 / 机经练习 / CLB 等级 / 交流社区四个视图 + WFD / RS 随身听页面。
**WFD 题型已接入真实题库与音频**：题目与每段音频均由本机视频 `wfd_vedio/40283604348-1-160.mp4`（羊驼PTE 机经视频，269 秒，61 道 WFD 题）经“后端处理”切分而来。

## 页面与功能

- **首页**：左侧品牌文案，右侧「WFD 随身听」「RS 随身听」两个入口卡片；下方核心题型速览。无注册 / 登录（右上角仅主题与语言切换）。
- **机经练习**：7 大题型刷题，WFD 播放真实音频、提交后自动判分；右侧题号网格（5 列）可直接跳题并自动播放，状态按颜色区分（绿=正确、橙=部分、红=错误、灰=未做）。
- **随身听（`#/walkman/WFD`、`#/walkman/RS`）**：参照随身听播放器交互——
  - 句子 + 中文译文展示，上一曲 / 播放 / 下一曲，当前 X/N；
  - **连续自动播放**：每句按“重复次数”播完后，间隔 N 秒自动切下一题并继续播放；
  - 重复 1~10 次（默认 2 次）、间隔 1~5 秒（默认 2 秒）、音量 0~100%；
  - 语速步进器：`«` `»` 每次 ±0.1，`‹` `›` 每次 ±0.01；点击中间数值弹出 12 宫格快捷选速（0.25 / 0.50 / 0.75 / 0.90 / 1.00 / 1.10 / 1.25 / 1.50 / 1.75 / 2.00 / 2.50 / 16.00），选中即生效；
  - 键盘 ← / → 切题、空格 播放/暂停；
  - WFD 使用视频切分的 61 题真实音频；RS 暂无真实音频，播放为模拟。
- **CLB 等级 / 交流社区**：对照表与示例社区。

## 文件结构

```
pte_doubao/
├── index.html              # 页面结构（五个视图 + 随身听 + 导航 + 弹窗 + 页脚）
├── css/style.css           # 全部样式（含明暗主题、响应式适配、随身听/题号网格样式）
├── js/
│   ├── wfd-data.js         # WFD 真实题库内嵌数据（由脚本生成，61 题）
│   ├── data.js             # 数据层：文案词典 / 题型元信息 / 题库（WFD 优先取真实数据）
│   └── app.js              # 交互引擎：路由 / 主题语言切换 / 练习模块 / 随身听 / 社区
├── assets/
│   ├── cat.jpg             # 猫咪吉祥物图片
│   └── audio/              # WFD 每题一段音频（wfd_01.mp3 ~ wfd_61.mp3，来自视频切分）
├── wfd_vedio/              # 源视频（40283604348-1-160.mp4）
├── server/
│   ├── server.js           # 本地后端：静态托管 + /api/wfd + 音频 Range 播放
│   └── data/wfd-questions.json  # WFD 题单（答案 / 译文 / 音频文件名 / 裁剪时间戳）
└── scripts/                # “后端处理”管线脚本（可复跑）
    ├── build_questions.py  # 生成题单 JSON（内含 61 题全表）
    ├── build_wfd_data.py   # 由题单生成 js/wfd-data.js
    ├── patch_data_js.py    # 把 WFD_VIDEO 接入 data.js（CRLF 安全）
    ├── patch_app_js.py     # 把真实音频播放接入 app.js
    ├── submit_trims.ps1    # 批量提交 61 个音频裁剪任务
    └── poll_trims.ps1      # 轮询任务并下载音频到 assets/audio/
```

## 运行方式

**方式 A（推荐，有真实音频）：启动本地后端**

```powershell
cd E:\code\pte_doubao
node server/server.js
```

然后浏览器打开 <http://localhost:3000>，进入「机经练习」→ WFD 即可播放每题真实音频；首页点击「WFD 随身听」可进入连播模式。
后端接口：`GET /api/wfd` 返回题单；`GET /api/health` 健康检查；音频支持 HTTP Range。

**方式 B（纯静态）：直接双击 `index.html` 用 file:// 打开**

题目数据已内嵌（`js/wfd-data.js`），音频为相对路径 `assets/audio/`，file:// 下同样可播放。

## 视频 → 题库 → 音频的“后端处理”管线

1. **视频理解**：`mediakit-cli video video-ocr` 对全片做 OCR，按画面中的英文句子 + 中文翻译识别出 **61 道题**及其显示起止时间（屏幕文字即权威答案）。
2. **生成题单**：`scripts/build_questions.py` → `server/data/wfd-questions.json`（每题含 answer / translation / audio 文件名 / 裁剪起止）。
3. **切音频**：`editing extract-audio` 取整轨 → `editing trim-audio` 按题单批量裁剪 61 段 → 下载到 `assets/audio/wfd_01.mp3 ~ wfd_61.mp3`。
4. **前端接入**：`scripts/build_wfd_data.py` 生成 `js/wfd-data.js`；`data.js` 在有真实数据时用 61 题替换示例 77 题；`app.js` 播放真实音频并在提交后显示中文译文。

重新生成音频：先重跑 `build_questions.py`，再依次运行 `submit_trims.ps1`、`poll_trims.ps1`（需先按 byted-mediakit-editing 技能指引配置 mediakit-cli）。

## 常用修改入口

| 想改什么 | 文件 | 位置 |
|---|---|---|
| WFD 题库 / 音频 | `server/data/wfd-questions.json`（重生成见管线） | 每题一条记录 |
| 其他题型题目 | `js/data.js` | `RS_Q`、`SST_Q` 等数组 |
| 题型名称 / 说明 | `js/data.js` | `TYPES` 数组 |
| 随身听行为（连续播放 / 重复 / 间隔 / 音量 / 语速） | `js/app.js` | 随身听控制器（`WM.*`、`wmPlay`、`wmRateAdj` 等） |
| 随身听文案 | `js/data.js` | `I18N` 的 `wm.*`、`home.wm.*` 键 |
| 社区帖子 / 公告 | `js/data.js` | `THREADS` 数组、`comm.*` 文案 |
| 中/英文案 | `js/data.js` | `I18N` 词典 |
| 配色 / 间距 / 主题 | `css/style.css` | `:root` 变量与 `[data-theme="dark"]` |
| 页面结构 / 模块布局 | `index.html` | 对应视图区块（`#view-*`） |

## 说明

- **WFD 题库与音频来自视频切分（61 题）**；其余题型与社区数据仍为示例内容；非 WFD 题型的播放 / 录音为模拟演示。
- **自动判分**：提交后按"单词无序匹配"评分——单词顺序不影响得分，只数命中单词；作答与参考答案中命中的单词标绿，作答中多余的单词标红并加删除线，参考答案中遗漏的单词标红；结果面板显示 `Overall: 命中数/参考答案总词数`（如 Overall: 5/9）。判分同时按比例自动记为 完全正确(≥90%) / 部分正确(≥50%) / 错误，并计入右侧统计。判分为**精确匹配**：不忽略单复数、词形，只忽略大小写。
- 音频边界基于视频画面 OCR 的显示区间（含相邻题间隔），个别题首尾可能带极短静音或邻题尾音。
- CLB 对照表来自培生官方《PTE Core Score Guide》与 IRCC 换算表。
- 练习进度与收藏仅保存在浏览器内存中，刷新即重置。
