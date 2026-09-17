# -*- coding: utf-8 -*-
"""
WFD 题库构建脚本（数据来源：羊驼PTE 视频 40283604348-1-160.mp4）
- 英文句子: 来自视频画面 OCR（权威答案）
- 中文翻译: 来自视频画面 OCR
- 时间窗:   来自 OCR 字幕显示区间（覆盖整段朗读音频）
输出: server/data/wfd-questions.json （后端 API 数据）
"""
import json, io, os

# (start, end, en, zh) —— 61 道题，OCR 屏幕文本
QS = [
(0, 3.9, "You will get your uniform on the first day.", "你第一天就会拿到制服。"),
(3.933, 7.533, "You should meet me in the lecture theater room.", "你应该在演讲厅等我。"),
(7.566, 11, "Rail transport is becoming more and more popular.", "铁路运输越来越受欢迎。"),
(11.033, 14.2, "Please make an appointment with your tutor about work.", "请与你的导师预约工作时间。"),
(14.233, 18.066, "You have to make an appointment with your doctor.", "你得和你的医生预约。"),
(18.1, 20.833, "The fiction books are just past the counter.", "小说书就在柜台那边。"),
(20.866, 23.966, "The teacher explains the homework to the students.", "老师给学生们讲解家庭作业。"),
(24, 28.133, "The restrooms are down the hall and to the right.", "洗手间在大厅的右边。"),
(28.166, 32.8, "The student service center is located on the main campus behind the library.", "学生服务中心位于主校区图书馆后面。"),
(32.833, 37.233, "The biology department is respected for its research activities.", "生物系因其研究活动而受到尊重。"),
(37.266, 40.1, "You can use your laptops in the lecture.", "你们可以在课堂上使用笔记本电脑。"),
(40.133, 43.366, "You need to put these books on the table over there.", "你需要把这些书放在那边的桌子上。"),
(43.4, 47.833, "A new article was published regarding the university last week.", "上周发表了一篇关于这所大学的新文章。"),
(47.866, 53.033, "Food that contains antibiotics provides few or no nutritional value.", "含有抗生素的食物提供很少或没有营养价值。"),
(53.066, 58.566, "Many different conferences offer opportunities for volunteer work.", "许多不同的会议提供志愿者工作的机会。"),
(58.6, 62.4, "You are required to attend lectures and write weekly reports.", "你被要求上课并写周报。"),
(62.433, 65.666, "Computers used to be larger than they are now.", "过去的计算机比现在的大。"),
(65.7, 69.1, "It is important to plan your study time carefully.", "认真规划学习时间是很重要的。"),
(69.133, 73.1, "All students should submit their assignments by the end of week.", "所有的学生都应该在周末之前提交作业。"),
(73.133, 77.266, "Contemporary critics dismissed his idea as eccentric.", "当代评论家认为他的想法古怪而不予理睬。"),
(77.3, 83.5, "The integration of archaeologists' studies with community projects is widely encouraged.", "考古学家的研究与社区项目的结合得到了广泛的鼓励。"),
(83.533, 88.4, "This is the first example of a modern and professional army.", "这是一支现代化和职业化军队的第一个例子。"),
(88.433, 93.566, "Many employers cannot afford health insurance to their workers.", "许多雇主负担不起员工的医疗保险。"),
(93.6, 98.466, "A representative selection will be carried out in the classroom.", "将在课堂上进行有代表性的评选。"),
(98.5, 102.666, "The best student has an opportunity to require a scholarship.", "最优秀的学生有机会申请奖学金。"),
(102.7, 107.133, "Formal conclusions could be established through rigorous experiments.", "通过严格的实验可以得出正式的结论。"),
(107.166, 110.333, "Students can use the laptop during the lecture.", "学生可以在课堂上使用笔记本电脑。"),
(110.366, 112.8, "You must be able to work in a team.", "你必须能够在团队中工作。"),
(112.833, 117.433, "The government department was doing some crucial work on climate change.", "政府部门正在做一些关于气候变化的重要工作。"),
(117.466, 121.5, "Stories often contain a lot of messages in our life.", "故事常常包含着我们生活中的许多信息。"),
(121.533, 125.4, "You have to submit the electronic copy of your essay.", "你必须提交论文的电子版。"),
(125.433, 130.166, "The museum is closed on the third Monday of every month.", "博物馆每个月的第三个星期一闭馆。"),
(130.199, 133.966, "Population has a sharp rise in the recent twenty years.", "近二十年来人口急剧增加。"),
(134, 137.8, "Houses were built for workers near the factories.", "工厂附近为工人盖了房子。"),
(137.833, 143.8, "Organic food is grown without applying chemicals and possesses no artificial additives.", "有机食品种植时不使用化学药品，也不含人工添加剂。"),
(143.833, 150.033, "Even with a permit, it is almost impossible to find a spot in the car park.", "即使有许可证，也几乎不可能在停车场找到停车位。"),
(150.066, 154.9, "The new articles for the study and the subject are collected.", "收集了本研究和本课题的新文章。"),
(154.933, 158.933, "The essay should be clear during the exam.", "考试时作文应该清晰。"),
(158.966, 162.233, "The paper should be submitted by the end of the term.", "论文应在学期结束前提交。"),
(162.266, 167.533, "The archeologists discovered tools which were interested by historians.", "考古学家发现了历史学家感兴趣的工具。"),
(167.566, 173.033, "Protective goggles must be worn in all the university laboratories.", "所有大学实验室都必须佩戴防护眼镜。"),
(173.066, 178.966, "A demonstrated ability to write clear, correct and concise English is obligatory.", "必须具备清晰、正确、简明的英语写作能力。"),
(179, 184.133, "Well, there are some doubts about whether these events actually occurred.", "对于这些事件是否真的发生了一些疑问。"),
(184.166, 188.033, "The student union hosts a variety of social events.", "学生会举办各种各样的社交活动。"),
(188.066, 193.8, "It is clear that national trading system is a good thing.", "很明显，国家贸易体系是一件好事。"),
(193.833, 198.8, "I will be in my office tomorrow from eleven to two.", "明天11点到2点我将在办公室。"),
(198.833, 203.033, "Extension is only available under special circumstances.", "只有在特殊情况下才可以延期。"),
(203.066, 206.833, "Tomorrow's lecture has been canceled due to the power cut.", "因为停电，明天的讲座取消了。"),
(206.866, 210.933, "Eating a healthy breakfast can provide energy throughout the day.", "吃一顿健康的早餐可以为你提供一整天的能量。"),
(210.966, 216.8, "Keeping organized class notes makes study time more efficient.", "有组织的课堂笔记使学习时间更有效率。"),
(216.833, 223.533, "Optional tutorials are offered in the final week of a term.", "选修教程在学期的最后一周提供。"),
(223.566, 228.7, "Before you choose your university course, you should consider your future career.", "在你选择大学课程之前，你应该考虑你未来的职业。"),
(228.733, 234.3, "Many students are now studying science, technology, engineering and maths.", "许多学生现在学习科学、技术、工程和数学。"),
(234.333, 238.466, "You are advised to use multiple research methods for this project.", "建议您在这个项目中使用多种研究方法。"),
(238.5, 242.666, "Courses on nutrition are growing in popularity every year.", "营养学课程每年都越来越受欢迎。"),
(242.7, 246.533, "Taxes from factories play a large role in some economies.", "工厂税在一些经济体中发挥着重要作用。"),
(246.566, 251.866, "The vocabulary that has peculiar meanings in a special field is called jargon.", "在某一特定领域具有特殊含义的词汇被称为行话。"),
(251.9, 256.8, "Students who study overseas can significantly improve their work chances.", "出国留学的学生可以显著提高他们的工作机会。"),
(256.833, 261.5, "Your term papers should include current social issues.", "你的学期论文应该包括当前的社会问题。"),
(261.533, 264.566, "It is a debate about the value of knowledge.", "这是一场关于知识价值的辩论。"),
(264.866, 269.166, "One student representative will be selected from each class.", "每个班将选出一名学生代表。"),
]

