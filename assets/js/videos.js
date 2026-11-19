/* =========================================================
   رقم واحد — محتوى الفيديو المدمج
   كل كورس: فيديوهات/قوائم يوتيوب تشتغل جوه المنصة نفسها
   type: "playlist" = قائمة تشغيل | "video" = فيديو واحد
   ========================================================= */

const COURSE_VIDEOS = {
  /* الرياضيات */
  "c-math-la": [
    { type: "playlist", id: "PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", t: "Essence of Linear Algebra — 3Blue1Brown (16 فيديو)", thumb: "https://i.ytimg.com/vi/fNk_zzaMoSs/hqdefault.jpg" },
  ],
  "c-math-calc": [
    { type: "playlist", id: "PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", t: "Essence of Calculus — 3Blue1Brown (12 فيديو)", thumb: "https://i.ytimg.com/vi/WUvTyaaNkzM/hqdefault.jpg" },
  ],
  "c-math-prob": [
    { type: "playlist", id: "PL1328115D3D8A2566", t: "Statistics — Khan Academy (67 فيديو)" },
    { type: "playlist", id: "PLU5aQXLWR3_xDN0M2ZeZ_zHIia0e42_3O", t: "Random Variables & Probability Distributions — Khan Academy" },
  ],
  "c-numpy": [
    { type: "video", id: "QUT1VHiLmmI", t: "NumPy Tutorial for Beginners — freeCodeCamp (ساعة)", thumb: "https://i.ytimg.com/vi/QUT1VHiLmmI/hqdefault.jpg" },
  ],

  /* أساسيات */
  "c-3b1b-nn": [
    { type: "playlist", id: "PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", t: "But what is a Neural Network? — 3Blue1Brown (9 فيديوهات)", thumb: "https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg" },
  ],
  "c-cs50ai": [
    { type: "video", id: "5NgNicANyqM", t: "Harvard CS50 AI with Python — الكورس الكامل في فيديو واحد", thumb: "https://i.ytimg.com/vi/5NgNicANyqM/hqdefault.jpg" },
  ],
  "c-mlcc": [
    { type: "playlist", id: "PLOU2XLYxmsILTKLltkh859KJ9BizDvd_S", t: "Machine Learning Crash Course — Google" },
  ],

  /* تعلم آلة */
  "c-statquest": [
    { type: "playlist", id: "PLblh5JKOoLUIcdlgu78MnlATeyx4cEVeR", t: "Machine Learning Fundamentals — StatQuest" },
  ],
  "c-fcc-ml": [
    { type: "video", id: "tPYj3fFJGjk", t: "TensorFlow 2.0 Complete Course — freeCodeCamp (7 ساعات)", thumb: "https://i.ytimg.com/vi/tPYj3fFJGjk/hqdefault.jpg" },
  ],
  "c-ml-spec": [
    { type: "playlist", id: "PLkDaE6sCZn6FNC6YRfRQc_FbeQrF8BwGI", t: "Machine Learning Specialization — Andrew Ng" },
  ],

  /* تعلم عميق */
  "c-fastai": [
    { type: "video", id: "0oyCUWLL_fU", t: "Practical Deep Learning for Coders — fast.ai Full Course", thumb: "https://i.ytimg.com/vi/0oyCUWLL_fU/hqdefault.jpg" },
  ],
  "c-karpathy": [
    { type: "playlist", id: "PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ", t: "Neural Networks: Zero to Hero — Andrej Karpathy (10 فيديوهات)", thumb: "https://i.ytimg.com/vi/VMj-3S1tku0/hqdefault.jpg" },
  ],
};
