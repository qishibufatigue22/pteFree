/* Free PTE 原型 - 数据层：文案词典 / 题型元信息 / 题库 / 社区示例数据 */
"use strict";

"use strict";
/* ================= 文案词典（中/英） ================= */
const I18N = {
  brand:["Free PTE","Free PTE"],"nav.home":["首页","Home"],"nav.clb":["CLB 等级","CLB Levels"],"nav.practice":["机经练习","Practice"],"nav.community":["交流社区","Community"],
  "theme.light":["亮色","Light"],"theme.dark":["暗色","Dark"],"lang.zh":["中文","中"],"lang.en":["EN","EN"],
  "home.eyebrow":["PTE 备考一站式工作台","All-in-one PTE prep workspace"],
  "home.h1a":["机经在手，","Master the question bank,"],"home.h1b":["PTE 提分不愁","score higher on PTE"],
  "home.sub":["覆盖 WFD、RS、SST 等 7 大核心题型，真题高频机经 + 逐题对照答案 + 收藏错题本，随时随地高效刷题。","7 core question types (WFD, RS, SST…), high-frequency real questions, answer check and a favorite book — practice anywhere, efficiently."],
  "home.cta1":["开始练习","Start practice"],"home.cta2":["了解 CLB 等级","Learn about CLB"],
  "home.s1":["题库题目","Questions"],"home.s2":["核心题型","Question types"],"home.s3":["练习人次","Practice sessions"],
  "home.demo.tag":["WFD 听写句子","WFD Dictation"],"home.demo.play":["播放","Play"],"home.demo.submit":["提交","Submit"],"home.demo.next":["下一题","Next"],
  "home.types.title":["核心题型速览","Core question types"],"home.types.sub":["真题高频机经，点击卡片直接开始练习","High-frequency real questions — click a card to start"],
  "home.steps.title":["三步开始刷题","Practice in 3 steps"],"home.steps.sub":["从选题到评分，一条完整练习闭环","From picking a type to scoring, a full practice loop"],
  "home.step1.t":["选择题型","Pick a type"],"home.step1.d":["按考试题型进入对应题库，WFD、RS、SST 等任你切换。","Enter the bank of your chosen type — WFD, RS, SST and more."],
  "home.step2.t":["听音作答","Listen & answer"],"home.step2.d":["播放音频完成作答，支持收藏、只看收藏与任意跳题。","Play the audio, answer, favorite, filter and jump freely."],
  "home.step3.t":["对照评分","Check & score"],"home.step3.d":["提交后自动判分，逐词对照绿/红标记，进度与统计实时更新。","Auto-graded on submit; green/red word match, stats update live."],
  "home.cta.t":["现在就开始你的 PTE 提分之旅","Start your PTE score journey now"],"home.cta.d":["免费机经 · 高频真题 · 科学刷题节奏","Free question bank · High-frequency items · Smart pace"],
  "home.cta.b":["立即开始练习","Start practicing now"],
  "practice.title":["机经练习","Practice"],"practice.sub":["真题高频机经 · 自动判分 · 逐词对照记录进度","High-frequency real questions · auto-grading · word-level check & progress"],
  "practice.f.fav":["只看收藏","Favorites"],"practice.f.all":["显示所有","Show all"],
  "practice.play":["播放","Play"],"practice.reset":["重置","Reset"],"practice.submit":["提交","Submit"],"practice.prev":["< 上一题","< Prev"],"practice.next":["下一题 >","Next >"],
  "practice.player.idle":["待播放","Idle"],"practice.player.playing":["播放中…","Playing…"],
  "practice.stat.title":["练习统计","My stats"],"practice.stat.done":["总完成","Done"],"practice.stat.c":["正确","Correct"],"practice.stat.p":["部分","Partial"],"practice.stat.w":["错误","Wrong"],
  "practice.tip.title":["备考贴士","Tips"],"practice.qgrid.title":["题目列表","Questions"],"practice.tip1":["WFD 机经命中率极高，建议考前过 2–3 遍，重点记高频短语。","WFD repeats heavily; review 2–3 times before the exam and memorize key phrases."],
  "practice.tip2":["先听整句抓主干，再补冠词、介词与单复数细节。","Catch the main clause first, then fill in articles, prepositions and plurals."],
  "practice.tip3":["提交后自动判分：绿色为命中、红色为遗漏，重点补记红色单词。","Auto-graded on submit: green = hit, red = missed — review red words."],
  "practice.tip4":["收藏薄弱题，考前用「只看收藏」集中突击。","Favorite weak items and drill them with the Favorites filter."],
  "clb.title":["CLB 等级对照","CLB levels"],"clb.sub":["加拿大语言基准（Canadian Language Benchmarks）与 PTE Core 分数的官方对照表","Official mapping between Canadian Language Benchmarks and PTE Core scores"],
  "clb.source":["依据培生官方《PTE Core Score Guide》与 IRCC 换算表","Source: Pearson PTE Core Score Guide & IRCC equivalency charts"],
  "clb.th1":["CLB 等级","CLB"],"clb.th2":["听力 Listening","Listening"],"clb.th3":["阅读 Reading","Reading"],"clb.th4":["口语 Speaking","Speaking"],"clb.th5":["写作 Writing","Writing"],
  "clb.note":["注：分数均为区间而非单点值；CLB 1–2 级低于上表最低区间（PTE Core 最低分为 10 分）。换算表会定期复核更新，请以 IRCC 官网最新要求为准。","Note: scores are ranges, not single values; CLB 1–2 are below the lowest band shown (PTE Core minimum is 10). Tables are reviewed periodically — always check the latest IRCC requirements."],
  "clb.c1.t":["PTE Core 用于移民","PTE Core for immigration"],"clb.c1.d":["加拿大移民申请（如快速通道 EE）接受 PTE Core 成绩，按上表换算为 CLB 等级。PTE Academic 用于留学与工作签证，另有独立换算体系。","Canadian immigration (e.g. Express Entry) accepts PTE Core and converts it to CLB via this table. PTE Academic serves study/work visas with its own conversion."],
  "clb.c2.t":["常见目标：CLB 7","Common target: CLB 7"],"clb.c2.d":["CLB 7 是快速通道等项目的常见语言门槛，对应听力 60–70、阅读 60–68、口语 68–75、写作 69–78。上表已用高亮标出。","CLB 7 is a common Express Entry threshold: Listening 60–70, Reading 60–68, Speaking 68–75, Writing 69–78. Highlighted in the table."],
  "clb.c3.t":["官方信源","Official sources"],"clb.c3.d":["对照数据来自培生官方 PTE Core 分数指南（2023 年 12 月版）及加拿大政府语言测试换算表。","Data from Pearson's official PTE Core Score Guide (Dec 2023) and the Government of Canada test equivalency charts."],
  "comm.title":["交流社区","Community"],"comm.sub":["与考友分享备考经验、交流机经与考场情报","Share tips, question banks and exam intel with fellow test takers"],
  "comm.search":["搜索帖子、关键词…","Search posts, keywords…"],"comm.post":["发帖","New post"],
  "comm.ann":["社区公告","Announcements"],"comm.ann1":["2026-09 WFD 题库已接入视频机经（61 题，来自羊驼PTE 视频切分）。","Sep 2026: WFD bank now has 61 items split from the Alpaca PTE video."],
  "comm.ann2":["SST 题库新增 6 篇高分范文，附模板句式解析。","SST bank adds 6 high-scoring samples with template analysis."],
  "comm.ann3":["社区发帖请遵守版规，勿传播考试作弊内容。","Follow house rules — no cheating content."],
  "comm.tag.title":["热门话题","Hot topics"],
  "footer.disc":["免责声明","Disclaimer"],"footer.priv":["隐私政策","Privacy"],"footer.copy":["FreePTE 保留所有权利 · WFD 题库来自视频机经切分，其余题型与社区数据为示例内容","FreePTE. All rights reserved · WFD bank comes from video slicing; other types & community data are demo"],
  "mascot.tip":["喵～ 加油刷题，一次过 PTE！","Meow~ Keep practicing and ace PTE!"],
  "toast.play":["音频播放中（原型演示音效）","Playing audio (prototype simulation)"],
  "toast.record":["录音中…（原型演示）","Recording… (prototype simulation)"],
  "toast.recordDone":["录音完成，可提交作答","Recording done — you can submit now"],
  "toast.empty":["请先作答再提交","Please answer first"],
  "toast.submitted":["已提交，请对照参考答案","Submitted — check the reference answer"],
  "toast.reset":["已重置本题","Question reset"],
  "toast.marked":["已标记，计入练习统计","Marked — stats updated"],
  "toast.noFav":["收藏夹还没有题目，快去收藏吧","No favorites yet — star some questions"],
  "toast.demo":["该功能为原型演示","This feature is a prototype demo"],
  "toast.needAnswer":["请先作答","Please answer first"],
  "toast.posted":["发布成功，已置顶展示","Posted — shown at top"],
  "toast.postEmpty":["标题和内容不能为空","Title and content are required"],
  "toast.login":["登录功能为原型演示","Login is a prototype demo"],"home.wm.wfd.t":["WFD 随身听","WFD Walkman"],"home.wm.wfd.d":["随时练习听写技能","Practice dictation anytime"],"home.wm.rs.t":["RS 随身听","RS Walkman"],"home.wm.rs.d":["随时练习复述技能","Practice repeating anytime"],"wm.wfd":["Write From Dictation","Write From Dictation"],"wm.rs":["Repeat Sentence","Repeat Sentence"],"wm.play":["播放","Play"],"wm.stop":["暂停","Pause"],"wm.now":["当前","Now"],"wm.mode":["模式:","Mode:"],"wm.seq":["顺序","Sequential"],"wm.rand":["随机","Random"],"wm.repeat":["重复:","Repeat:"],"wm.times":["次","x"],"wm.vol":["音量:","Volume:"],"wm.gap":["间隔:","Gap:"],"wm.secs":["秒","s"],"wm.rate":["语速:","Speed:"],
  "toast.mascot":["喵！备考加油，冲鸭！","Meow! Keep going!"],
  "btn.ok":["知道了","Got it"],"btn.cancel":["取消","Cancel"],"btn.post":["发布","Post"],
  "disc.title":["免责声明","Disclaimer"],"disc.body":["本网站为 PTE 备考练习原型演示。题库内容为示例数据，音频为模拟播放，不构成任何考试真题、答案或培训承诺。PTE 为培生教育集团商标，本站与其无隶属关系。练习成绩仅供参考，实际考试请以官方信息为准。","This site is a prototype demo for PTE practice. Question data is sample content, audio is simulated; nothing here constitutes real exam material or promises. PTE is a trademark of Pearson; this site is not affiliated with it."],
  "priv.title":["隐私政策","Privacy Policy"],"priv.body":["原型演示页面不收集任何个人信息。收藏、评分等练习数据仅保存在当前浏览器内存中，刷新页面后即重置。社区帖子为本地演示数据，不会上传至任何服务器。","This prototype collects no personal data. Favorites and scores live in browser memory only and reset on refresh. Community posts are local demo data and are never uploaded."],
  "post.title":["发布新帖","New post"],"post.f.title":["标题","Title"],"post.f.content":["内容","Content"],"post.f.tag":["话题","Topic"],
  "thread.empty":["没有找到相关帖子，换个关键词试试","No matching posts — try another keyword"],
  "detail.like":["赞","Likes"],"detail.reply":["回复","Replies"]
};
const T = k => (I18N[k]||[k,k])[lang==='en'?1:0];
let lang='zh', theme='light';

