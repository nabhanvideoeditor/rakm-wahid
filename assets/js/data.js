/* =========================================================
   weston — نظام المسارات والكورسات
   مسارات تخصص (داخل الـ AI نفسه) + مسارات تطبيق (تستخدم AI في شغلك)
   ========================================================= */

const ACADEMY = {
  meta: {
    name: "weston",
    full: "منصة weston للذكاء الاصطناعي",
    tagline: "تعلّم كل مجالات الـ AI في مكان واحد — مجاني 100%",
    desc: "مسارات مرتّبة من الصفر إلى الاحتراف، كورسات بمصادر مجانية عالمية، شهادات إتمام، ومتابعة تلقائية لتقدّمك.",
    version: "2.0",
  },

  features: [
    { icon: "infinity", title: "مجاني بالكامل", desc: "كل الكورسات والمسارات والشهادات مجانية — من غير أي رسوم خفية." },
    { icon: "compass", title: "مسارات مرتّبة", desc: "الكورسات مترتّبة في مسارات: تخصص تدخل بيها جوه الـ AI، وتطبيق تحطّه في شغلك." },
    { icon: "award", title: "شهادات إتمام", desc: "شهادات مجانية من جهات عالمية معتمدة تضيفها لـ LinkedIn." },
    { icon: "book", title: "من الصفر للاحتراف", desc: "منهج كامل و69 كورس ومصدر، من أول «إيه الـ AI» لحد بناء أنظمة كاملة." },
    { icon: "clock", title: "583+ ساعة تعلم", desc: "محتوى عملي موزّع على 14 شهر، بمعدل 10–15 ساعة في الأسبوع." },
    { icon: "chart", title: "متابعة تقدّمك", desc: "علّم على كل درس تكمّله، وتقدّمك بيتحفظ تلقائياً على جهازك." },
  ],

  trackKinds: {
    specialize: {
      title: "مسارات التخصص",
      desc: "بتدخل جوه الـ AI نفسه — تفهمه، وتبنيه، وتشتغل بيه كتخصص أساسي.",
      example: "حد عايز يشتغل في الـ AI كمهنة، أو يبني أنظمة وأوتوميشن.",
    },
    apply: {
      title: "مسارات التطبيق",
      desc: "عندك مجال شغل بالفعل، والمسار بيوريك تحطّ الـ AI جواه فتنجز أسرع وأحسن.",
      example: "مبرمج، مسوّق، صانع محتوى، أو أي حد عايز يخدم شغله بالـ AI.",
    },
  },

  tracks: [
    { id: "t-math", kind: "specialize", title: "الرياضيات للذكاء الاصطناعي", icon: "sigma", tagline: "اللي بتحسبه النماذج", desc: "الجبر الخطي والتفاضل والاحتمالات — الأساس الرياضي اللي بيفرّق بين مستخدم ومحترف.", courseIds: ["c-math-la", "c-math-calc", "c-math-prob", "c-math-book", "c-numpy"], level: "مبتدئ", weeks: "4 أسابيع" },
    { id: "t-foundations", kind: "specialize", title: "أساسيات الذكاء الاصطناعي", icon: "sprout", tagline: "نقطة البداية لأي حد", desc: "تفهم إيه الـ AI وإزاي بيفكر، من غير أي خلفية تقنية.", courseIds: ["c-elements", "c-ai4e", "c-edraak", "c-edraak-intro", "c-mlcc"], level: "مبتدئ", weeks: "6 أسابيع" },
    { id: "t-python", kind: "specialize", title: "Python وعلم البيانات", icon: "python", tagline: "أدوات الـ AI الأساسية", desc: "تتعلم بايثون من الصفر وتتعامل مع البيانات اللي هتبني عليها نماذجك.", courseIds: ["c-kaggle-intro", "c-kaggle-python", "c-kaggle-pandas", "c-kaggle-viz", "c-kaggle-git", "c-kaggle-sql", "c-cs50py", "c-colab", "c-ds"], level: "مبتدئ", weeks: "7 أسابيع" },
    { id: "t-ml", kind: "specialize", title: "التعلّم الآلي Machine Learning", icon: "bot", tagline: "تبني موديل يتعلم من البيانات", desc: "الخوارزميات الكلاسيكية وتقييم النماذج وبناء أنظمة تنبؤ حقيقية.", courseIds: ["c-ml-spec", "c-statquest", "c-kaggle-iml", "c-kaggle-fe", "c-cs229", "c-100ml"], level: "متوسط", weeks: "9 أسابيع" },
    { id: "t-dl", kind: "specialize", title: "التعلّم العميق Deep Learning", icon: "brain", tagline: "الشبكات العصبية من الصفر", desc: "من البيرسبترون لحد الشبكات الالتفافية والتحويل، وبتبني وتدرّب نماذجك.", courseIds: ["c-fastai", "c-karpathy", "c-3b1b-nn", "c-cs50ai", "c-cs231n", "c-dl-spec", "c-fcc-ml", "c-kaggle-dl", "c-kaggle-cv"], level: "متوسط", weeks: "9 أسابيع" },
    { id: "t-genai", kind: "specialize", title: "الـ AI التوليدي والوكلاء", icon: "sparkles", tagline: "النماذج اللغوية والوكلاء الأذكياء", desc: "هندسة الأوامر، RAG، النماذج اللغوية الكبيرة، وبناء وكلاء ينفّذوا مهام.", courseIds: ["c-hf-llm", "c-cs224n", "c-cohere", "c-nlp-spec", "c-rag", "c-langchain", "c-finetune", "c-hf-agents", "c-langgraph", "c-crewai", "c-fsdl"], level: "متوسط", weeks: "10 أسابيع" },
    { id: "t-mlops", kind: "specialize", title: "MLOps ونشر النماذج", icon: "rocket", tagline: "من النوتبوك للإنتاج", desc: "تغلّف نموذجك وتنشره كـ API وتراقبه، زي الفرق المحترفة بالظبط.", courseIds: ["c-mlops-ml", "c-mlops-zoom", "c-mle-production"], level: "متقدم", weeks: "4 أسابيع" },
    { id: "t-advanced", kind: "specialize", title: "تخصصات متقدمة", icon: "target", tagline: "رؤية حاسوب، تعلّم معزز", desc: "تتعمق في تخصص واحد: رؤية الحاسوب أو التعلم المعزز.", courseIds: ["c-hf-cv", "c-hf-rl", "c-cs188"], level: "متقدم", weeks: "مستمر" },
    { id: "a-prompt", kind: "apply", title: "هندسة الأوامر Prompt Engineering", icon: "pen", tagline: "تتكلم مع الـ AI صح", desc: "تكتب أوامر احترافية تطلعلك النتيجة اللي في دماغك بالظبط.", courseIds: ["c-pe-dev", "c-pe-chatgpt", "c-learn-prompt", "c-kaggle-genai"], level: "مبتدئ", weeks: "أسبوعان" },
    { id: "a-claude", kind: "apply", title: "كلود كود والبرمجة بالـ AI", icon: "terminal", tagline: "الـ AI بيشتغل جوه مشروعك", desc: "تستخدم Claude Code وأدوات البرمجة الذكية تبني أسرع وتصحّح كودك.", courseIds: ["c-claude-code"], level: "متقدم", weeks: "أسبوعان" },
    { id: "a-auto", kind: "apply", title: "الأوتوميشن وسير العمل", icon: "gear", tagline: "أنظمة بتشتغل لوحدها", desc: "تبني سير عمل وأوتوميشن يشيل عنك الشغل المتكرر باستخدام n8n و Agents.", courseIds: ["c-n8n"], level: "متوسط", weeks: "أسبوعان" },
    { id: "a-biz", kind: "apply", title: "الـ AI للأعمال والتسويق", icon: "bars", tagline: "حملات أسرع وقرارات أدق", desc: "تولّد إعلانات وتحمل حملات وتحلّل نتائجها بالـ AI في وقت أقل.", courseIds: ["c-ms-genai", "c-google-genai"], level: "مبتدئ", weeks: "أسبوعان" },
    { id: "a-design", kind: "apply", title: "الـ AI للتصميم والمحتوى", icon: "palette", tagline: "إبداع أسرع بجودة أعلى", desc: "صور وثامبنيلز ومحتوى وسكربتات بمساعدة الـ AI — لكل المجالات الإبداعية.", courseIds: ["c-comfy", "c-midjourney", "c-elevenlabs"], level: "مبتدئ", weeks: "أسبوعان" },
  ],

  courses: [
    { id: "c-elements", title: "Elements of AI", provider: "جامعة هلسنكي", link: "https://www.elementsofai.com/", hours: 5, level: "مبتدئ", cert: "شهادة مجانية", type: "كورس", note: "أشهر كورس تأسيسي في العالم", tracks: ["t-foundations"], lessons: ["مقدمة: إيه الـ AI", "التعلّم الآلي ببساطة", "الشبكات العصبية", "الأخلاقيات والمجتمع", "مشروع: تطبيق فكرة AI"] },
    { id: "c-ai4e", title: "الذكاء الاصطناعي للجميع", provider: "Andrew Ng — Coursera", link: "https://www.coursera.org/learn/ai-for-everyone", hours: 6, level: "مبتدئ", cert: "شهادة اختيارية", type: "كورس", note: "اختار Audit للمحتوى المجاني", tracks: ["t-foundations"], lessons: ["إيه الـ AI وإيه مش عايزه", "بناء مشاريع AI", "الـ AI في الشركة", "التعامل المسؤول"] },
    { id: "c-edraak", title: "الذكاء الاصطناعي من أجل التوظيف", provider: "إدراك", link: "https://programs.edraak.org/", hours: 20, level: "مبتدئ", cert: "شهادة إتمام", type: "تخصص", note: "4 كورسات مترابطة بالعربية", tracks: ["t-foundations"], lessons: ["مدخل إلى الـ AI", "الـ AI التوليدي: المفاهيم", "الذكاء الاصطناعي في بيئة العمل", "هندسة الأوامر", "الأخلاقيات والتحديات"] },
    { id: "c-edraak-intro", title: "مقدمة إلى الذكاء الاصطناعي", provider: "إدراك", link: "https://www.edraak.org/", hours: 5, level: "مبتدئ", cert: "شهادة إتمام", type: "كورس", note: "بالعربية — شرح مبسط", tracks: ["t-foundations"], lessons: ["فلسفة الـ AI", "خوارزميات البحث", "الأنظمة الخبيرة", "التعلّم الآلي"] },
    { id: "c-mlcc", title: "Machine Learning Crash Course", provider: "Google", link: "https://developers.google.com/machine-learning/crash-course", hours: 15, level: "مبتدئ", cert: "تمارين وشارات", type: "كورس", note: "15 ساعة — أهم كورس تأسيسي", tracks: ["t-ml"], lessons: ["Linear Regression", "Logistic Regression", "Classification", "Neural Networks", "Embeddings", "Production ML"] },

    { id: "c-kaggle-intro", title: "Intro to Programming", provider: "Kaggle", link: "https://www.kaggle.com/learn/intro-to-programming", hours: 5, level: "مبتدئ", cert: "شهادة مجانية", type: "كورس", note: "لو تبدأ من الصفر تماماً", tracks: ["t-python"], lessons: ["المتغيرات والحساب", "الدوال", "أنواع البيانات", "الشروط", "القوائم"] },
    { id: "c-kaggle-python", title: "Python", provider: "Kaggle", link: "https://www.kaggle.com/learn/python", hours: 5, level: "مبتدئ", cert: "شهادة مجانية", type: "كورس", note: "أهم لغة لعلم البيانات", tracks: ["t-python"], lessons: ["Hello, Python", "الدوال", "Booleans والشروط", "القوائم", "الحلقات", "النصوص والقواميس", "المكتبات"] },
    { id: "c-kaggle-pandas", title: "Pandas", provider: "Kaggle", link: "https://www.kaggle.com/learn/pandas", hours: 4, level: "مبتدئ", cert: "شهادة مجانية", type: "كورس", note: "التعامل مع الجداول", tracks: ["t-python"], lessons: ["إنشاء وقراءة البيانات", "الفهرسة والاختيار", "التجميع والفرز", "الأنواع والقيم الناقصة"] },
    { id: "c-kaggle-viz", title: "Data Visualization", provider: "Kaggle", link: "https://www.kaggle.com/learn/data-visualization", hours: 4, level: "مبتدئ", cert: "شهادة مجانية", type: "كورس", note: "رسوم بيانية احترافية", tracks: ["t-python"], lessons: ["Line plots", "Bar charts", "Heatmaps", "Scatter plots", "التصميم للوضوح"] },
    { id: "c-kaggle-git", title: "Git و GitHub", provider: "GitHub Guides", link: "https://github.com/git-guides", hours: 3, level: "مبتدئ", cert: "دليل مجاني", type: "دليل", note: "أساسي لأي مبرمج", tracks: ["t-python"], lessons: ["المستودعات", "Commit و Branch", "الدمج", "العمل مع GitHub"] },
    { id: "c-kaggle-sql", title: "Intro to SQL", provider: "Kaggle", link: "https://www.kaggle.com/learn/intro-to-sql", hours: 4, level: "مبتدئ", cert: "شهادة مجانية", type: "كورس", note: "قواعد البيانات", tracks: ["t-python"], lessons: ["SELECT و FROM", "WHERE والشروط", "GROUP BY", "JOIN", "استعلامات متقدمة"] },
    { id: "c-cs50py", title: "CS50 لبرمجة بايثون", provider: "Harvard", link: "https://cs50.harvard.edu/python/", hours: 10, level: "مبتدئ", cert: "مجاني", type: "كورس", note: "من أقوى كورسات بايثون", tracks: ["t-python"], lessons: ["المتغيرات", "الشروط والحلقات", "الدوال", "الاستثناءات", "الملفات", "الاختبارات"] },
    { id: "c-colab", title: "Google Colab", provider: "Google", link: "https://colab.research.google.com/", hours: 2, level: "مبتدئ", cert: "أداة مجانية", type: "أداة", note: "بيئة كتابة كود + GPU مجاني", tracks: ["t-python"], lessons: ["أول نوتبوك", "تشغيل الكود", "استخدام GPU", "حفظ ومشاركة"] },
    { id: "c-ds", title: "علم البيانات Data Science", provider: "freeCodeCamp + Harvard", link: "https://www.freecodecamp.org/learn/data-analysis-with-python/", hours: 15, level: "متوسط", cert: "شهادة مجانية", type: "كورس", note: "تحليل كامل من البداية للنهاية", tracks: ["t-python"], lessons: ["تحليل البيانات ببايثون", "CS109 Data Science", "مشروع تحليل كامل"] },

    { id: "c-ml-spec", title: "Machine Learning Specialization", provider: "Andrew Ng — Coursera", link: "https://www.coursera.org/specializations/machine-learning-introduction", hours: 60, level: "مبتدئ", cert: "شهادة اختيارية", type: "تخصص", note: "3 كورسات — أهم مسار في المجال", tracks: ["t-ml"], lessons: ["الانحدار الخطي واللوجستي", "الشبكات العصبية", "أشجار القرار", "التعلّم غير الموجّه", "التوصيات والتعلّم المعزز"] },
    { id: "c-statquest", title: "StatQuest — شرح الخوارزميات", provider: "Josh Starmer — يوتيوب", link: "https://www.youtube.com/@statquest", hours: 20, level: "مبتدئ", cert: "بدون", type: "قناة", note: "أفضل شرح مرئي للخوارزميات", tracks: ["t-ml"], lessons: ["الانحدار الخطي", "اللوجستيك", "KNN", "أشجار القرار", "Random Forest", "XGBoost", "SVM", "K-Means"] },
    { id: "c-kaggle-iml", title: "Intermediate Machine Learning", provider: "Kaggle", link: "https://www.kaggle.com/learn/intermediate-machine-learning", hours: 4, level: "متوسط", cert: "شهادة مجانية", type: "كورس", note: "قيم ناقصة وتسريب بيانات", tracks: ["t-ml"], lessons: ["القيم الناقصة", "البيانات الفئوية", "خطوط الأنابيب", "تسريب البيانات", "التحقق المتقاطع"] },
    { id: "c-kaggle-fe", title: "Feature Engineering", provider: "Kaggle", link: "https://www.kaggle.com/learn/feature-engineering", hours: 4, level: "متوسط", cert: "شهادة مجانية", type: "كورس", note: "خصائص أفضل = نماذج أقوى", tracks: ["t-ml"], lessons: ["هندسة الخصائص", "الترميز", "اختيار الخصائص", "المتجهات"] },
    { id: "c-cs229", title: "Stanford CS229 — Machine Learning", provider: "Stanford", link: "https://cs229.stanford.edu/", hours: 24, level: "متقدم", cert: "محاضرات مجانية", type: "مادة جامعية", note: "العمق الرياضي الكامل", tracks: ["t-ml"], lessons: ["الانحدار والتصنيف", "SVM", "التعلّم غير الموجّه", "نظرية التعلّم", "التعزيز"] },
    { id: "c-100ml", title: "100 Page Machine Learning Book", provider: "Andriy Burkov", link: "https://themlbook.com", hours: 5, level: "متوسط", cert: "كتاب مجاني", type: "كتاب", note: "خلاصة المجال في 100 صفحة", tracks: ["t-ml"], lessons: ["مقدمة", "النماذج الخطية", "الشبكات العصبية", "التقييم", "التطبيق"] },

    { id: "c-fastai", title: "Practical Deep Learning for Coders", provider: "fast.ai", link: "https://course.fast.ai/", hours: 20, level: "متوسط", cert: "بدون", type: "كورس", note: "9 دروس × 90 دقيقة — تطبيقي أولاً", tracks: ["t-dl"], lessons: ["Building a model", "Deployment", "Neural net foundations", "NLP", "From-scratch model", "Random forests", "Convolutions", "Data ethics"] },
    { id: "c-karpathy", title: "Neural Networks: Zero to Hero", provider: "Andrej Karpathy", link: "https://karpathy.ai/zero-to-hero.html", hours: 10, level: "متوسط", cert: "بدون", type: "سلسلة", note: "من الـ backprop لحد بناء GPT", tracks: ["t-dl"], lessons: ["Backpropagation (micrograd)", "بناء شبكات عصبية", "بناء GPT من الصفر"] },
    { id: "c-3b1b-nn", title: "مقدمة الشبكات العصبية", provider: "3Blue1Brown", link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", hours: 2, level: "مبتدئ", cert: "بدون", type: "سلسلة", note: "شرح بصري عبقري", tracks: ["t-dl"], lessons: ["ما هي الشبكة العصبية", "الانحدار التدريجي", "Backpropagation", "الجبر الخطي"] },
    { id: "c-cs50ai", title: "CS50 للذكاء الاصطناعي ببايثون", provider: "Harvard", link: "https://cs50.harvard.edu/ai/", hours: 10, level: "مبتدئ", cert: "شهادة مجانية", type: "كورس", note: "بحث + تصنيف + NLP + تعلّم معزز", tracks: ["t-dl"], lessons: ["Search", "Knowledge", "Uncertainty", "Optimization", "Learning", "Neural Nets", "NLP"] },
    { id: "c-cs231n", title: "CS231n: الشبكات الالتفافية للرؤية", provider: "Stanford", link: "http://cs231n.stanford.edu/", hours: 15, level: "متقدم", cert: "محاضرات مجانية", type: "مادة جامعية", note: "المرجع الأساسي لرؤية الحاسوب", tracks: ["t-dl"], lessons: ["الالتفافية CNN", "التدريب والتحسين", "الهيكل المعماري", "كشف الأشياء", "Transfer Learning"] },
    { id: "c-dl-spec", title: "Deep Learning Specialization", provider: "DeepLearning.AI", link: "https://www.coursera.org/specializations/deep-learning", hours: 40, level: "متوسط", cert: "شهادة اختيارية", type: "تخصص", note: "5 كورسات — منهج متكامل", tracks: ["t-dl"], lessons: ["الشبكات العصبية العميقة", "تحسين النماذج", "بناء مشاريع", "الشبكات الالتفافية", "النماذج المتسلسلة"] },
    { id: "c-fcc-ml", title: "Machine Learning with Python", provider: "freeCodeCamp — TensorFlow", link: "https://www.freecodecamp.org/learn/machine-learning-with-python/", hours: 15, level: "متوسط", cert: "شهادة مجانية", type: "كورس", note: "CNN + NLP + RL", tracks: ["t-dl"], lessons: ["TensorFlow", "الخوارزميات الأساسية", "الشبكات العصبية", "CNN", "NLP مع RNN", "التعلّم المعزز"] },
    { id: "c-kaggle-dl", title: "Intro to Deep Learning", provider: "Kaggle", link: "https://www.kaggle.com/learn/intro-to-deep-learning", hours: 4, level: "مبتدئ", cert: "شهادة مجانية", type: "كورس", note: "TensorFlow و Keras", tracks: ["t-dl"], lessons: ["عصبون واحد", "شبكات عميقة", "الانحدار التدريجي", "Overfitting", "التصنيف الثنائي"] },
    { id: "c-kaggle-cv", title: "Computer Vision", provider: "Kaggle", link: "https://www.kaggle.com/learn/computer-vision", hours: 4, level: "متوسط", cert: "شهادة مجانية", type: "كورس", note: "بناء CNN من الصفر", tracks: ["t-dl"], lessons: ["المصنّف الالتفافية", "Convolution و ReLU", "Max Pooling", "Data Augmentation"] },

    { id: "c-hf-llm", title: "LLM Course — 12 فصل", provider: "Hugging Face", link: "https://huggingface.co/learn/llm-course", hours: 20, level: "متوسط", cert: "بدون", type: "كورس", note: "من الأساس للمتقدم", tracks: ["t-genai"], lessons: ["مكتبة Transformers", "التوليد والتصنيف", "التضمينات", "الضبط الدقيق", "بناء نماذج الاستدلال"] },
    { id: "c-cs224n", title: "CS224N: معالجة اللغة العميقة", provider: "Stanford", link: "http://web.stanford.edu/class/cs224n/", hours: 15, level: "متقدم", cert: "محاضرات مجانية", type: "مادة جامعية", note: "Transformers و Self-Attention", tracks: ["t-genai"], lessons: ["Word Vectors", "Neural Networks", "Backprop", "Transformers", "Question Answering"] },
    { id: "c-cohere", title: "LLM University", provider: "Cohere", link: "https://docs.cohere.com/docs/llmu", hours: 8, level: "مبتدئ", cert: "شارات", type: "كورس", note: "Embeddings + RAG + Fine-tuning", tracks: ["t-genai"], lessons: ["التضمينات", "البحث الدلالي", "RAG", "الضبط الدقيق", "النشر"] },
    { id: "c-nlp-spec", title: "NLP Specialization", provider: "DeepLearning.AI", link: "https://www.coursera.org/specializations/natural-language-processing", hours: 20, level: "متوسط", cert: "شهادة اختيارية", type: "تخصص", note: "4 كورسات NLP", tracks: ["t-genai"], lessons: ["تحليل المشاعر", "نمذجة اللغة", "الترجمة الآلية", "السؤال والجواب"] },
    { id: "c-pe-dev", title: "Prompt Engineering for Developers", provider: "DeepLearning.AI", link: "https://www.deeplearning.ai/short-courses/prompt-engineering-for-developers/", hours: 2, level: "مبتدئ", cert: "شهادة مجانية", type: "كورس قصير", note: "مع Andrew Ng", tracks: ["a-prompt"], lessons: ["مبادئ الأوامر", "التلخيص", "الاستدلال", "التحويل", "بناء Chatbot"] },
    { id: "c-pe-chatgpt", title: "ChatGPT Prompt Engineering", provider: "DeepLearning.AI", link: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", hours: 1, level: "مبتدئ", cert: "شهادة مجانية", type: "كورس قصير", note: "هندسة أوامر احترافية", tracks: ["a-prompt"], lessons: ["واجهة برمجة التطبيقات", "صياغة الأوامر", "بناء تطبيق"] },
    { id: "c-ms-genai", title: "Generative AI for Beginners — 22 درس", provider: "Microsoft", link: "https://github.com/microsoft/generative-ai-for-beginners", hours: 6, level: "مبتدئ", cert: "مستودع مجاني", type: "منهج", note: "نظري + تطبيقي مع كود", tracks: ["a-biz"], lessons: ["أساسيات الـ GenAI", "هندسة الأوامر", "البحث الدلالي", "RAG", "الوكلاء", "الخصوصية"] },
    { id: "c-google-genai", title: "Introduction to Generative AI", provider: "Google Cloud", link: "https://www.cloudskillsboost.google/", hours: 1, level: "مبتدئ", cert: "شارة مجانية", type: "كورس قصير", note: "45 دقيقة + Badge", tracks: ["a-biz"], lessons: ["إيه GenAI", "النماذج اللغوية الكبيرة", "AI المسؤول"] },
    { id: "c-kaggle-genai", title: "5-Day Gen AI Intensive", provider: "Google × Kaggle", link: "https://www.kaggle.com/learn-guide/5-day-genai", hours: 5, level: "متوسط", cert: "دليل مجاني", type: "دليل", note: "LLM + Embeddings + Agents + MLOps", tracks: ["a-prompt"], lessons: ["النماذج التأسيسية والأوامر", "التضمينات وقواعد المتجهات", "الوكلاء", "MLOps للـ GenAI"] },
    { id: "c-rag", title: "Building Agentic RAG with LlamaIndex", provider: "DeepLearning.AI", link: "https://www.deeplearning.ai/short-courses/building-agentic-rag-with-llamaindex/", hours: 2, level: "متوسط", cert: "شهادة مجانية", type: "كورس قصير", note: "RAG ذكي على بياناتك", tracks: ["t-genai"], lessons: ["بناء Router", "استدعاء الأدوات", "وكيل بحث", "التعامل مع عدة مستندات"] },
    { id: "c-langchain", title: "Functions, Tools and Agents", provider: "DeepLearning.AI", link: "https://www.deeplearning.ai/short-courses/functions-tools-agents-langchain/", hours: 2, level: "متوسط", cert: "شهادة مجانية", type: "كورس قصير", note: "Tool calling", tracks: ["t-genai"], lessons: ["استدعاء الدوال", "بناء الأدوات", "الوكلاء"] },
    { id: "c-finetune", title: "Finetuning Large Language Models", provider: "DeepLearning.AI", link: "https://www.deeplearning.ai/short-courses/finetuning-large-language-models/", hours: 2, level: "متوسط", cert: "شهادة مجانية", type: "كورس قصير", note: "ضبط نماذج مخصصة", tracks: ["t-genai"], lessons: ["اختيار النموذج", "تجهيز البيانات", "الضبط والتقييم"] },
    { id: "c-hf-agents", title: "Agents Course — 4 وحدات + شهادة", provider: "Hugging Face", link: "https://huggingface.co/learn/agents-course", hours: 8, level: "متوسط", cert: "شهادة مجانية", type: "كورس", note: "smolagents + LangGraph + LlamaIndex", tracks: ["t-genai"], lessons: ["مقدمة عن الوكلاء", "smolagents", "LlamaIndex", "LangGraph", "مشروع التخرج"] },
    { id: "c-langgraph", title: "AI Agents in LangGraph", provider: "DeepLearning.AI", link: "https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/", hours: 2, level: "متوسط", cert: "شهادة مجانية", type: "كورس قصير", note: "تحكم كامل في تدفق الوكيل", tracks: ["t-genai"], lessons: ["بناء وكيل بلغة Python", "إعادة بنائه بـ LangGraph", "التحكم في الحالة"] },
    { id: "c-crewai", title: "Multi AI Agent Systems", provider: "DeepLearning.AI", link: "https://www.deeplearning.ai/short-courses/multi-ai-agent-systems-with-crewai/", hours: 2, level: "متوسط", cert: "شهادة مجانية", type: "كورس قصير", note: "فرق وكلاء متعددة", tracks: ["t-genai"], lessons: ["تصميم الفرق", "الأدوار والمهام", "التعاون بين الوكلاء"] },
    { id: "c-fsdl", title: "LLM Bootcamp", provider: "Full Stack Deep Learning", link: "https://fullstackdeeplearning.com/", hours: 5, level: "متوسط", cert: "بدون", type: "معسكر", note: "إطلاق تطبيق LLM في ساعة", tracks: ["t-genai"], lessons: ["Prompt Engineering", "LLMOps", "واجهة المستخدم", "إطلاق التطبيق"] },

    { id: "c-mlops-ml", title: "MLOps Course", provider: "Made With ML", link: "https://madewithml.com/courses/mlops/", hours: 15, level: "متقدم", cert: "بدون", type: "كورس", note: "تصميم ← تطوير ← نشر ← مراقبة", tracks: ["t-mlops"], lessons: ["تصميم النظام", "التطوير", "النشر", "المراقبة والتكرار"] },
    { id: "c-mlops-zoom", title: "MLOps Zoomcamp", provider: "DataTalks.Club", link: "https://github.com/DataTalksClub/mlops-zoomcamp", hours: 12, level: "متقدم", cert: "شهادة مجانية", type: "معسكر", note: "MLflow + Docker + AWS + Prometheus", tracks: ["t-mlops"], lessons: ["تتبع التجارب", "الحاويات", "النشر", "المراقبة", "المشروع النهائي"] },
    { id: "c-mle-production", title: "ML Engineering for Production", provider: "DeepLearning.AI", link: "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops", hours: 20, level: "متقدم", cert: "شهادة اختيارية", type: "تخصص", note: "MLOps متقدم", tracks: ["t-mlops"], lessons: ["نشر النماذج", "معالجة البيانات", "النمذجة", "استراتيجيات النشر"] },

    { id: "c-hf-cv", title: "Computer Vision Course", provider: "Hugging Face", link: "https://huggingface.co/learn/computer-vision-course", hours: 10, level: "متقدم", cert: "بدون", type: "كورس", note: "من الأساس لأحدث نماذج الرؤية", tracks: ["t-advanced"], lessons: ["أساسيات الرؤية", "الشبكات الالتفافية", "Vision Transformers", "النماذج متعددة الوسائط", "النماذج التوليدية"] },
    { id: "c-hf-rl", title: "Deep RL Course", provider: "Hugging Face", link: "https://huggingface.co/learn/deep-rl-course", hours: 8, level: "متقدم", cert: "شهادة مجانية", type: "كورس", note: "التعلّم المعزز من الصفر", tracks: ["t-advanced"], lessons: ["Q-Learning", "Policy Gradient", "Actor-Critic", "التحديات"] },
    { id: "c-cs188", title: "UC Berkeley CS188 — AI", provider: "Berkeley", link: "https://inst.eecs.berkeley.edu/~cs188/", hours: 15, level: "متقدم", cert: "مادة مجانية", type: "مادة جامعية", note: "الذكاء الاصطناعي الكلاسيكي", tracks: ["t-advanced"], lessons: ["البحث", "الألعاب", "التعلّم الآلي", "الاستدلال البايزي", "التعلّم المعزز"] },
    { id: "c-learn-prompt", title: "Learn Prompting", provider: "موسوعة مجانية", link: "https://learnprompting.org/", hours: 6, level: "مبتدئ", cert: "بدون", type: "مرجع", note: "المرجع الأشمل لهندسة الأوامر", tracks: ["a-prompt"], lessons: ["الأساسيات", "تقنيات متقدمة", "مواضيع متخصصة"] },

    { id: "c-claude-code", title: "Claude Code — البرمجة بالـ AI", provider: "Anthropic", link: "https://docs.anthropic.com/en/docs/claude-code", hours: 4, level: "متقدم", cert: "أداة", type: "أداة", note: "استخدم Claude جوه محرر الكود", tracks: ["a-claude"], lessons: ["التثبيت والإعداد", "أول أمر", "فهم الكودباز", "بناء ميزة", "تصحيح الأخطاء"] },
    { id: "c-n8n", title: "n8n — أتمتة سير العمل", provider: "n8n", link: "https://n8n.io/", hours: 4, level: "متوسط", cert: "أداة", type: "أداة", note: "اربط أي حاجة ببعض بدون كود", tracks: ["a-auto"], lessons: ["أول Workflow", "العُقد Nodes", "التفرع والشروط", "ربط الـ APIs", "نشر الأتمتة"] },
    { id: "c-comfy", title: "ComfyUI — توليد صور احترافي", provider: "ComfyUI", link: "https://github.com/comfyanonymous/ComfyUI", hours: 4, level: "متوسط", cert: "أداة", type: "أداة", note: "Stable Diffusion بشكل احترافي", tracks: ["a-design"], lessons: ["التثبيت", "أول workflow", "المُحكمات", "بناء لوحة مخصصة"] },
    { id: "c-midjourney", title: "Midjourney — توليد صور", provider: "Midjourney", link: "https://www.midjourney.com/", hours: 2, level: "مبتدئ", cert: "أداة", type: "أداة", note: "صور خيالية من نص", tracks: ["a-design"], lessons: ["أول أمر", "التحكم في النسبة", "الإضاءة والأسلوب", "بناء مكتبة أوامر"] },
    { id: "c-elevenlabs", title: "ElevenLabs — توليد صوت", provider: "ElevenLabs", link: "https://elevenlabs.io/", hours: 2, level: "مبتدئ", cert: "أداة", type: "أداة", note: "استنساخ وتوليد صوت واقعي", tracks: ["a-design"], lessons: ["توليد الصوت", "استنساخ الصوت", "تصميم الصوت", "الدمج مع المحتوى"] },

    /* --- الرياضيات --- */
    { id: "c-math-la", title: "الجبر الخطي", provider: "3Blue1Brown + Imperial College", link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", hours: 6, level: "مبتدئ", cert: "شهادة اختيارية", type: "دورة", note: "Essence of Linear Algebra", tracks: ["t-math"], lessons: ["المتجهات", "المصفوفات", "الضرب والتحويلات", "القيم الذاتية", "التطبيق في الشبكات"] },
    { id: "c-math-calc", title: "التفاضل والتكامل", provider: "3Blue1Brown + Khan Academy", link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", hours: 6, level: "مبتدئ", cert: "بدون", type: "دورة", note: "أساس الانحدار التدريجي", tracks: ["t-math"], lessons: ["النهايات", "المشتقات", "قاعدة السلسلة", "التدرج", "الانحدار التدريجي"] },
    { id: "c-math-prob", title: "الاحتمالات والإحصاء", provider: "Khan Academy", link: "https://www.khanacademy.org/math/statistics-probability/probability-library", hours: 8, level: "مبتدئ", cert: "بدون", type: "دورة", note: "الأساس الإحصائي للـ ML", tracks: ["t-math"], lessons: ["الاحتمال الشرطي", "التوزيعات", "بايز", "المتوسط والانحراف", "اختبارات الدلالة"] },
    { id: "c-math-book", title: "كتاب Mathematics for Machine Learning", provider: "مطبعة كامبريدج — مجاني", link: "https://mml-book.github.io/", hours: 10, level: "متوسط", cert: "كتاب مجاني", type: "كتاب", note: "PDF مجاني + كود", tracks: ["t-math"], lessons: ["الجبر الخطي", "التحليل الرياضي", "الاحتمالات", "التحسين"] },
    { id: "c-numpy", title: "NumPy من الصفر", provider: "freeCodeCamp", link: "https://www.youtube.com/watch?v=QUT1VHiLmmI", hours: 2, level: "مبتدئ", cert: "بدون", type: "كورس", note: "مكتبة الأرقام الأساسية لكل علوم البيانات والـ ML", tracks: ["t-math"], lessons: ["المصفوفات", "العمليات", "الفهرسة والشريح", "الدوال الرياضية", "تطبيق عملي"] },
    { id: "c-freelance", title: "العمل الحر وصناعة الدخل بالـ AI", provider: "مسار تطبيقي", link: "https://www.upwork.com/", hours: 8, level: "متقدم", cert: "مهارة عملية", type: "مسار", note: "من أول عميل لحد دخل ثابت", tracks: ["a-biz"], lessons: ["تحديد خدمتك", "تسعير الخدمة", "كتابة العرض", "جلب العملاء", "إدارة العلاقات"] },

    /* --- البرمجة بالـ AI (إضافة) --- */
    { id: "c-copilot", title: "GitHub Copilot — البرمجة بالـ AI", provider: "GitHub", link: "https://github.com/features/copilot", hours: 3, level: "متوسط", cert: "أداة", type: "أداة", note: "اقتراحات كود جوه محررك", tracks: ["a-claude"], lessons: ["التثبيت والإعداد", "اقتراحات الكود", "الاختصارات", "مراجعة الكود", "أفضل الممارسات"] },
    { id: "c-cursor", title: "Cursor — محرر الكود الذكي", provider: "Anysphere", link: "https://www.cursor.com/", hours: 3, level: "متقدم", cert: "أداة", type: "أداة", note: "محرر بالـ AI Agents", tracks: ["a-claude"], lessons: ["الواجهة", "الأوامر", "الوكيل Agent", "إعادة الهيكلة", "بناء مشروع"] },
    { id: "c-v0", title: "v0 — توليد واجهات من نص", provider: "Vercel", link: "https://v0.dev/", hours: 2, level: "مبتدئ", cert: "أداة", type: "أداة", note: "وصف → واجهة React", tracks: ["a-claude"], lessons: ["أول وصف", "تعديل التصميم", "تصدير الكود", "دمج مع مشروعك"] },
    { id: "c-codex", title: "OpenAI Codex — وكيل برمجة", provider: "OpenAI", link: "https://chatgpt.com/", hours: 3, level: "متقدم", cert: "أداة", type: "أداة", note: "وكيل ينفّذ مهام في مستودعك", tracks: ["a-claude"], lessons: ["إعداد الوكيل", "كتابة المهمة", "مراجعة الـ PR", "دمج مع GitHub"] },

    /* --- الأتمتة (إضافة) --- */
    { id: "c-zapier", title: "Zapier — أتمتة بلا كود", provider: "Zapier", link: "https://zapier.com/", hours: 3, level: "مبتدئ", cert: "أداة", type: "أداة", note: "اربط تطبيقاتك ببعض", tracks: ["a-auto"], lessons: ["أول Zap", "المُشغّلات والإجراءات", "المسارات المتفرعة", "ربط الـ AI"] },
    { id: "c-make", title: "Make — أتمتة مرئية متقدمة", provider: "Make", link: "https://www.make.com/", hours: 3, level: "متقدم", cert: "أداة", type: "أداة", note: "سيناريوهات معقدة", tracks: ["a-auto"], lessons: ["أول سيناريو", "المتغيرات", "الوحدات", "التكامل مع AI"] },
  ],

  certs: [
    { title: "Elements of AI", issuer: "جامعة هلسنكي", link: "https://www.elementsofai.com/", cost: "مجانية", stage: "أساسيات" },
    { title: "شهادات Kaggle", issuer: "Kaggle", link: "https://www.kaggle.com/learn", cost: "مجانية", stage: "كل المسارات" },
    { title: "CS50 AI Certificate", issuer: "Harvard", link: "https://cs50.harvard.edu/ai/", cost: "مجانية", stage: "Deep Learning" },
    { title: "Machine Learning with Python", issuer: "freeCodeCamp", link: "https://www.freecodecamp.org/learn/machine-learning-with-python/", cost: "مجانية", stage: "Deep Learning" },
    { title: "AI Fundamentals", issuer: "IBM SkillsBuild", link: "https://skills.yourlearning.ibm.com/", cost: "مجانية (Credly)", stage: "أساسيات" },
    { title: "Introduction to Generative AI", issuer: "Google Cloud", link: "https://www.cloudskillsboost.google/", cost: "شارة مجانية", stage: "GenAI" },
    { title: "Agents Course Certificate", issuer: "Hugging Face", link: "https://huggingface.co/learn/agents-course", cost: "مجانية", stage: "الوكلاء" },
    { title: "MLOps Zoomcamp", issuer: "DataTalks.Club", link: "https://github.com/DataTalksClub/mlops-zoomcamp", cost: "مجانية", stage: "MLOps" },
    { title: "Deep RL Certificate", issuer: "Hugging Face", link: "https://huggingface.co/learn/deep-rl-course", cost: "مجانية", stage: "متقدم" },
  ],

  tools: [
    { name: "Google Colab", use: "كتابة كود + GPU مجاني", link: "https://colab.research.google.com/", tag: "بيئة عمل" },
    { name: "Kaggle Notebooks", use: "بيئة + مسابقات + بيانات", link: "https://www.kaggle.com/", tag: "منصة" },
    { name: "VS Code", use: "محرر الأكواد", link: "https://code.visualstudio.com/", tag: "محرر" },
    { name: "GitHub", use: "استضافة مشاريعك", link: "https://github.com/", tag: "استضافة" },
    { name: "Hugging Face", use: "نماذج + نشر Spaces", link: "https://huggingface.co/", tag: "نماذج" },
    { name: "Gradio", use: "نشر تطبيقات AI", link: "https://gradio.app/", tag: "نشر" },
    { name: "Streamlit", use: "لوحات وتطبيقات", link: "https://streamlit.io/", tag: "نشر" },
    { name: "Docker", use: "تغليف النماذج", link: "https://www.docker.com/", tag: "إنتاج" },
    { name: "Weights & Biases", use: "تتبّع التجارب", link: "https://wandb.ai/", tag: "تجارب" },
    { name: "LM Studio", use: "تشغيل نماذج محلياً", link: "https://lmstudio.ai/", tag: "محلي" },
    { name: "Ollama", use: "تشغيل LLM محلياً", link: "https://ollama.com/", tag: "محلي" },
    { name: "n8n", use: "أتمتة سير العمل", link: "https://n8n.io/", tag: "أتمتة" },
  ],

  faqs: [
    { q: "المنصة مجانية فعلاً؟", a: "أيوه — كل الكورسات والمسارات والشهادات مجانية 100%. بنجمّع لك أفضل المصادر المجانية العالمية في مكان واحد مرتب." },
    { q: "مش محتاج خبرة سابقة؟", a: "لا — مسار الأساسيات بيبدأ معاك من أول خطوة، ومفيش أي شرط قبله." },
    { q: "التقدم بيتحفظ إزاي؟", a: "على جهازك بالتحديد (localStorage)، يعني تقدّمك يفضل محفوظ حتى لو قفلت الصفحة. ولو عندك أكتر من جهاز تقدر تصدّر وتستورد تقدّمك كملف." },
    { q: "شهادات الإتمام منين؟", a: "الشهادات من الجهة المقدّمة للكورس (Helsinki, Kaggle, Harvard, freeCodeCamp, IBM, Google, Hugging Face...). كل واحدة ليها رابط مباشر." },
    { q: "طول الرحلة قد إيه؟", a: "59 كورس وحوالي 550 ساعة تعلم موزّعة على 12 شهر — بمعدل 10–15 ساعة أسبوعياً." },
    { q: "أبدأ منين بالظبط؟", a: "ابدأ بمسار الأساسيات. وبعدها اسأل نفسك: عايز الـ AI يبقى شغلي الأساسي (مسارات التخصص)، ولا عايز أحطّه في شغلي الحالي (مسارات التطبيق)؟" },
  ],

  resources: [
    { name: "Papers with Code", link: "https://paperswithcode.com/", tag: "أبحاث" },
    { name: "arXiv", link: "https://arxiv.org/", tag: "أوراق بحثية" },
    { name: "Towards Data Science", link: "https://towardsdatascience.com/", tag: "مقالات" },
    { name: "StatQuest — يوتيوب", link: "https://www.youtube.com/@statquest", tag: "شرح" },
    { name: "3Blue1Brown", link: "https://www.youtube.com/@3blue1brown", tag: "رياضيات" },
    { name: "freeCodeCamp", link: "https://www.youtube.com/@freecodecamp", tag: "دورات" },
    { name: "Hugging Face Blog", link: "https://huggingface.co/blog", tag: "أخبار" },
    { name: "إدراك", link: "https://www.edraak.org/", tag: "عربي" },
    { name: "رواق", link: "https://rwaq.org/", tag: "عربي" },
    { name: "منصة مَعارف", link: "https://www.m3aarf.com/", tag: "عربي" },
    { name: "مبادرة مسار", link: "https://masar-bfeef.web.app/", tag: "عربي" },
    { name: "DL بالعربي", link: "https://dlarabic.com/ai-academy/tracks/", tag: "عربي" },
  ],

  rules: [
    "نفّذ كل حاجة بنفسك — المشاهدة بدون كود = لا شيء.",
    "مفيش مسار تتجاوزه غير لما تعمل مشروعه.",
    "علّم 5 ساعات في الأسبوع على الأقل — الاستمرارية أهم من السرعة.",
    "لخّص كل موضوع في ملاحظاتك.",
    "علّم غيرك — شرحك لغيرك هو أقوى تثبيت للمعلومة.",
  ],
};
