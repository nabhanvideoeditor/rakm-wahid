/* =========================================================
   weston — دليل أدوات الذكاء الاصطناعي
   كل قسم: أيقونة + اسم + وصف + لينك + سعر
   ========================================================= */

const TOOL_CATS = [
  { id: "chat", icon: "message", name: "محادثة ونصوص" },
  { id: "image", icon: "image", name: "صور" },
  { id: "video", icon: "video", name: "فيديو" },
  { id: "audio", icon: "mic", name: "صوت وموسيقى" },
  { id: "code", icon: "terminal", name: "برمجة" },
  { id: "search", icon: "search", name: "بحث ومعرفة" },
  { id: "auto", icon: "gear", name: "أتمتة" },
  { id: "productivity", icon: "bars", name: "إنتاجية وأعمال" },
  { id: "design", icon: "palette", name: "تصميم" },
  { id: "write", icon: "edit", name: "كتابة وتسويق" },
  { id: "edu", icon: "cap", name: "تعليم" },
  { id: "dev", icon: "wrench", name: "أدوات مطوّرين" },
];

const TOOLS = [
  /* message محادثة ونصوص */
  { c: "chat", n: "ChatGPT", d: "أشهر مساعد AI — كتابة، تحليل، صور، بحث عميق", l: "https://chatgpt.com", p: "مجاني / Plus 20$" },
  { c: "chat", n: "Claude", d: "كتابة دقيقة وتحليل مستندات طويلة وكود", l: "https://claude.ai", p: "مجاني / Pro 20$" },
  { c: "chat", n: "Google Gemini", d: "تكامل مع جوجل ونافذة سياق ضخمة", l: "https://gemini.google.com", p: "مجاني / Pro 20$" },
  { c: "chat", n: "Microsoft Copilot", d: "الذكاء الاصطناعي داخل Word وExcel وOutlook", l: "https://copilot.microsoft.com", p: "مجاني / M365 10$" },
  { c: "chat", n: "DeepSeek", d: "نموذج صيني قوي ورخيص — منافس مباشر", l: "https://chat.deepseek.com", p: "مجاني / API رخيص" },
  { c: "chat", n: "Mistral", d: "نماذج أوروبية مفتوحة المصدر", l: "https://chat.mistral.ai", p: "مجاني / Pro" },
  { c: "chat", n: "Meta AI", d: "مدمج في واتساب وانستجرام", l: "https://www.meta.ai", p: "مجاني" },
  { c: "chat", n: "Grok", d: "ذكاء اصطناعي من إكس — بيانات لحظية", l: "https://grok.com", p: "مجاني / Super" },

  /* image صور */
  { c: "image", n: "Midjourney", d: "أعلى جودة صور فنية من نص", l: "https://www.midjourney.com", p: "مدفوع من 10$" },
  { c: "image", n: "DALL·E", d: "توليد صور داخل ChatGPT", l: "https://chatgpt.com", p: "ضمن ChatGPT" },
  { c: "image", n: "Adobe Firefly", d: "صور آمنة تجارياً داخل أدوبي", l: "https://www.adobe.com/firefly", p: "مجاني / مدفوع" },
  { c: "image", n: "Ideogram", d: "نص عربي وإنجليزي داخل الصور بدقة", l: "https://ideogram.ai", p: "مجاني / مدفوع" },
  { c: "image", n: "Leonardo.ai", d: "فن وتصميم ألعاب وكونسبت آرت", l: "https://leonardo.ai", p: "مجاني / 12$" },
  { c: "image", n: "Recraft", d: "فيكتور وشعارات وتصاميم تجارية", l: "https://www.recraft.ai", p: "مجاني / 12$" },
  { c: "image", n: "Canva AI", d: "تصميم سريع بالذكاء الاصطناعي", l: "https://www.canva.com", p: "مجاني / Pro" },
  { c: "image", n: "Stable Diffusion", d: "توليد صور مفتوح المصدر (محلي/سحابي)", l: "https://stability.ai", p: "مجاني / API" },
  { c: "image", n: "ComfyUI", d: "تحكم احترافي في الصور بسير عمل", l: "https://github.com/comfyanonymous/ComfyUI", p: "مجاني مفتوح" },

  /* video فيديو */
  { c: "video", n: "Runway", d: "توليد فيديو من نص أو صورة + مونتاج AI", l: "https://runwayml.com", p: "رصيد مجاني / 15$" },
  { c: "video", n: "Pika", d: "فيديوهات قصيرة من نص — سريع ومجاني", l: "https://pika.art", p: "مجاني / مدفوع" },
  { c: "video", n: "Kling AI", d: "فيديو عالي الجودة من نص — منافس قوي", l: "https://klingai.com", p: "مجاني / حوالي 10$" },
  { c: "video", n: "HeyGen", d: "أفتار رقمي بيتكلم بالصوت والصورة", l: "https://www.heygen.com", p: "تجريبي / 29$" },
  { c: "video", n: "Synthesia", d: "فيديوهات تدريبية بأفاتار ومعلق", l: "https://www.synthesia.io", p: "من 18$" },
  { c: "video", n: "Descript", d: "مونتاج بالنص — احذف كلمة من الفيديو", l: "https://www.descript.com", p: "مجاني / 16$" },
  { c: "video", n: "OpusClip", d: "يقص الفيديو الطويل لقصص ريلز", l: "https://www.opus.pro", p: "مجاني / 15$" },
  { c: "video", n: "CapCut", d: "مونتاج احترافي بأدوات AI مجانية", l: "https://www.capcut.com", p: "مجاني" },

  /* mic صوت */
  { c: "audio", n: "ElevenLabs", d: "أصوات واقعية + استنساخ صوت + دبلجة 70 لغة", l: "https://elevenlabs.io", p: "مجاني / 6$" },
  { c: "audio", n: "Suno", d: "تأليف أغاني كاملة بأصوات من نص", l: "https://suno.com", p: "مجاني / 8$" },
  { c: "audio", n: "Udio", d: "منافس سونو — أغاني وموسيقى", l: "https://www.udio.com", p: "مجاني / مدفوع" },
  { c: "audio", n: "Murf", d: "تعليق صوتي احترافي سريع", l: "https://murf.ai", p: "مجاني / مدفوع" },
  { c: "audio", n: "Voicemod", d: "تغيير الصوت لحظياً في المكالمات", l: "https://www.voicemod.net", p: "مجاني / مدفوع" },

  /* terminal برمجة */
  { c: "code", n: "GitHub Copilot", d: "اقتراحات كود داخل VS Code وJetBrains", l: "https://github.com/features/copilot", p: "مجاني / 10$" },
  { c: "code", n: "Cursor", d: "محرر كود بالـ AI Agents", l: "https://www.cursor.com", p: "مجاني / 20$" },
  { c: "code", n: "Claude Code", d: "وكيل برمجي في الطرفية — ينفّذ مهام", l: "https://docs.anthropic.com/en/docs/claude-code", p: "ضمن Claude Pro" },
  { c: "code", n: "OpenAI Codex", d: "وكيل برمجة داخل ChatGPT", l: "https://chatgpt.com", p: "ضمن ChatGPT" },
  { c: "code", n: "Replit", d: "برمجة ونشر مشاريع بالسحابة", l: "https://replit.com", p: "مجاني / مدفوع" },
  { c: "code", n: "Lovable", d: "ابنِ تطبيقات ويب بالكلام", l: "https://lovable.dev", p: "مجاني / 25$" },
  { c: "code", n: "Bolt.new", d: "نماذج أولية سريعة للتطبيقات", l: "https://bolt.new", p: "مجاني / 25$" },
  { c: "code", n: "v0", d: "توليد واجهات React من وصف", l: "https://v0.dev", p: "مجاني / 30$" },
  { c: "code", n: "Windsurf", d: "بيئة برمجة بالـ AI (من صانع Codeium)", l: "https://windsurf.com", p: "مجاني / مدفوع" },

  /* search بحث */
  { c: "search", n: "Perplexity", d: "بحث بإجابات موثقة بالمصادر", l: "https://www.perplexity.ai", p: "مجاني / 20$" },
  { c: "search", n: "Consensus", d: "بحث في الأبحاث العلمية", l: "https://consensus.app", p: "مجاني / مدفوع" },
  { c: "search", n: "Elicit", d: "باحث علمي شخصي يلخّص الأوراق", l: "https://elicit.com", p: "مجاني / مدفوع" },
  { c: "search", n: "You.com", d: "محرك بحث بالـ AI", l: "https://you.com", p: "مجاني" },
  { c: "search", n: "Google AI Overviews", d: "ملخصات AI في بحث جوجل", l: "https://www.google.com", p: "مجاني" },
  { c: "search", n: "NotebookLM", d: "تدوينات وملخصات من مصادرك (جوجل)", l: "https://notebooklm.google.com", p: "مجاني" },

  /* gear أتمتة */
  { c: "auto", n: "n8n", d: "أتمتة سير عمل مفتوحة المصدر", l: "https://n8n.io", p: "مجاني محلي / مدفوع سحابي" },
  { c: "auto", n: "Zapier", d: "اربط تطبيقاتك واترك AI يشتغل", l: "https://zapier.com", p: "مجاني / 20$" },
  { c: "auto", n: "Make", d: "أتمتة مرئية بسيناريوهات معقدة", l: "https://www.make.com", p: "مجاني / 12$" },
  { c: "auto", n: "Lindy", d: "وكلاء AI للمهام المتكررة", l: "https://www.lindy.ai", p: "تجريبي / 30$" },
  { c: "auto", n: "Gumloop", d: "سير عمل بالـ AI بدون كود", l: "https://gumloop.com", p: "تجريبي / 37$" },

  /* bars إنتاجية */
  { c: "productivity", n: "Notion AI", d: "تنظيم ملاحظات ومستندات بالـ AI", l: "https://www.notion.so", p: "مجاني / 20$" },
  { c: "productivity", n: "Gamma", d: "عروض تقديمية ومواقع بالذكاء الاصطناعي", l: "https://gamma.app", p: "مجاني / 9$" },
  { c: "productivity", n: "Beautiful.ai", d: "سلايدات احترافية تلقائياً", l: "https://www.beautiful.ai", p: "تجريبي / 12$" },
  { c: "productivity", n: "Otter.ai", d: "تدوين اجتماعات لحظي بالذكاء الاصطناعي", l: "https://otter.ai", p: "مجاني / 8$" },
  { c: "productivity", n: "Fireflies.ai", d: "ملخصات اجتماعات متزامنة مع CRM", l: "https://fireflies.ai", p: "مجاني / 10$" },
  { c: "productivity", n: "Fathom", d: "تسجيل اجتماعات وملخصات مجاناً", l: "https://fathom.video", p: "مجاني / 16$" },
  { c: "productivity", n: "Granola", d: "ملاحظات اجتماعات بدون بوت", l: "https://granola.ai", p: "مجاني / 14$" },

  /* palette تصميم */
  { c: "design", n: "Figma AI", d: "تصميم واجهات بأدوات ذكية", l: "https://www.figma.com", p: "مجاني / مدفوع" },
  { c: "design", n: "Canva", d: "تصميم سوشيال ميديا والعروض", l: "https://www.canva.com", p: "مجاني / Pro" },
  { c: "design", n: "Adobe Express", d: "تصاميم سريعة بالذكاء الاصطناعي", l: "https://www.adobe.com/express", p: "مجاني / مدفوع" },
  { c: "design", n: "Looka", d: "شعارات وهوية بالذكاء الاصطناعي", l: "https://looka.com", p: "مدفوع" },
  { c: "design", n: "Remove.bg", d: "شيل خلفية الصور بثانية", l: "https://www.remove.bg", p: "مجاني / مدفوع" },

  /* edit كتابة */
  { c: "write", n: "Jasper", d: "كتابة محتوى تسويقي متسق مع البراند", l: "https://www.jasper.ai", p: "من 59$" },
  { c: "write", n: "Grammarly", d: "تصحيح نحوي وتحسين أسلوب الكتابة", l: "https://www.grammarly.com", p: "مجاني / 12$" },
  { c: "write", n: "Writesonic", d: "مقالات وإعلانات بالذكاء الاصطناعي", l: "https://writesonic.com", p: "مجاني / مدفوع" },
  { c: "write", n: "Copy.ai", d: "نصوص تسويقية سريعة", l: "https://www.copy.ai", p: "مجاني / مدفوع" },
  { c: "write", n: "Surfer", d: "محتوى SEO متوافق مع محركات البحث", l: "https://surferseo.com", p: "من 49$" },

  /* cap تعليم */
  { c: "edu", n: "Khan Academy", d: "تعليم مجاني بمناهج كاملة", l: "https://www.khanacademy.org", p: "مجاني" },
  { c: "edu", n: "Duolingo", d: "تعلم لغات بالذكاء الاصطناعي", l: "https://www.duolingo.com", p: "مجاني / مدفوع" },
  { c: "edu", n: "Quizlet", d: "بطاقات ذاكرة واختبارات ذكية", l: "https://quizlet.com", p: "مجاني / مدفوع" },
  { c: "edu", n: "Coursera", d: "كورسات جامعات عالمية (منحة مالية)", l: "https://www.coursera.org", p: "مجاني سماع / مدفوع شهادة" },
  { c: "edu", n: "edX", d: "كورسات MIT وHarvard", l: "https://www.edx.org", p: "مجاني سماع / مدفوع" },

  /* wrench مطوّرين */
  { c: "dev", n: "Hugging Face", d: "نماذج ومجموعات بيانات ومساحات", l: "https://huggingface.co", p: "مجاني / مدفوع" },
  { c: "dev", n: "Replicate", d: "شغّل نماذج AI من السحابة", l: "https://replicate.com", p: "مجاني / API" },
  { c: "dev", n: "Ollama", d: "شغّل نماذج محلياً على جهازك", l: "https://ollama.com", p: "مجاني" },
  { c: "dev", n: "LM Studio", d: "واجهة سهلة للنماذج المحلية", l: "https://lmstudio.ai", p: "مجاني" },
  { c: "dev", n: "Google Colab", d: "بيئة بايثون مع GPU مجاني", l: "https://colab.research.google.com", p: "مجاني / Pro" },
  { c: "dev", n: "Weights & Biases", d: "تتبع تجارب التعلم الآلي", l: "https://wandb.ai", p: "مجاني / مدفوع" },
  { c: "dev", n: "Gradio", d: "ابنِ واجهة لنموذجك في دقائق", l: "https://gradio.app", p: "مجاني" },
  { c: "dev", n: "Streamlit", d: "حوّل سكربتات بايثون لتطبيقات", l: "https://streamlit.io", p: "مجاني" },
];