/* ================= 题型元信息 ================= */
const TYPES = [
  {k:'WFD', cn:'听写句子', en:'Write From Dictation', mode:'dictation', ins_cn:'播放音频，完整听写你听到的句子。注意拼写、冠词、介词与单复数。', ins_en:'Play the audio and write down the sentence you hear. Mind spelling, articles, prepositions and plurals.'},
  {k:'RS', cn:'复述句子', en:'Repeat Sentence', mode:'record', ins_cn:'播放音频，听清后复述你听到的句子，注意流利度与发音。', ins_en:'Play the audio, then repeat the sentence. Keep it fluent and clear.'},
  {k:'RA', cn:'朗读文本', en:'Read Aloud', mode:'read', ins_cn:'朗读下方文本，注意发音、重音与断句，约 40 秒内读完。', ins_en:'Read the passage aloud. Mind pronunciation, stress and pausing (~40s).'},
  {k:'SST', cn:'总结演讲', en:'Summarize Spoken Text', mode:'summarize', ins_cn:'播放音频，用 50–70 词总结演讲的核心内容。', ins_en:'Play the audio and summarize the talk in 50–70 words.'},
  {k:'DI', cn:'描述图片', en:'Describe Image', mode:'di', ins_cn:'观察图片，用约 40 秒描述主要信息与趋势。', ins_en:'Look at the image and describe key information and trends in ~40 seconds.'},
  {k:'RL', cn:'复述讲座', en:'Retell Lecture', mode:'summarize', ins_cn:'播放音频，用 50–70 词复述讲座要点。', ins_en:'Play the lecture and retell the main points in 50–70 words.'},
  {k:'ASQ', cn:'简答问题', en:'Answer Short Question', mode:'short', ins_cn:'播放音频，用一两个词简短回答问题。', ins_en:'Play the audio and answer with one or two words.'}
];