DURATION = 269.352
PAD_START = 0.0      # 开头不额外前移（OCR 起点已覆盖前导静音）
PAD_END = 0.25       # 结尾补 0.25s，防止尾音被切
GAP_MIN = 0.05       # 与下一题至少留 0.05s 间隔

def clamp(x, lo, hi):
    return max(lo, min(hi, x))

items = []
for i, (start, end, en, zh) in enumerate(QS, start=1):
    nxt_start = QS[i][0] if i < len(QS) else DURATION
    t_start = round(clamp(start - PAD_START, 0, DURATION), 2)
    t_end = round(clamp(min(end + PAD_END, nxt_start - GAP_MIN, DURATION), t_start + 0.1, DURATION), 2)
    items.append({
        "id": i,
        "audio": f"wfd_{i:02d}.mp3",
        "answer": en,
        "translation": zh,
        "start": t_start,
        "end": t_end,
        "source": "40283604348-1-160.mp4",
        "source_start": round(start, 3),
        "source_end": round(end, 3),
    })

out = {
    "meta": {
        "title": "WFD 机经（来自视频 40283604348-1-160.mp4）",
        "source_video": "wfd_vedio/40283604348-1-160.mp4",
        "count": len(items),
        "audio_dir": "assets/audio",
        "generated_by": "scripts/build_questions.py + MediaKit(ASR/OCR/裁剪)",
    },
    "questions": items,
}

p = r"E:\code\pte_doubao\server\data\wfd-questions.json"
os.makedirs(os.path.dirname(p), exist_ok=True)
with io.open(p, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

print("total:", len(items))
for it in items[:3]:
    print(it)
print("...")
print("last:", items[-1])