/* ================= 题库数据（示例机经） ================= */
const WFD_Q = [
"The lecture provided a comprehensive overview of the topic.",
"Students are required to submit their assignments before the deadline.",
"The university library offers a wide range of digital resources.",
"Climate change poses a significant threat to global ecosystems.",
"Economic growth depends on a stable and supportive policy environment.",
"The government has announced new measures to reduce carbon emissions.",
"Reading widely is essential for developing critical thinking skills.",
"The results of the experiment were consistent with our initial hypothesis.",
"Successful businesses adapt quickly to changing market conditions.",
"Public health campaigns play a vital role in preventing disease.",
"The conference will bring together experts from around the world.",
"Effective communication is the key to building strong relationships.",
"The company plans to expand its operations into new markets.",
"Scientific research requires patience, curiosity, and careful observation.",
"Many species are at risk of extinction due to habitat loss.",
"The workshop focused on practical strategies for effective writing.",
"Urban planning must consider the needs of all residents.",
"Advances in technology have transformed the way we work.",
"The museum displays a remarkable collection of ancient artifacts.",
"Regular exercise has been shown to improve mental health.",
"The professor encouraged students to question established ideas.",
"Sustainable development balances economic and environmental concerns.",
"Online courses offer learners greater flexibility and convenience.",
"The study examined the effects of sleep on academic performance.",
"International trade benefits both developed and developing countries.",
"The committee will review all proposals before making a decision.",
"Innovation often arises from collaboration across different fields.",
"The history of science is full of unexpected discoveries.",
"Water scarcity is becoming an increasingly serious global problem.",
"Employers value candidates who demonstrate strong problem-solving skills.",
"The seminar explored the relationship between language and culture.",
"Renewable energy sources are essential for a sustainable future.",
"The article highlights several common misconceptions about nutrition.",
"Teamwork requires mutual respect and a shared sense of purpose.",
"The population of the city has grown rapidly over the past decade.",
"Researchers are developing new treatments for infectious diseases.",
"The library will be closed for renovations during the summer.",
"Good time management helps students balance study and leisure.",
"The film received widespread critical acclaim for its originality.",
"Technological change often outpaces the development of new regulations.",
"The survey revealed significant differences between age groups.",
"All applicants must provide proof of their academic qualifications.",
"The lecture notes are available on the course website.",
"Consumer preferences have a direct impact on product design.",
"The government invests heavily in education and healthcare.",
"A healthy diet can reduce the risk of chronic disease.",
"The project requires careful planning and efficient resource allocation.",
"Language learning becomes easier with consistent daily practice.",
"The company is committed to reducing its environmental footprint.",
"Feedback from customers is used to improve product quality.",
"The report analyzes trends in global energy consumption.",
"Museums play an important role in preserving cultural heritage.",
"Effective leaders inspire their teams to achieve common goals.",
"The workshop will be held in the main conference hall.",
"Biodiversity is essential for the stability of natural ecosystems.",
"Students should develop independent research skills early in their studies.",
"The new policy aims to support small and medium-sized enterprises.",
"Digital literacy is a fundamental skill in the modern workplace.",
"The experiment must be repeated to confirm the validity of the results.",
"Tourism contributes significantly to the local economy.",
"The professor's lecture covered several important historical events.",
"Regular feedback helps employees improve their performance.",
"The environment plays a crucial role in child development.",
"Advances in medicine have dramatically increased life expectancy.",
"The company provides training programs for new employees.",
"Public transportation reduces traffic congestion in urban areas.",
"The findings of the study were published in a leading journal.",
"Effective writing requires clarity, coherence, and attention to detail.",
"The new campus facilities will open to students next semester.",
"Cultural exchange programs promote mutual understanding between nations.",
"The seminar series is open to all members of the university.",
"Financial literacy is important for making informed decisions.",
"The artist's work reflects the social issues of his time.",
"Online privacy has become a major concern for internet users.",
"The committee approved the budget for the upcoming year.",
"Sustainable agriculture ensures food security for future generations.",
"The speaker emphasized the importance of lifelong learning."
];

/* WFD 真实题库：来自视频切分（js/wfd-data.js 注入 window.WFD_VIDEO_DATA） */
const WFD_VIDEO = (typeof window!=='undefined' && window.WFD_VIDEO_DATA
  && Array.isArray(window.WFD_VIDEO_DATA.questions) && window.WFD_VIDEO_DATA.questions.length)
  ? window.WFD_VIDEO_DATA.questions.map(q=>({id:q.id,a:q.answer,tr:q.translation,audio:(q.audio.indexOf('assets/audio/')===0?q.audio:'assets/audio/'+q.audio),f:0,s:''}))
  : null;

const RS_Q = [
"The main lecture will begin at ten o'clock sharp.",
"Please make sure you have completed the registration form.",
"Environmental protection requires the cooperation of everyone.",
"The course focuses on both theory and practical application.",
"Our next meeting has been moved to next Wednesday.",
"Students are advised to check the notice board regularly.",
"The government has introduced a new housing policy.",
"Academic writing should be clear, concise and well organized.",
"Field trips provide valuable hands-on learning experiences.",
"Technology is changing the way people communicate every day."
];
const RA_Q = [
"The rapid development of artificial intelligence is reshaping industries across the world. While some fear job losses, others see new opportunities for creativity and innovation.",
"Climate change is one of the most urgent challenges of our time. Scientists agree that immediate action is needed to reduce greenhouse gas emissions and protect future generations.",
"University education is not only about acquiring knowledge but also about developing the ability to think independently and solve complex problems in real life.",
"Regular physical exercise has been proven to improve both physical and mental health. Experts recommend at least thirty minutes of moderate activity every day.",
"The internet has connected billions of people, making information more accessible than ever before. However, it also raises important questions about privacy and security.",
"Small businesses are often described as the backbone of the economy. They create jobs, drive innovation and bring vitality to local communities.",
"The study of history helps us understand the present and prepare for the future. By learning from past mistakes, societies can make wiser decisions today.",
"Cultural diversity enriches our daily lives in countless ways. Exposure to different traditions and perspectives broadens our understanding of the world."
];
const SST_Q = [
"The lecture discussed the causes of urban traffic congestion. The speaker argued that population growth and car ownership are the main drivers, while inadequate public transport worsens the problem. He suggested that governments should invest in rail networks, introduce congestion charging, and encourage car sharing. These measures, he concluded, would reduce emissions and improve quality of life.",
"Professor Lin talked about the importance of sleep for memory. She explained that during deep sleep the brain consolidates newly learned information. Lack of sleep, therefore, impairs concentration and academic performance. She advised students to maintain a regular sleep schedule and avoid screens before bed, emphasizing that quality sleep is as important as studying itself.",
"The speaker examined how consumer behavior is influenced by advertising. He noted that emotional appeals, celebrity endorsements and social proof are the most effective techniques. However, he warned that overexposure to advertising can lead to skepticism. Companies, he said, should focus on building trust through honest communication rather than aggressive promotion.",
"The talk focused on renewable energy sources, especially solar and wind power. The speaker highlighted that costs have fallen dramatically in recent years, making renewables competitive with fossil fuels. Challenges remain, including energy storage and grid stability. He concluded that a mix of technologies and supportive policies is essential for a successful energy transition.",
"Dr. Chen presented research on the effects of social media on teenagers. The findings show a link between heavy usage and increased anxiety, partly because of social comparison. However, the speaker noted that social media also offers support networks and learning opportunities. She recommended parental guidance and digital literacy education rather than outright bans.",
"The lecture introduced the concept of circular economy as an alternative to the linear take-make-dispose model. The speaker explained that products should be designed for reuse, repair and recycling. Businesses, he argued, can reduce costs and environmental impact simultaneously. Consumers also play a key role by choosing sustainable products and reducing waste."
];
const DI_Q = [
{c:'bar', t:'Monthly Sales Volume by Quarter', a:'The bar chart shows monthly sales volume across four quarters. Sales started at 120 units in Q1 and rose steadily, peaking at 260 units in Q4. Overall, the trend is clearly upward, with the strongest growth occurring in the second half of the year.'},
{c:'line', t:'Global Average Temperature Change 1990–2020', a:'The line graph illustrates the change in global average temperature from 1990 to 2020. The temperature increased gradually from about 0.3 degrees in 1990 to over 0.9 degrees in 2020. In conclusion, the data indicates a consistent warming trend over the past three decades.'},
{c:'pie', t:'Energy Sources in a City, 2025', a:'The pie chart shows the share of different energy sources in a city in 2025. Coal accounts for 38 percent, followed by natural gas at 27 percent, while renewable energy makes up 20 percent. This suggests that fossil fuels still dominate, though renewables are gaining a growing share.'},
{c:'bar', t:'Student Satisfaction by Service, 2026', a:'The bar chart compares student satisfaction across different campus services. The library received the highest rating at 88 percent, while the canteen scored the lowest at 61 percent. It is clear that most services perform well, but food quality needs improvement.'},
{c:'line', t:'Mobile Internet Users in China 2018–2025', a:'The line graph presents the number of mobile internet users in China from 2018 to 2025. The figure climbed from roughly 750 million in 2018 to over 1.1 billion in 2025. The trend shows steady growth, with a slight slowdown in the most recent years.'},
{c:'pie', t:'Household Spending Structure, 2025', a:'The pie chart illustrates how a typical household spends its income. Housing accounts for the largest share at 30 percent, followed by food at 24 percent and transport at 15 percent. In summary, housing and food together make up more than half of total spending.'}
];
const RL_Q = [
"Today's lecture focused on the history of the printing press and its impact on society. The invention allowed books to be produced quickly and cheaply, which increased literacy and spread new ideas across Europe. The speaker emphasized that this technological breakthrough laid the foundation for the Renaissance and the modern knowledge economy.",
"The speaker talked about the role of national parks in wildlife conservation. She explained that protected areas provide safe habitats for endangered species and help maintain biodiversity. At the same time, parks offer recreational opportunities and boost local tourism. She concluded that conservation and economic development can go hand in hand.",
"The lecture examined the factors that influence consumer purchasing decisions. Price remains the most important factor for most people, followed by quality and brand reputation. Online reviews now play a growing role, especially among younger consumers. The speaker advised companies to pay close attention to digital word of mouth.",
"Professor Zhang discussed the challenges of urbanization in developing countries. Rapid population growth has led to housing shortages, traffic problems and environmental pollution. He argued that smart city technologies, such as data-driven transport management, could help solve these issues if implemented properly and equitably.",
"The talk was about the importance of early childhood education. Research shows that the first few years of life are critical for brain development and future learning. The speaker called for greater public investment in preschool programs, noting that every dollar spent on early education yields significant long-term social returns.",
"The lecture explored how climate affects agricultural production. Changes in temperature and rainfall patterns directly influence crop yields and food security. Farmers are now adopting drought-resistant varieties and better irrigation techniques to adapt. The speaker stressed that international cooperation is essential to help vulnerable regions cope."
];
const ASQ_Q = [
"How many days are there in a leap year?|366",
"What is the largest planet in our solar system?|Jupiter",
"Which organ pumps blood around the human body?|The heart",
"What is the capital city of Australia?|Canberra",
"Which gas do plants absorb from the atmosphere?|Carbon dioxide",
"What is the study of the stars and planets called?|Astronomy",
"Which month comes after July?|August",
"How many sides does a hexagon have?|Six",
"What is the freezing point of water in Celsius?|Zero",
"Which instrument measures atmospheric pressure?|A barometer",
"What do we call a baby kangaroo?|A joey",
"Which country is famous for the Great Wall?|China"
].map(s => {const [q,a]=s.split('|');return {q,a};});

/* ===== 组装题库 ===== */
const BANK = {
  WFD:{list:WFD_VIDEO||WFD_Q.map(a=>({a,f:0,s:''}))},
  RS:{list:RS_Q.map(a=>({a,f:0,s:''}))},
  RA:{list:RA_Q.map(a=>({a,f:0,s:''}))},
  SST:{list:SST_Q.map(a=>({a,f:0,s:''}))},
  DI:{list:DI_Q.map(o=>({a:o.a,t:o.t,c:o.c,f:0,s:''}))},
  RL:{list:RL_Q.map(a=>({a,f:0,s:''}))},
  ASQ:{list:ASQ_Q.map(o=>({q:o.q,a:o.a,f:0,s:''}))}
};
/* 预置示例数据：WFD 部分收藏与评分（演示统计效果） */
if(!WFD_VIDEO){[2,7,11,17,24,30,43,49,56,62,69,75].forEach(i=>BANK.WFD.list[i].f=1);
[[0,'c'],[1,'p'],[2,'w'],[3,'c'],[4,'p']].forEach(([i,s])=>{BANK.WFD.list[i].s=s;});}
/* 其他题型各预置 1 条已做示例 */
[['RS',0,'c'],['RA',0,'p'],['SST',0,'w'],['DI',0,'c'],['RL',0,'p'],['ASQ',0,'c']].forEach(([t,i,s])=>{BANK[t].list[i].s=s;});
const TYPE_ORDER = TYPES.map(t=>t.k);

/* ===== 社区示例帖子 ===== */
const THREADS = [
  {tag:'WFD',tagCls:'tag-wfd',t:'WFD 高分心得：77 题机经这样刷最有效',ex:'整理了三轮刷题法：第一轮全听写、第二轮只看收藏、第三轮考前 48 小时快过。附我的高频易错词表，评论区自取。',u:'Ada',time:'2 小时前',reply:23,like:156},
  {tag:'RS',tagCls:'tag-rs',t:'RS 总是卡壳？分享一个「影子跟读」训练法',ex:'每天 20 分钟，跟着音频延迟半秒跟读，一周后明显感觉流利度提升。坚持一个月，RS 从 40 分提到 68 分。',u:'Leo',time:'5 小时前',reply:41,like:289},
  {tag:'SST',tagCls:'tag-sst',t:'SST 模板整理（附 6 篇高分范文思路）',ex:'总结了自己用的万能框架：主题句 + 两个分论点 + 结论句，控制在 65 词左右。附 6 篇范文的要点拆解。',u:'Mia',time:'昨天',reply:35,like:214},
  {tag:'community',tagCls:'tag-community',t:'9 月 12 日广州考场回忆 + 机经核对',ex:'昨天刚考完，WFD 中了 6 道原题！整理了考场流程和遇到的机经编号，和论坛里的答案逐条核对过。',u:'Kevin',time:'昨天',reply:57,like:402},
  {tag:'general',tagCls:'tag-general',t:'在职备考 45 天出分 68：时间表分享',ex:'朝九晚六，每天只挤 1.5 小时。早 30 分钟 WFD，午休 20 分钟 ASQ，晚 40 分钟 RS+SST。附详细时间表。',u:'Nina',time:'3 天前',reply:29,like:198},
  {tag:'WFD',tagCls:'tag-wfd',t:'求问：WFD 大小写和标点会被判错吗？',ex:'官方说标点大小写不计分，但拼写和冠词必须准确。亲测少写一个 the 直接扣分，大家注意。',u:'Tom',time:'3 天前',reply:18,like:87},
  {tag:'general',tagCls:'tag-general',t:'CLB 7 和 CLB 9 的分数差距到底有多大？',ex:'按官方对照表算了下：CLB 7 听力 60–70，CLB 9 要 82–88。口语从 68–75 到 84–88 是最大的坎。',u:'Sara',time:'4 天前',reply:14,like:102},
  {tag:'SST',tagCls:'tag-sst',t:'SST 字数超了 80 词会被压分吗？',ex:'实测 85 词拿了满分 content。关键是要点全、逻辑顺，字数在 50–70 只是建议区间，别过度焦虑。',u:'Ben',time:'5 天前',reply:9,like:64},
  {tag:'community',tagCls:'tag-community',t:'上海徐汇考场设备体验 + 耳机音量提醒',ex:'耳机隔音不错，但试音环节千万别跳过。建议提前 20 分钟到，安检+拍照流程很快。',u:'Ivy',time:'6 天前',reply:12,like:75},
  {tag:'RS',tagCls:'tag-rs',t:'RS 语速太快怎么办？降速练习工具整理',ex:'整理了 3 个可以 0.75 倍速播放的音频工具，先慢后快，两周内语速适应力提升明显。',u:'Owen',time:'1 周前',reply:20,like:131}
];
const TAGS = ['WFD','RS','SST','DI','RL','ASQ','general','community'];