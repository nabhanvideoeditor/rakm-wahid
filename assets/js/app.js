/* =========================================================
   weston — منطق المنصة
   ========================================================= */

(function () {
  "use strict";

  const KEY = "weston-progress-v1";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ---------- الحالة ---------- */
  function progressKey() {
    try { if (typeof AUTH !== "undefined" && AUTH.progressKey) return AUTH.progressKey(); } catch (e) {}
    return KEY;
  }
  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(progressKey()));
      if (d && typeof d === "object") return { done: d.done || {}, plan: d.plan || {}, theme: d.theme || "dark" };
    } catch (e) {}
    return { done: {}, plan: {}, theme: "dark" };
  }
  let state = load();
  function save() {
    try { localStorage.setItem(progressKey(), JSON.stringify(state)); } catch (e) {}
    if (typeof AUTH !== "undefined" && AUTH.pushProgress) { try { AUTH.pushProgress(state); } catch (e) {} }
  }
  function reloadState() { state = load(); }

  /* ---------- مراجع ---------- */
  const courseById = {};
  ACADEMY.courses.forEach((c) => (courseById[c.id] = c));
  const ALL = ACADEMY.courses;
  const ALL_LESSONS = [];
  ALL.forEach((c) => (c.lessons || []).forEach((t, i) => ALL_LESSONS.push({ id: c.id + "-" + i, course: c, title: t })));

  const totalCourses = () => ALL.length;
  const totalLessons = () => ALL_LESSONS.length;
  const totalHours = () => ALL.reduce((a, c) => a + (c.hours || 0), 0);
  const doneLessons = () => ALL_LESSONS.filter((l) => state.done[l.id]).length;
  const doneCourses = () => ALL.filter((c) => (c.lessons || []).length > 0 && c.lessons.every((t, i) => state.done[c.id + "-" + i])).length;
  const doneHours = () => ALL.filter((c) => (c.lessons || []).length > 0 && c.lessons.every((t, i) => state.done[c.id + "-" + i])).reduce((a, c) => a + (c.hours || 0), 0);
  const percent = () => { const t = totalLessons(); return t ? Math.round((doneLessons() / t) * 100) : 0; };

  function trackProgress(t) {
    let total = 0, done = 0;
    t.courseIds.forEach((id) => {
      const c = courseById[id]; if (!c) return;
      (c.lessons || []).forEach((_, i) => { total++; if (state.done[id + "-" + i]) done++; });
    });
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  /* ---------- لوجو WESTON ---------- */
  function logoSVG(id) {
    return '<svg viewBox="0 0 96 56" class="weston-logo" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="96" y2="56" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#22c55e"/><stop offset=".55" stop-color="#34d399"/><stop offset="1" stop-color="#4ade80"/></linearGradient></defs>' +
      '<g stroke="url(#' + id + ')" stroke-width="1.1" opacity=".5"><path d="M8 8 L48 20 L88 8"/><path d="M30 48 L48 20 L66 48"/><path d="M8 8 L66 48"/><path d="M88 8 L30 48"/></g>' +
      '<path d="M8 8 L30 48 L48 20 L66 48 L88 8" stroke="url(#' + id + ')" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none" class="wl-main"/>' +
      '<circle cx="8" cy="8" r="4" fill="#2f9e5f" class="wl-n"/><circle cx="30" cy="48" r="4.6" fill="#3fae6c" class="wl-n"/><circle cx="48" cy="20" r="4.2" fill="#52c07c" class="wl-n"/><circle cx="66" cy="48" r="4.6" fill="#6ed695" class="wl-n"/><circle cx="88" cy="8" r="4" fill="#4ade80" class="wl-n"/></svg>';
  }

  /* ---------- أيقونات ---------- */
  /* ---------- مكتبة أيقونات خطية (بديل الإيموجي) ---------- */
  const ICONS = {
    infinity: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12c0-1.4 1.1-2.5 2.4-2.5 2.1 0 2.4 5 4.5 5 1.3 0 2.4-1.1 2.4-2.5S16.7 9.5 15.4 9.5c-2 0-2.4 5-4.5 5-1.3 0-2.4-1.1-2.4-2.5Z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
    award: '<circle cx="12" cy="9" r="5"/><path d="m14.5 13.2 1.8 7-4.3-2.4-4.3 2.4 1.8-7"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5A2.5 2.5 0 0 1 4 20.5Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.4 2"/>',
    chart: '<path d="M4 4v16h16"/><path d="m6.5 16.5 4-4 3 2.5 4.5-5.5"/>',
    bars: '<path d="M4 20h16"/><path d="M7 20v-6M12 20V8M17 20v-9"/>',
    sigma: '<path d="M17 5H7l6 7-6 7h10"/>',
    sprout: '<path d="M12 20v-7"/><path d="M12 13c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5Z"/><path d="M12 13c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z"/>',
    python: '<path d="M12 3c-2.5 0-4 1.1-4 3v2h8v1H6.5C5 9 4 10.5 4 12.5S5 16 6.5 16H9v-3c0-1.7 1.3-3 3-3h5c1.4 0 2.5-1.1 2.5-2.5V6c0-1.9-1.5-3-4-3h-2.5Z"/><circle cx="10" cy="6" r=".8"/><path d="M12 21c2.5 0 4-1.1 4-3v-2h-8v-1h9.5c1.5 0 2.5-1.5 2.5-3.5S19 8.5 17.5 8.5H15v3c0 1.7-1.3 3-3 3H7c-1.4 0-2.5 1.1-2.5 2.5v2c0 1.9 1.5 3 4 3h3.5Z"/><circle cx="14" cy="18" r=".8"/>',
    bot: '<rect x="5" y="8" width="14" height="11" rx="2.5"/><path d="M12 8V5"/><circle cx="12" cy="4" r="1"/><circle cx="9.5" cy="13" r=".9"/><circle cx="14.5" cy="13" r=".9"/><path d="M9.5 16.5h5"/>',
    brain: '<path d="M9.5 4a2.5 2.5 0 0 0-2.5 2.5v.6A2.5 2.5 0 0 0 5.5 12 2.5 2.5 0 0 0 7 16.5v1A2.5 2.5 0 0 0 9.5 20h1V4h-1Z"/><path d="M14.5 4a2.5 2.5 0 0 1 2.5 2.5v.6A2.5 2.5 0 0 1 18.5 12 2.5 2.5 0 0 1 17 16.5v1a2.5 2.5 0 0 1-2.5 2.5h-1V4h1Z"/>',
    sparkles: '<path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4Z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/>',
    rocket: '<path d="M12 3c3.5 2.5 5 6 5 9l-2.5 2.5h-5L7 12c0-3 1.5-6.5 5-9Z"/><circle cx="12" cy="10" r="1.6"/><path d="M9.5 14.5C7 16 5.5 18.5 5 21c2.5-.5 5-2 6.5-4.5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    pen: '<path d="M15.5 4.5 19.5 8.5 8.5 19.5H4.5v-4L15.5 4.5Z"/><path d="m13.5 6.5 4 4"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="m7 9 3 3-3 3"/><path d="M13 15h4"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18"/>',
    briefcase: '<rect x="3" y="7.5" width="18" height="12" rx="2.5"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5"/><path d="M3 12.5h18"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.6 0 2.2-1 1.6-2.3-.7-1.4.2-2.7 1.8-2.7H17a3 3 0 0 0 3-3c0-5-3.6-10-8-10Z"/><circle cx="7.5" cy="10.5" r=".9"/><circle cx="12" cy="7.5" r=".9"/><circle cx="16.5" cy="10.5" r=".9"/>',
    eye: '<path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.8"/>',
    message: '<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z"/>',
    zap: '<path d="M13 3 5 13.5h5L11 21l8-10.5h-5L13 3Z"/>',
    code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    shield: '<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8.5 6 3.5-6 3.5v-7Z"/>',
    star: '<path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 9.7l5.4-.8L12 4Z"/>',
    flame: '<path d="M12 3c3 3.5 5.5 6 5.5 9.5a5.5 5.5 0 0 1-11 0C6.5 9 9 6.5 12 3Z"/>',
    bolt: '<path d="M13 3 5 13.5h5L11 21l8-10.5h-5L13 3Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5.5a3.5 3.5 0 0 1 0 5.6"/><path d="M17 20a6.5 6.5 0 0 0-2-4.7"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="10" y="10" width="4" height="4"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
    link: '<path d="M10 14a4 4 0 0 0 6 .4l3-3a4 4 0 0 0-5.6-5.6L12 7.2"/><path d="M14 10a4 4 0 0 0-6-.4l-3 3a4 4 0 0 0 5.6 5.6L12 16.8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    dot: '<circle cx="12" cy="12" r="3"/>',
    map: '<path d="m9 4 6 2 6-2v14l-6 2-6-2-6 2V6l6-2Z"/><path d="M9 4v14M15 6v14"/>',
    flag: '<path d="M6 21V4"/><path d="M6 4c3-1.5 5 1.5 8 0s4-1 4-1v9s-1-.5-4 1-5-1.5-8 0"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
    download: '<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/>',
    upload: '<path d="M12 21V9"/><path d="m7 13 5-5 5 5"/><path d="M4 4h16"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4h-4"/>',
    trash: '<path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M6 7l1 13h10l1-13"/>',
    key: '<circle cx="8" cy="8" r="4"/><path d="m11 11 9 9-3 3-2-2-2 2-2-2 2-2-2-2 2-2Z"/>',
    image: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-5 4 4 3-3 4 4"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0"/><path d="M12 17v4"/>',
    edit: '<path d="M4 20h16"/><path d="M14.5 4.5 19.5 9.5 9 20H4v-5L14.5 4.5Z"/>',
    cap: '<path d="M12 4 2.5 9 12 14l9.5-5L12 4Z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/><path d="M21.5 9v5"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 0 0-5.6 4.9L4 16.3V20h3.7l4.9-4.9a4 4 0 0 0 4.9-5.6l-2.8 2.8-2.4-.7-.7-2.4 2.3-2.7Z"/>',
    scale: '<path d="M12 3v18"/><path d="M5 7h14"/><path d="M7 7l-3 6h6L7 7ZM17 7l-3 6h6l-3-6Z"/><path d="M9 21h6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/>',
    pie: '<path d="M12 3a9 9 0 1 0 9 9h-9V3Z"/><path d="M15 2.5A9 9 0 0 1 21.5 9H15V2.5Z"/>',
    inbox: '<path d="M3 13h5l1.5 2.5h5L16 13h5"/><path d="M3 13l2.5-8h13L21 13v6H3v-6Z"/>',
  };

  function icon(name, size) {
    const s = size || 20;
    const body = ICONS[name] || ICONS.dot;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
  }

  const I = {
    check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    ext: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>',
    arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
    award: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/></svg>',
    chev: '<svg class="fi" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    clock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  };

  /* ---------- توست ---------- */
  let toastT;
  function toast(msg) {
    if (typeof SOUND !== "undefined") SOUND.notify();
    const el = $("#toast");
    el.innerHTML = I.check + "<span>" + msg + "</span>";
    el.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* ---------- تنقل ---------- */
  let view = "home";
  function go(v, arg) {
    if (typeof SOUND !== "undefined") SOUND.nav();
    if (v === "admin") { applyGate(true); }
    if (typeof AUTH !== "undefined" && !AUTH.current() && v !== "account" && v !== "admin") { applyGate(); return; }
    view = v;
    $$(".topnav button").forEach((b) => b.classList.toggle("active", b.dataset.view === v));
    $$(".view").forEach((x) => x.classList.remove("active"));
    const el = $("#view-" + v);
    if (el) el.classList.add("active");
    if (v === "home") renderHome();
    else if (v === "roadmap") renderRoadmap();
    else if (v === "paths") renderPaths();
    else if (v === "path") renderPathDetail(arg);
    else if (v === "myplan") renderMyPlan();
    else if (v === "tracks") renderTracks();
    else if (v === "courses") { renderCourses(arg); renderCourseGrid(); }
    else if (v === "detail") { if (arg) renderDetail(arg); }
    else if (v === "certs") renderCerts();
    else if (v === "tools") renderTools();
    else if (v === "faqs") renderFaqs();
    else if (v === "dashboard") renderDashboard();
    else if (v === "account") renderAccount();
    else if (v === "admin") renderAdmin();
    window.scrollTo({ top: 0, behavior: "smooth" });
    $("#topnav").classList.remove("open");
  }

  /* ---------- روابط مساعدة ---------- */
  function trackName(id) { const t = ACADEMY.tracks.find((x) => x.id === id); return t ? t.title : ""; }
  function trackPill(c) {
    const t = c.tracks && c.tracks[0] ? trackName(c.tracks[0]) : "";
    return t ? '<span class="course-track">' + t + "</span>" : "";
  }
  function courseComplete(id) {
    const c = courseById[id]; if (!c || !c.lessons) return false;
    return c.lessons.every((_, i) => state.done[id + "-" + i]);
  }
  function courseProgress(id) {
    const c = courseById[id]; if (!c || !c.lessons) return 0;
    const done = c.lessons.filter((_, i) => state.done[id + "-" + i]).length;
    return Math.round((done / c.lessons.length) * 100);
  }

  /* ---------- اقتباسات تحفيزية وسلسلة أيام ---------- */
  const QUOTES = [
    { t: "الذكاء الاصطناعي مش هيستبدل اللي بيتعلمه — اللي بيتعلمه هو اللي هيسبق.", a: "قاعدة السوق" },
    { t: "ساعة ونص يومياً = 547 ساعة في السنة. ده فرق ضخم.", a: "رياضيات بسيطة" },
    { t: "كل محترف كبير بدأ من الصفر زيّك بالظبط.", a: "حقيقة متكررة" },
    { t: "مش لازم تبقى عبقري — لازم تبقى مستمر.", a: "مبدأ التعلم" },
    { t: "الكود اللي بتكتبه النهاردة هو اللي هيبني مستقبلك.", a: "عملي" },
    { t: "الفشل في تمرين مفيش يساوي الفشل في الرحلة.", a: "توكيد لنفسك" },
    { t: "أحسن وقت تبدأ فيه كان من سنة، وثاني أحسن وقت هو دلوقتي.", a: "حكمة شائعة" },
    { t: "اتعلم حاجة صغيرة كل يوم — التراكم هو السر.", a: "قاعدة التعلم" },
    { t: "الذكاء الاصطناعي صندوق أدوات — وإبداعك هو اللي بيفرق.", a: "رؤية" },
    { t: "لما تتعلم AI، إنت بتستثمر في مهارة الزمن الجاي.", a: "استثمار" },
    { t: "مقارنتك بغيرك مضيعة وقت — قارن نفسك بإمبارح.", a: "تركيز" },
    { t: "خطوة صغيرة كل يوم بتوصل لمسافة كبيرة.", a: "قاعدة" },
  ];

  function updateStreak() {
    const today = new Date().toDateString();
    if (state.lastVisit === today) return;
    const yesterday = new Date(Date.now() - 864e5).toDateString();
    state.streak = (state.lastVisit === yesterday) ? (state.streak || 0) + 1 : 1;
    state.lastVisit = today;
    save();
  }

  function renderMotivation() {
    const q = QUOTES[new Date().getDate() % QUOTES.length];
    const streak = state.streak || 0;
    let dots = "";
    for (let i = 0; i < 7; i++) {
      const on = streak > 0 && i >= 7 - Math.min(streak, 7);
      dots += '<div class="streak-day' + (on ? " on" : "") + '" title="اليوم ' + (7 - i) + ' من آخر 7 أيام">' + (7 - i) + "</div>";
    }
    return '<div class="motivation">' +
      '<div class="mot-card glow">' +
        '<div class="mot-label">' + icon("flame", 15) + ' سلسلة المذاكرة — آخر 7 أيام</div>' +
        '<div class="mot-big">' + (streak > 0 ? streak + " يوم متتالي" : "ابدأ سلسلتك النهاردة") + '</div>' +
        '<div class="streak-row">' + dots + "</div>" +
        '<div class="tip">🟢 فاتح = يوم ذاكرت فيه &nbsp;•&nbsp; ' + icon("dot", 9) + ' داكن = لسه. استمر — حتى 20 دقيقة بتفرق.</div>' +
      "</div>" +
      '<div class="mot-card">' +
        '<div class="mot-label">message اقتباس النهاردة</div>' +
        '<div class="mot-quote">' + q.t + "</div>" +
        '<div class="mot-author">— ' + q.a + "</div>" +
        '<div class="tip">⚡ <b>نصيحة:</b> ' + PLAN.note + "</div>" +
      "</div>" +
      '<div class="mot-card zad-mini">' + renderZad() + "</div>" +
    "</div>";
  }

  let cheerT;
  function cheer(msg) {
    const el = $("#cheer");
    if (!el) return;
    el.innerHTML = '' + '<span class="flame" style="display:inline-flex">' + icon("flame", 15) + '</span>' + '<span>' + msg + "</span>";
    el.classList.add("show");
    clearTimeout(cheerT);
    cheerT = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ============ الرئيسية ============ */
  function renderHome() {
    const t = ACADEMY.trackKinds;
    const featured = ALL.slice(0, 6);
    const tracks = ACADEMY.tracks.slice(0, 4);
    const nodes = Array.from({ length: 18 }, () =>
      '<span class="node" style="top:' + (4 + Math.random() * 88) + "%;inset-inline-start:" + (Math.random() * 96) + "%;animation-delay:" + (Math.random() * 6).toFixed(1) + 's"></span>'
    ).join("");

    $("#view-home").innerHTML =
      '<div class="wrap">' +
        '<section class="hero">' +
          '<div class="neural">' + nodes + "</div>" +
          '<div class="brand-hero">' + logoSVG("wl-grad-hero") +
            '<div class="brand-hero-txt"><div class="brand-hero-name">WESTON</div><div class="brand-hero-sub">ARTIFICIAL&nbsp;INTELLIGENCE</div></div>' +
          "</div>" +
          '<h1>تعلّم كل مجالات الـ <span class="hl">AI</span> في مكان واحد</h1>' +
          '<p>' + ACADEMY.meta.desc + "</p>" +
          '<div class="hero-cta">' +
            '<button class="btn btn-primary" data-go="paths">اختر مسارك ' + I.arrow + '</button>' +
            '<button class="btn btn-ghost" data-go="roadmap">خريطة الطريق</button>' +
            '<button class="btn btn-ghost" data-go="myplan">خطتي الأسبوعية</button>' +
          '</div>' +
          '<div class="hero-stats">' +
            '<div class="hstat"><div class="hstat-val">' + totalCourses() + '<small> كورس</small></div><div class="hstat-label">بمصادر مجانية عالمية</div></div>' +
            '<div class="hstat"><div class="hstat-val">' + totalHours() + '<small>+ ساعة</small></div><div class="hstat-label">محتوى تعليمي مرتّب</div></div>' +
            '<div class="hstat"><div class="hstat-val">' + ACADEMY.certs.length + '<small> شهادات</small></div><div class="hstat-label">إتمام مجانية معتمدة</div></div>' +
            '<div class="hstat"><div class="hstat-val">' + ACADEMY.tracks.length + '<small> مسارًا</small></div><div class="hstat-label">تخصص وتطبيق</div></div>' +
          '</div>' +
        '</section>' +
        renderMotivation() +

        '<section class="section">' +
          '<div class="section-head"><div class="eyebrow">ليه weston؟</div><div class="section-title">كل اللي محتاجه في مكان واحد</div></div>' +
          '<div class="feat-grid feat-grid-4">' + ACADEMY.features.slice(0, 4).map((f) =>
            '<div class="feat"><div class="feat-icon">' + icon(f.icon, 22) + '</div><div class="feat-title">' + f.title + '</div><div class="feat-desc">' + f.desc + "</div></div>").join("") +
          "</div>" +
        "</section>" +

        '<section class="section">' +
          '<div class="section-head"><div class="eyebrow">المسارات</div><div class="section-title">الكورسات مترتّبة في مسارات</div>' +
          '<div class="section-sub">مسارين: تخصص تدخل بيها جوه الـ AI نفسه، وتطبيق تحطّ الـ AI في شغلك الحالي.</div></div>' +
          '<div class="track-grid">' + tracks.map((tr) => trackCard(tr)).join("") + "</div>" +
          '<button class="btn btn-ghost" data-go="tracks">شوف كل المسارات ' + I.arrow + "</button>" +
        "</section>" +

        '<section class="section">' +
          '<div class="cta"><h2>جاهز تبدأ؟</h2>' +
          '<p>ابدأ بمسار الأساسيات — خطوة واحدة بتفتحلك كل اللي بعدها. وتقدّمك بيتتحفظ تلقائياً.</p>' +
          '<button class="btn btn-primary" data-go="tracks">ابدأ أول مسار ' + I.arrow + "</button></div>" +
        "</section>" +
      "</div>";

    bindHome();
  }

  function trackCard(tr, full) {
    const p = trackProgress(tr);
    return '<div class="track">' +
      '<div class="track-head"><div class="track-icon">' + icon(tr.icon, 26) + "</div>" +
      '<div style="flex:1"><div class="track-title">' + tr.title + '</div><div class="track-tagline">' + tr.tagline + "</div></div></div>" +
      (full ? '<div class="track-desc">' + tr.desc + "</div>" : "") +
      '<div class="track-foot">' +
        '<span class="track-meta">' + tr.courseIds.length + " كورس</span>" +
        '<span class="track-meta">' + tr.level + "</span>" +
        '<span class="track-meta">' + tr.weeks + "</span>" +
        '<span class="track-meta" data-open-track="' + tr.id + '" style="color:var(--accent-2);cursor:pointer">افتح المسار ' + I.arrow + "</span>" +
      "</div>" +
      '<div class="track-bar"><span style="width:' + p.pct + '%"></span></div>' +
      '<div class="track-prog">أكملت ' + p.done + " من " + p.total + " درس (" + p.pct + "%)</div>" +
    "</div>";
  }

  function hasVideo(cid) { return typeof COURSE_VIDEOS !== "undefined" && !!COURSE_VIDEOS[cid]; }

  function courseCard(c) {
    const done = courseComplete(c.id);
    const p = courseProgress(c.id);
    return '<div class="course-card" data-open-course="' + c.id + '">' +
      '<div class="course-top"><div class="course-title">' + c.title + (hasVideo(c.id) ? ' <span class="vid-badge" title="محتوى مدمج جوه المنصة">video</span>' : "") + '</div><span class="course-type">' + (c.type || "كورس") + "</span></div>" +
      '<div class="course-note">' + (c.note || c.provider) + "</div>" +
      '<div class="course-meta"><span>' + c.provider + "</span><span>•</span><span>" + c.hours + ' س</span><span>•</span>' + trackPill(c) + "</div>" +
      '<div class="course-foot"><span class="course-progress' + (done ? " done" : "") + '">' + (done ? "✓ مكتمل" : p + "%") + "</span>" +
      '<span style="color:var(--muted);font-size:12.5px">التفاصيل ' + I.arrow + "</span></div>" +
    "</div>";
  }

  function bindHome() {
    $$("#view-home [data-go]").forEach((b) => b.addEventListener("click", () => go(b.dataset.go)));
    $$("#view-home [data-open-course]").forEach((b) => b.addEventListener("click", () => go("detail", b.dataset.openCourse)));
    $$("#view-home [data-open-track]").forEach((b) => b.addEventListener("click", () => go("tracks", b.dataset.openTrack)));
  }

  /* ============ المسارات ============ */
  function renderTracks() {
    const t = ACADEMY.trackKinds;
    const spec = ACADEMY.tracks.filter((x) => x.kind === "specialize");
    const app = ACADEMY.tracks.filter((x) => x.kind === "apply");

    const compare = [
      ["الهدف منه إيه؟", t.specialize.example, t.apply.example],
      ["مناسب لمين؟", "أي حد عايز الـ AI يبقى شغله الأساسي — حتى لو مالوش خلفية تقنية.", "حد شغال في مجال محدد وعايز يخدم شغله بالـ AI."],
      ["هتتعلم فيه إيه؟", "الـ AI بيفكر إزاي، إزاي تبني أنظمة كاملة وتسلّمها.", "الأدوات والخطوات اللي تخص مجالك بالظبط، بشغل عملي."],
      ["تبدأ منين؟", "من الصفر — مسار الأساسيات هو أول خطوة.", "محتاج تكون فاهم مجالك بس — مش لازم خلفية تقنية."],
    ];

    $("#view-tracks").innerHTML =
      '<div class="wrap">' +
        '<section class="section">' +
          '<div class="section-head"><div class="eyebrow">المسارات</div><div class="section-title">اختار مسارك</div>' +
          '<div class="section-sub">الكورسات مترتّبة في مسارات، وكل مسار بياخدك من نقطة لهدف واضح.</div></div>' +

          '<div class="kind-head"><div class="kind-title"><span class="kind-tag">تخصص</span>' + t.specialize.title + "</div>" +
          '<div class="kind-desc">' + t.specialize.desc + '</div><div class="kind-example">' + t.specialize.example + "</div></div>" +
          '<div class="track-grid">' + spec.map((tr) => trackCard(tr, true)).join("") + "</div>" +

          '<div class="kind-head" style="margin-top:30px"><div class="kind-title"><span class="kind-tag" style="background:var(--mint-soft);color:var(--mint)">تطبيق</span>' + t.apply.title + "</div>" +
          '<div class="kind-desc">' + t.apply.desc + '</div><div class="kind-example">' + t.apply.example + "</div></div>" +
          '<div class="track-grid">' + app.map((tr) => trackCard(tr, true)).join("") + "</div>" +
        "</section>" +

        '<section class="section">' +
          '<div class="section-head"><div class="eyebrow">مش عارف تبدأ منين؟</div><div class="section-title">أنا أدخل فين؟</div></div>' +
          '<div class="compare">' +
            '<div class="compare-card spec"><div class="compare-title">مسارات التخصص</div>' +
              compare.map((r) => '<div class="compare-row"><div class="compare-q">' + r[0] + '</div><div class="compare-a">' + r[1] + "</div></div>").join("") + "</div>" +
            '<div class="compare-card app"><div class="compare-title">مسارات التطبيق</div>' +
              compare.map((r) => '<div class="compare-row"><div class="compare-q">' + r[0] + '</div><div class="compare-a">' + r[2] + "</div></div>").join("") + "</div>" +
          "</div>" +
          '<div class="cta"><h2>الخطوة الأسهل: ابدأ بالأساسيات</h2>' +
          '<p>مسار الأساسيات هو أول خطوة لكل المسارات — مش مهم رايح تخصص ولا تطبيق.</p>' +
          '<button class="btn btn-primary" data-open-course="c-elements">ابدأ أول كورس ' + I.arrow + "</button></div>" +
        "</section>" +
      "</div>";

    $$("#view-tracks [data-open-course]").forEach((b) => b.addEventListener("click", () => go("detail", b.dataset.openCourse)));
    $$("#view-tracks [data-open-track]").forEach((b) => b.addEventListener("click", () => go("courses", b.dataset.openTrack)));
  }

  /* ============ الكورسات ============ */
  let filterTrack = "all";
  let query = "";

  function renderCourses(arg) {
    if (arg) filterTrack = arg;
    const chips = ['<button class="chip active" data-chip="all">كل المسارات</button>'] +
      ACADEMY.tracks.map((t) => '<button class="chip" data-chip="' + t.id + '">' + t.title + "</button>").join("");

    $("#view-courses").innerHTML =
      '<div class="wrap"><section class="section">' +
        '<div class="section-head"><div class="eyebrow">الكورسات</div><div class="section-title">كل كورسات المنصة</div>' +
        '<div class="section-sub">' + totalCourses() + " كورس • " + totalHours() + "+ ساعة • كلها مجانية بمصادر عالمية.</div></div>" +
        '<div class="filter-bar">' + chips + "</div>" +
        '<div class="course-grid" id="courseGrid"></div>' +
        '<div id="noRes" style="display:none;text-align:center;padding:50px;color:var(--muted)">لا توجد نتائج مطابقة</div>' +
      "</section></div>";

    $$("#view-courses [data-chip]").forEach((c) => c.classList.toggle("active", c.dataset.chip === filterTrack));
    $$("#view-courses [data-chip]").forEach((b) => b.addEventListener("click", () => {
      filterTrack = b.dataset.chip;
      $$("#view-courses [data-chip]").forEach((x) => x.classList.toggle("active", x === b));
      applyCourseFilter();
    }));
    applyCourseFilter();
  }

  function applyCourseFilter() {
    const q = query.trim().toLowerCase();
    let shown = 0;
    const grid = $("#courseGrid");
    $$(".course-card", grid).forEach((el) => {
      const c = courseById[el.dataset.openCourse];
      const tMatch = filterTrack === "all" || (c.tracks || []).includes(filterTrack);
      const qMatch = !q || (c.title + " " + c.provider + " " + (c.note || "") + " " + (c.type || "")).toLowerCase().includes(q);
      const show = tMatch && qMatch;
      el.style.display = show ? "" : "none";
      if (show) shown++;
    });
    const empty = $("#noRes"); if (empty) empty.style.display = shown ? "none" : "block";
  }

  function renderCourseGrid() {
    const grid = $("#courseGrid"); if (!grid) return;
    grid.innerHTML = ALL.map((c) => courseCard(c)).join("");
    $$("[data-open-course]", grid).forEach((b) => b.addEventListener("click", () => go("detail", b.dataset.openCourse)));
    applyCourseFilter();
  }

  /* ============ صفحة كورس ============ */
  function renderDetail(id) {
    const c = courseById[id]; if (!c) { go("courses"); return; }
    const lessons = c.lessons || [];
    const doneCount = lessons.filter((_, i) => state.done[c.id + "-" + i]).length;
    const pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;

    const lessonRows = lessons.map((t, i) => {
      const lid = c.id + "-" + i;
      const done = !!state.done[lid];
      return '<div class="lesson' + (done ? " done" : "") + '" data-lesson="' + lid + '">' +
        '<div class="lesson-num">' + (i + 1) + "</div>" +
        '<div class="lesson-title">' + t + "</div>" +
        (done ? '<span class="lesson-check">' + I.check + "</span>" : "") +
        '<span class="lesson-dur">' + I.clock + " درس " + (i + 1) + "</span>" +
      "</div>";
    }).join("");

    const vids = (typeof COURSE_VIDEOS !== "undefined" ? COURSE_VIDEOS[c.id] : null) || [];
    const fileWarn = location.protocol === "file:"
      ? '<div class="file-warn">' + icon("shield", 14) + ' انت فاتح المنصة كملف — الفيديوهات المدمجة محتاجة سيرفر. شغّل ملف <b>«ابدأ-المنصة.bat»</b> أو افتحها بالطريقة الموجودة في README.</div>'
      : "";
    const videosHtml = vids.length
      ? '<div class="videos">' +
          '<div class="lessons-head"><div class="lessons-title">video شغّل المحتوى هنا</div><div class="lessons-count">اضغط على أي فيديو للتشغيل — أو افتحه على يوتيوب</div></div>' +
          '<div class="video-grid">' +
            vids.map((v) => {
              const yt = v.type === "playlist"
                ? "https://www.youtube.com/playlist?list=" + v.id
                : "https://www.youtube.com/watch?v=" + v.id;
              const thumb = v.thumb || "";
              return '<div class="video-card" data-vtype="' + v.type + '" data-vid="' + v.id + '">' +
                '<div class="video-frame" data-frame>' +
                  (thumb
                    ? '<img class="video-thumb" src="' + thumb + '" alt="" loading="lazy">'
                    : '<div class="video-fallback"><span>▶</span></div>') +
                  '<button class="video-play" type="button" aria-label="شغّل"><span>▶</span></button>' +
                "</div>" +
                '<div class="video-title">' + v.t + "</div>" +
                '<a class="video-ext" href="' + yt + '" target="_blank" rel="noopener">▶ شغّل على يوتيوب ' + I.ext + "</a>" +
              "</div>";
            }).join("") +
          "</div>" +
          '<p class="video-hint">' + icon("sparkles", 14) + ' لو الفيديو مفتحش جوه المشغّل، اضغط «شغّل على يوتيوب» — هيفتح مباشرة.</p>' +
        "</div>"
      : "";

    $("#view-detail").innerHTML =
      '<div class="wrap"><section class="section">' +
        '<div class="crumb"><a href="#" data-go="courses">الكورسات</a><span>/</span><span>' + c.title + "</span></div>" +
        '<div class="detail-head">' +
          '<div class="detail-main">' +
            '<div class="detail-title">' + c.title + "</div>" +
            '<div class="detail-provider">' + c.provider + "</div>" +
            (c.note ? '<div class="detail-note">' + c.note + "</div>" : "") +
            '<div class="detail-tags">' +
              (c.level ? '<span class="tag lvl">' + c.level + "</span>" : "") +
              (c.type ? '<span class="tag">' + c.type + "</span>" : "") +
              (c.cert ? '<span class="tag cert">' + c.cert + "</span>" : "") +
              (c.tracks || []).map((t) => '<span class="tag">' + trackName(t) + "</span>").join("") +
            "</div>" +
            '<div style="margin-top:22px;display:flex;gap:10px;flex-wrap:wrap">' +
              '<a class="btn btn-primary btn-sm" href="' + c.link + '" target="_blank" rel="noopener">ابدأ الكورس ' + I.ext + "</a>" +
            "</div>" +
          "</div>" +
          '<aside class="detail-side">' +
            '<div class="side-stat"><span>المدة</span><b>' + c.hours + " ساعة</b></div>" +
            '<div class="side-stat"><span>المستوى</span><b>' + (c.level || "—") + "</b></div>" +
            '<div class="side-stat"><span>الشهادة</span><b>' + (c.cert || "—") + "</b></div>" +
            '<div class="side-stat"><span>الدروس</span><b>' + lessons.length + "</b></div>" +
            '<div class="side-stat"><span>تقدمك</span><b>' + pct + "%</b></div>" +
          "</aside>" +
        "</div>" +

        videosHtml +

        fileWarn +

        '<div class="lessons">' +
          '<div class="lessons-head"><div class="lessons-title">محتوى الكورس</div><div class="lessons-count">' + doneCount + " / " + lessons.length + " درس مكتمل</div></div>" +
          lessonRows +
          '<p style="color:var(--muted);font-size:13.5px;margin-top:10px">علّم على كل درس تكمّله — وتقدّمك بيتتحفظ تلقائياً.</p>' +
        "</div>" +

        '<div class="instructor">' +
          '<div class="instructor-avatar">' + (c.provider.trim()[0] || "غ") + "</div>" +
          '<div><div class="instructor-name">' + c.provider + "</div>" +
          '<div class="instructor-role">مدرّب الكورس • مصدر عالمي مجاني</div></div>' +
        "</div>" +
      "</section></div>";

    $$("#view-detail [data-lesson]").forEach((el) => el.addEventListener("click", () => toggleLesson(el.dataset.lesson)));
    $$("#view-detail .video-card").forEach((card) => {
      const frame = card.querySelector("[data-frame]");
      if (!frame) return;
      const btn = card.querySelector(".video-play");
      if (btn) btn.addEventListener("click", () => {
        const type = card.dataset.vtype, id = card.dataset.vid;
        const src = type === "playlist"
          ? "https://www.youtube.com/embed/videoseries?list=" + id + "&rel=0"
          : "https://www.youtube.com/embed/" + id + "?rel=0";
        frame.innerHTML = '<iframe src="' + src + '" title="" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
        frame.classList.add("playing");
      });
      frame.addEventListener("click", (e) => {
        if (e.target.closest("a") || e.target.closest("iframe")) return;
        if (btn) btn.click();
      });
    });
    const cb = $('#view-detail [data-go="courses"]');
    if (cb) cb.addEventListener("click", (e) => { e.preventDefault(); go("courses"); });
  }

  function toggleLesson(lid) {
    if (state.done[lid]) delete state.done[lid]; else state.done[lid] = true;
    save();
    const cid = lid.split("-")[0];
    // إعادة رسم خفيفة
    const c = courseById[cid];
    const idx = parseInt(lid.split("-")[1], 10);
    const done = !!state.done[lid];
    if (done && typeof SOUND !== "undefined") SOUND.success();
    const row = $('[data-lesson="' + lid + '"]');
    if (row) {
      row.classList.toggle("done", done);
      const chk = $(".lesson-check", row);
      if (done && !chk) row.insertAdjacentHTML("beforeend", "");
      if (!done && chk) chk.remove();
    }
    renderDetail(cid);
    updateFloat();
    if (done) cheer("أحسنت! درس مكتمل 🔥");
  }

  /* ============ شهادات ============ */
  function renderCerts() {
    $("#view-certs").innerHTML =
      '<div class="wrap"><section class="section">' +
        '<div class="section-head"><div class="eyebrow">الشهادات</div><div class="section-title">شهادات إتمام مجانية</div>' +
        '<div class="section-sub">كل شهادة مجانية بالكامل — خدها بالترتيب وحطها في LinkedIn.</div></div>' +
        '<div class="cert-grid">' + ACADEMY.certs.map((c) =>
          '<div class="cert"><div class="cert-head"><div class="cert-icon">' + I.award + "</div>" +
          '<div><div class="cert-title">' + c.title + '</div><div class="cert-issuer">' + c.issuer + " • " + c.stage + "</div></div></div>" +
          '<div class="cert-foot"><span class="tag cert">' + c.cost + '</span>' +
          '<a class="course-track" href="' + c.link + '" target="_blank" rel="noopener">احصل عليها ' + I.ext + "</a></div></div>").join("") +
        "</div></section></div>";
  }

  /* ============ أدوات ============ */
  function renderTools(cat, q) {
    const c = cat || "all", query = (q || "").trim().toLowerCase();
    const cats = TOOL_CATS;
    const list = TOOLS.filter((t) =>
      (c === "all" || t.c === c) &&
      (!query || (t.n + " " + t.d).toLowerCase().includes(query))
    );
    const groups = c === "all"
      ? cats.map((g) => ({ ...g, items: list.filter((t) => t.c === g.id) })).filter((g) => g.items.length)
      : [{ ...cats.find((g) => g.id === c), items: list }];

    $("#view-tools").innerHTML =
      '<div class="wrap"><section class="section">' +
        '<div class="section-head"><div class="eyebrow">الأدوات</div>' +
        '<div class="section-title">دليل أدوات الذكاء الاصطناعي</div>' +
        '<div class="section-sub">' + TOOLS.length + ' أداة عالمية مجمعة في ' + cats.length + ' قسم — كل أداة بلينكها وسعرها ووصفها.</div></div>' +
        '<div class="tools-bar">' +
          '<input class="tools-search" id="toolsSearch" type="text" placeholder="ابحث عن أداة… (مثلاً: فيديو، صور)" value="' + esc(q || "") + '">' +
        "</div>" +
        '<div class="tools-filters">' +
          '<button class="chip' + (c === "all" ? " active" : "") + '" data-toolcat="all">الكل (' + TOOLS.length + ")</button>" +
          cats.map((g) => '<button class="chip' + (c === g.id ? " active" : "") + '" data-toolcat="' + g.id + '">' + icon(g.icon, 16) + " " + g.name + "</button>").join("") +
        "</div>" +
        (list.length ? groups.map((g) =>
          '<div class="tool-group"><div class="tool-group-head"><span class="tool-group-icon">' + icon(g.icon, 20) + '</span><h3>' + g.name + '</h3><span class="tool-group-count">' + g.items.length + "</span></div>" +
          '<div class="tools-grid">' + g.items.map((t) =>
            '<div class="tool">' +
              '<div class="tool-top"><div class="tool-name">' + t.n + '</div><span class="tool-price">' + t.p + "</span></div>" +
              '<div class="tool-desc">' + t.d + "</div>" +
              '<a class="tool-link" href="' + t.l + '" target="_blank" rel="noopener">افتح الأداة ' + I.ext + "</a>" +
            "</div>").join("") + "</div></div>"
        ).join("") : '<div class="tools-empty">مفيش أدوات مطابقة — جرّب كلمة تانية أو قسم تاني.</div>') +
      "</section></div>";

    const si = $("#toolsSearch");
    if (si) si.addEventListener("input", () => { window._toolsQ = si.value; renderTools(c, si.value); si.focus(); const v = si.value; si.setSelectionRange(v.length, v.length); });
    $$("#view-tools [data-toolcat]").forEach((b) => b.addEventListener("click", () => renderTools(b.dataset.toolcat, $("#toolsSearch") ? $("#toolsSearch").value : "")));
  }

  /* ============ أسئلة شائعة ============ */
  function renderFaqs() {
    $("#view-faqs").innerHTML =
      '<div class="wrap"><section class="section">' +
        '<div class="section-head"><div class="eyebrow">الأسئلة الشائعة</div><div class="section-title">كل اللي عايز تعرفه</div></div>' +
        ACADEMY.faqs.map((f) =>
          '<details class="faq"><summary>' + f.q + I.chev + "</summary><div class=\"faq-a\">" + f.a + "</div></details>").join("") +
        '<div class="section-head" style="margin-top:40px"><div class="eyebrow">مصادر</div><div class="section-title">مصادر إضافية</div></div>' +
        '<div class="res-grid">' + ACADEMY.resources.map((r) =>
          '<a class="res" href="' + r.link + '" target="_blank" rel="noopener"><div><div class="res-name">' + r.name + '</div><div class="res-tag">' + r.tag + "</div></div>" + I.arrow + "</a>").join("") +
        "</div>" +
        '<div class="section-head" style="margin-top:40px"><div class="eyebrow">قواعد</div><div class="section-title">قواعد الرحلة</div></div>' +
        '<div class="rules">' + ACADEMY.rules.map((r) => '<div class="rule">' + I.check + "<span>" + r + "</span></div>").join("") + "</div>" +
      "</section></div>";
  }

  /* ============ تقدّمي ============ */
  function renderDashboard() {
    const p = percent();
    const R = 52, C = 2 * Math.PI * R;
    const off = C - (p / 100) * C;

    $("#view-dashboard").innerHTML =
      '<div class="wrap"><section class="section">' +
        '<div class="section-head"><div class="eyebrow">تقدّمي</div><div class="section-title">لوحة التقدم</div>' +
        '<div class="section-sub">تقدّمك بيتتحفظ على جهازك تلقائياً.</div></div>' +
        '<div class="dash-grid">' +
          '<div class="dash-card">' +
            '<div class="ring-wrap">' +
              '<div class="ring"><svg width="112" height="112"><circle cx="56" cy="56" r="' + R + '" fill="none" stroke="var(--surface-3)" stroke-width="9"/>' +
              '<circle cx="56" cy="56" r="' + R + '" fill="none" stroke="url(#g1)" stroke-width="9" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' + off + '"/>' +
              '<defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c6cf6"/><stop offset="1" stop-color="#4f8cff"/></linearGradient></defs></svg>' +
              '<div class="ring-val">' + p + "%</div></div>" +
              '<div class="ring-meta"><b>' + doneLessons() + "</b> درس مكتمل<br>من <b>" + totalLessons() + "</b> درس<br>في <b>" + totalCourses() + "</b> كورس</div>" +
            "</div>" +
            '<div class="dash-stats">' +
              '<div class="dstat"><div class="dstat-val">' + doneCourses() + "</div><div class=\"dstat-label\">كورس مكتمل</div></div>" +
              '<div class="dstat"><div class="dstat-val">' + doneHours() + "</div><div class=\"dstat-label\">ساعة تعلم</div></div>" +
              '<div class="dstat"><div class="dstat-val">' + totalHours() + "</div><div class=\"dstat-label\">إجمالي الساعات</div></div>" +
              '<div class="dstat"><div class="dstat-val">' + ACADEMY.certs.length + "</div><div class=\"dstat-label\">شهادة متاحة</div></div>" +
            "</div>" +
          "</div>" +
          '<div class="dash-card"><div class="dash-title">تقدم المسارات</div>' +
            ACADEMY.tracks.map((t) => {
              const pr = trackProgress(t);
              return '<div class="track-row"><div class="track-row-top"><div class="track-row-title">' + icon(t.icon, 18) + " " + t.title + '</div>' +
                '<div class="track-row-pct">' + pr.pct + "%</div></div>" +
                '<div class="track-bar" style="margin-top:10px"><span style="width:' + pr.pct + '%"></span></div>' +
                '<div class="track-prog" style="margin-top:5px">' + pr.done + " / " + pr.total + " درس</div></div>";
            }).join("") +
          "</div>" +
        "</div>" +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px">' +
          '<button class="btn btn-ghost" id="dashExport">تصدير تقدّمي</button>' +
          '<button class="btn btn-ghost" id="dashReset">مسح التقدم</button>' +
        "</div>" +
      "</section></div>";

    $("#dashExport").addEventListener("click", exportProgress);
    $("#dashReset").addEventListener("click", () => {
      if (confirm("متأكد إنك عايز تمسح كل تقدمك؟")) { state.done = {}; save(); refresh(); toast("تم مسح التقدم"); }
    });
  }

  /* ============ خطتي ============ */
  function planProgress() {
    let done = 0;
    PLAN.months.forEach((m) => m.weeks.forEach((w) => { if (state.plan["p-" + w.w]) done++; }));
    const total = PLAN.months.reduce((a, m) => a + m.weeks.length, 0);
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function renderZad() {
    const list = PLAN.azkar || [];
    if (!list.length) return "";
    const a = list[new Date().getDate() % list.length];
    return '<div class="zad">' +
      '<div class="zad-label">' + icon("book", 15) + ' زاد النهاردة</div>' +
      '<div class="zad-type">' + a.type + ' • ' + a.ref + "</div>" +
      '<div class="zad-text">' + a.text + "</div>" +
      '<div class="zad-foot">اللهم انفعني بما علمتني، وعلمني ما ينفعني، وزدني علماً</div>' +
    "</div>";
  }

  function renderMyPlan() {
    const p = planProgress();
    const monthsHtml = PLAN.months.map((m) => {
      const weeksHtml = m.weeks.map((w) => {
        const id = "p-" + w.w;
        const done = !!state.plan[id];
        const courses = (w.courses || []).map((cid) => {
          const c = courseById[cid];
          return c ? '<a class="plan-course" href="#" data-course-link="' + c.id + '">' + c.title + "</a>" : "";
        }).join("");
        const daily = (w.daily || []).map((d) => "<span>" + d + "</span>").join("");
        return '<div class="plan-week' + (done ? " done" : "") + '">' +
          '<label class="plan-check"><input type="checkbox" data-plan-week="' + id + '"' + (done ? " checked" : "") + "><span>" + w.w + "</span></label>" +
          '<div class="plan-body">' +
            '<div class="plan-week-title">' + w.title + "</div>" +
            '<div class="plan-goal">target ' + w.goal + "</div>" +
            (courses ? '<div class="plan-courses">' + courses + "</div>" : "") +
            (daily ? '<div class="plan-daily"><b>مهام يومية:</b> ' + daily + "</div>" : "") +
            '<div class="plan-habit">sprout العادة: ' + w.habit + "</div>" +
            '<div class="plan-task">' + icon("target", 15) + ' مهمة الأسبوع: ' + w.task + "</div>" +
            '<div class="plan-outcome">✅ المخرج: ' + w.outcome + "</div>" +
          "</div></div>";
      }).join("");
      const md = m.weeks.filter((w) => state.plan["p-" + w.w]).length;
      return '<div class="plan-month">' +
        '<div class="plan-month-head"><div class="plan-month-num">' + m.num + "</div>" +
        '<div><div class="plan-month-title">' + m.title + " — " + m.theme + "</div>" +
        '<div class="plan-month-goal">' + m.goal + "</div></div>" +
        '<div class="plan-month-prog">' + md + "/" + m.weeks.length + "</div></div>" +
        '<div class="plan-weeks">' + weeksHtml + "</div></div>";
    }).join("");

    $("#view-myplan").innerHTML =
      '<div class="wrap"><section class="section">' +
        '<div class="section-head"><div class="eyebrow">خطتي</div><div class="section-title">خطة 14 شهر من الصفر للاحتراف والشغل</div>' +
        '<div class="section-sub">' + PLAN.desc + "</div>" +
        '<div class="plan-note">' + PLAN.note + "</div></div>" +
        '<div class="plan-overview">' +
          '<div class="plan-overview-card"><div class="plan-big">' + p.done + "<small>/" + p.total + '</small></div><div class="plan-label">أسبوع مكتمل</div></div>' +
          '<div class="plan-overview-card"><div class="plan-big">' + p.pct + '%</div><div class="plan-label">نسبة الإنجاز</div></div>' +
          '<div class="plan-overview-card"><div class="plan-big">' + (p.total - p.done) + '</div><div class="plan-label">أسبوع متبقّي</div></div>' +
        "</div>" +
        '<div class="plan-bar"><span style="width:' + p.pct + '%"></span></div>' +
        renderZad() +
        monthsHtml +
      "</section></div>";

    $$("#view-myplan [data-plan-week]").forEach((inp) => inp.addEventListener("change", () => {
      const id = inp.dataset.planWeek;
      if (inp.checked) state.plan[id] = true; else delete state.plan[id];
      save(); renderMyPlan(); updateFloat(); updateFoot();
      if (inp.checked) cheer("أسبوع مكتمل! كمّل السلسلة 🔥");
    }));
    $$("#view-myplan [data-course-link]").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault(); go("detail", a.dataset.courseLink);
    }));
  }

  /* ---------- خريطة الطريق ---------- */
  const ROADMAP = [
    { n: 1, icon: "sprout", title: "البداية", sub: "الرياضيات + وعي بالـ AI", time: "4 أسابيع", track: "t-math",
      learn: "جبر خطي، تفاضل، احتمالات، NumPy، ومقدمة عن المجال",
      out: "بتفهم إزاي النماذج بتتعلم، وعندك أساس رياضي قوي" },
    { n: 2, icon: "python", title: "بايثون والبيانات", sub: "من أول سطر لحد تحليل بيانات", time: "7 أسابيع", track: "t-python",
      learn: "بايثون، Pandas، SQL، رسوم بيانية، Git",
      out: "بتحلل بيانات حقيقية وتطلّع تقرير كامل" },
    { n: 3, icon: "bot", title: "التعلم الآلي", sub: "تبني أول موديل", time: "9 أسابيع", track: "t-ml",
      learn: "انحدار، تصنيف، غابات عشوائية، هندسة خصائص",
      out: "أول موديل تنبؤ + أول مشاركة في Kaggle" },
    { n: 4, icon: "brain", title: "التعلم العميق", sub: "الشبكات العصبية", time: "9 أسابيع", track: "t-dl",
      learn: "شبكة عصبية من الصفر، CNN، تدريب وتحسين",
      out: "شبكات عصبية بتتدرب وتحقق دقة عالية" },
    { n: 5, icon: "eye", title: "رؤية الحاسوب", sub: "الشبكة بتشوف", time: "4 أسابيع", track: "t-advanced",
      learn: "الشبكات الالتفافية، كشف الأشياء، نقل التعلم",
      out: "تطبيق بيصنف صور ويكشف أشياء" },
    { n: 6, icon: "message", title: "NLP والذكاء التوليدي", sub: "نماذج اللغة الكبيرة", time: "6 أسابيع", track: "t-genai",
      learn: "LLM، تضمينات، RAG، هندسة الأوامر، الضبط الدقيق",
      out: "تطبيق بيجاوب من ملفاتك (RAG)" },
    { n: 7, icon: "bot", title: "الوكلاء الأذكياء", sub: "الـ AI بينفّذ مهام", time: "4 أسابيع", track: "t-genai",
      learn: "بناء وكلاء، أدوات، LangGraph، Claude Code",
      out: "وكيل بيخدم مهمة حقيقية في شغلك" },
    { n: 8, icon: "target", title: "تخصص متقدم", sub: "مستوى بحثي", time: "8 أسابيع", track: "t-advanced",
      learn: "رؤية متقدمة أو تعلّم معزز + أوراق بحثية",
      out: "مشروع تخصص قوي يقنع أي صاحب شغل" },
    { n: 9, icon: "rocket", title: "MLOps والنشر", sub: "من النوتبوك للعالم", time: "4 أسابيع", track: "t-mlops",
      learn: "نشر نماذج، تتبع تجارب، مراقبة، API",
      out: "نموذج منشور في الإنتاج ومتراقب" },
    { n: 10, icon: "briefcase", title: "الشغل والاحتراف", sub: "دخول سوق العمل", time: "6 أسابيع", track: "a-biz",
      learn: "شهادات، سيرة، LinkedIn، عمل حر، مقابلات، تفاوض",
      out: "وظيفة أو دخل من الـ AI" },
  ];

  const APPLY_TRACKS = [
    { icon: "pen", title: "هندسة الأوامر", desc: "أوامر احترافية تطلعلك اللي عايزه", track: "a-prompt" },
    { icon: "terminal", title: "البرمجة بالـ AI", desc: "Claude Code وأدوات البرمجة الذكية", track: "a-claude" },
    { icon: "gear", title: "الأوتوميشن", desc: "سير عمل بتشتغل لوحدها", track: "a-auto" },
    { icon: "bars", title: "AI للأعمال", desc: "تسويق وقرارات أسرع", track: "a-biz" },
    { icon: "palette", title: "AI للتصميم", desc: "صور وصوت ومحتوى", track: "a-design" },
  ];

  function renderRoadmap() {
    const steps = ROADMAP.map((s, i) => {
      const last = i === ROADMAP.length - 1;
      return '<div class="rm-step">' +
        '<div class="rm-rail"><div class="rm-num">' + s.n + "</div></div>" +
        '<div class="rm-card' + (i === 0 ? " start" : "") + '">' +
          (i === 0 ? '<div class="rm-badge-start">' + icon("rocket", 15) + " ابدأ هنا</div>" : "") +
          '<div class="rm-head">' +
            '<div class="rm-icon">' + icon(s.icon, 20) + "</div>" +
            '<div class="rm-titles"><div class="rm-title">' + s.title + '</div><div class="rm-sub">' + s.sub + "</div></div>" +
            '<div class="rm-time">' + s.time + "</div>" +
          "</div>" +
          '<div class="rm-row"><span class="rm-tag learn">بتتعلم</span><span>' + s.learn + "</span></div>" +
          '<div class="rm-row out"><span class="rm-tag out">بعد ما تخلص</span><span>' + s.out + "</span></div>" +
          '<div class="rm-actions"><button class="btn btn-ghost btn-sm" data-roadmap-track="' + s.track + '">افتح المسارات دي ' + I.arrow + "</button></div>" +
        "</div>" +
      "</div>" +
      (last ? "" : '<div class="rm-arrow">' + I.arrow + "</div>");
    }).join("");

    const apply = APPLY_TRACKS.map((a) =>
      '<button class="rm-apply" data-roadmap-track="' + a.track + '">' +
        '<span class="rm-apply-icon">' + icon(a.icon, 20) + "</span>" +
        '<span class="rm-apply-body"><b>' + a.title + "</b><small>" + a.desc + "</small></span>" +
        '<span class="rm-apply-go">' + I.chev + "</span>" +
      "</button>"
    ).join("");

    $("#view-roadmap").innerHTML =
      '<div class="wrap"><section class="section">' +
        '<div class="section-head"><div class="eyebrow">خريطة الطريق</div>' +
        '<div class="section-title">من الصفر للاحتراف — خطوة بخطوة</div>' +
        '<div class="section-sub">كل مرحلة بتبني على اللي قبلها. لوّح على أي مرحلة تشوف مساراتها، و«خطتي» عندك التفاصيل الأسبوعية.</div></div>' +
        '<div class="rm-summary">' +
          '<div><b>10</b><span>مراحل</span></div>' +
          '<div><b>~14</b><span>شهر</span></div>' +
          '<div><b>62</b><span>كورس</span></div>' +
          '<div><b>10-15</b><span>ساعة أسبوعياً</span></div>' +
        "</div>" +
        '<div class="rm-line">' + steps + "</div>" +
        '<div class="rm-apply-head"><h3>' + icon("wrench", 16) + ' مسارات تطبيقية — متوازية</h3><p>مش شرط بالترتيب؛ تدخلها وقت ما تحتاجها في أي مرحلة.</p></div>' +
        '<div class="rm-apply-grid">' + apply + "</div>" +
      "</section></div>";

    $$("#view-roadmap [data-roadmap-track]").forEach((b) => b.addEventListener("click", () => go("courses", b.dataset.roadmapTrack)));
  }

  /* ---------- التفرعات المهنية ---------- */
  function pathCourses(p) { return [...new Set(p.steps.flatMap((s) => s.c))]; }

  function renderPaths(filter) {
    const f = filter || "all";
    const list = PATHS.filter((p) => f === "all" || p.level === f);
    const cards = list.map((p) => {
      const n = pathCourses(p).length;
      return '<button class="path-card" data-path="' + p.id + '">' +
        '<div class="path-top"><div class="path-icon">' + icon(p.icon, 26) + "</div>" +
        '<div class="path-titles"><div class="path-title">' + p.title + '</div><div class="path-tagline">' + p.tagline + "</div></div>" +
        '<div class="path-level">' + p.level + "</div></div>" +
        '<div class="path-goal">' + p.goal + "</div>" +
        '<div class="path-meta">' +
          '<span>clock ' + p.time + "</span>" +
          '<span>briefcase ' + p.jobs[0] + "</span>" +
          '<span>cap ' + n + " كورس</span>" +
        "</div>" +
        '<div class="path-salary">' + p.salary + "</div>" +
      "</button>";
    }).join("");

    $("#view-paths").innerHTML =
      '<div class="wrap"><section class="section">' +
        '<div class="section-head"><div class="eyebrow">مسارك</div>' +
        '<div class="section-title">اختار تفرعك المهني</div>' +
        '<div class="section-sub">مش طريق واحد للكل. كل مسار هنا هدف مهني واضح بخطواته ووظايفه وراتبه. اضغط على المسار تشوف خطته كاملة.</div></div>' +
        '<div class="path-filters">' +
          [["all", "الكل"], ["مبتدئ", "مبتدئ"], ["متوسط", "متوسط"], ["متقدم", "متقدم"]]
            .map(([k, l]) => '<button class="chip' + (f === k ? " active" : "") + '" data-pathfilter="' + k + '">' + l + "</button>").join("") +
        "</div>" +
        '<div class="path-grid">' + cards + "</div>" +
        '<p class="path-note">' + icon("sparkles", 14) + ' مش متأكد؟ ابدأ بـ «خريطة الطريق» — بتوضح التدرج العام، وبعدين اختر تفرعك.</p>' +
      "</section></div>";

    $$("#view-paths [data-pathfilter]").forEach((b) => b.addEventListener("click", () => renderPaths(b.dataset.pathfilter)));
    $$("#view-paths [data-path]").forEach((b) => b.addEventListener("click", () => go("path", b.dataset.path)));
  }

  function renderPathDetail(id) {
    const p = PATHS.find((x) => x.id === id);
    if (!p) { go("paths"); return; }
    const courses = pathCourses(p);
    const steps = p.steps.map((s, i) => {
      const links = s.c.map((cid) => {
        const c = courseById[cid];
        return c ? '<a class="plan-course" href="#" data-course-link="' + c.id + '">' + c.title + "</a>" : "";
      }).join("");
      return '<div class="rm-step"><div class="rm-rail"><div class="rm-num">' + (i + 1) + "</div></div>" +
        '<div class="rm-card"><div class="rm-head"><div class="rm-icon">compass</div>' +
        '<div class="rm-titles"><div class="rm-title">' + s.t + '</div></div>' +
        '<div class="rm-time">' + s.w + "</div></div>" +
        (links ? '<div class="path-courses">' + links + "</div>" : "") +
        "</div></div>" +
        (i < p.steps.length - 1 ? '<div class="rm-arrow">' + I.arrow + "</div>" : "");
    }).join("");

    $("#view-path").innerHTML =
      '<div class="wrap"><section class="section">' +
        '<div class="crumb"><a href="#" data-go="paths">مسارك</a><span>/</span><span>' + p.title + "</span></div>" +
        '<div class="pd-hero">' +
          '<div class="pd-icon">' + icon(p.icon, 32) + "</div>" +
          '<div class="pd-titles"><div class="pd-title">' + p.title + '</div><div class="pd-tagline">' + p.tagline + "</div>" +
          '<div class="pd-goal">' + p.goal + "</div></div>" +
          '<div class="pd-stats">' +
            '<div><span>المدة</span><b>' + p.time + "</b></div>" +
            '<div><span>المستوى</span><b>' + p.level + "</b></div>" +
            '<div><span>الكورسات</span><b>' + courses.length + "</b></div>" +
            '<div><span>الراتب</span><b>' + p.salary + "</b></div>" +
          "</div>" +
        "</div>" +
        '<div class="pd-block"><h3>خطواتك</h3><div class="rm-line">' + steps + "</div></div>" +
        '<div class="pd-cols">' +
          '<div class="pd-block"><h3>الوظايف</h3><ul class="pd-list">' + p.jobs.map((j) => "<li>" + j + "</li>").join("") + "</ul></div>" +
          '<div class="pd-block"><h3>شهادات معتمدة</h3><ul class="pd-list">' + p.certs.map((c) => "<li>" + c + "</li>").join("") + "</ul></div>" +
        "</div>" +
        '<div class="pd-actions">' +
          '<button class="btn btn-primary" data-go="myplan">ابدأ خطتك الأسبوعية ' + I.arrow + "</button>" +
          '<button class="btn btn-ghost" data-go="courses">كل الكورسات</button>' +
        "</div>" +
      "</section></div>";

    $$("#view-path [data-course-link]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); go("detail", a.dataset.courseLink); }));
    const cb = $('#view-path [data-go="paths"]');
    if (cb) cb.addEventListener("click", (e) => { e.preventDefault(); go("paths"); });
  }

  /* ---------- الشات بوت ---------- */
  let chatMsgs = [];
  let quizIdx = 0, quizAns = [];

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function md(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/\n/g, "<br>");
  }

  function chatAdd(m) {
    chatMsgs.push(m);
    if (chatMsgs.length > 60) chatMsgs = chatMsgs.slice(-60);
    if (m.from === "bot" && typeof SOUND !== "undefined") SOUND.receive();
    renderChat();
    const body = $("#chatBody");
    if (body) body.scrollTop = body.scrollHeight;
  }

  function chatQuick(list) {
    const q = $("#chatQuick");
    if (!q) return;
    q.innerHTML = list.map((t) => '<button class="chat-chip" data-chip="' + esc(t) + '">' + esc(t) + "</button>").join("");
    $$("#chatQuick [data-chip]").forEach((b) => b.addEventListener("click", () => sendChat(b.dataset.chip)));
  }

  function renderChat() {
    const body = $("#chatBody");
    if (!body) return;
    body.innerHTML = chatMsgs.map((m) =>
      '<div class="chat-msg ' + m.from + '">' +
        '<div class="chat-bubble">' + md(m.text) + "</div>" +
        '<div class="chat-time">' + (m.time || "") + "</div>" +
      "</div>"
    ).join("");
    const body2 = $("#chatBody");
    body2.scrollTop = body2.scrollHeight;
  }

  function openChat() {
    $("#chatPanel").classList.add("open");
    $("#chatFab").classList.add("hide");
    if (!chatMsgs.length) {
      chatAdd(botMessage("أهلاً بيك في **weston** 👋\n\nأنا مساعدك الشخصي — هساعدك تختار مسارك وتلاقي الكورسات المناسبة.\n\nاختار من الاقتراحات تحت أو اكتب سؤالك."));
      chatQuick(QUICK);
    }
  }
  function closeChat() {
    $("#chatPanel").classList.remove("open");
    $("#chatFab").classList.remove("hide");
  }

  async function botReply(text) {
    const q = text.trim().toLowerCase();
    // اختبار التوجيه
    if (quizIdx > 0 && quizIdx <= QUIZ.length) {
      const qi = quizIdx - 1;
      if (qi >= 0 && qi < QUIZ.length) {
        quizAns.push(text.trim());
        quizIdx++;
        if (quizIdx > QUIZ.length) {
          const rec = botRecommend(quizAns);
          const p = PATHS.find((x) => x.id === rec.id);
          quizIdx = 0;
          chatAdd(botMessage("✅ بناءً على إجاباتك، أقترحلك:\n\n**" + (p ? icon(p.icon, 18) + " " + p.title : rec.id) + "**\n" + rec.why + "\n\nالمدة: " + (p ? p.time : "") + " • الراتب: " + (p ? p.salary : "") + "\n\nدوس «افتح المسار» تشوف خطته كاملة."));
          chatQuick(["افتح المسار", "منين أبدأ؟", "إيه المسار المناسب لي؟"]);
          window._recPath = rec.id;
          return;
        }
        chatAdd(botMessage(QUIZ[quizIdx - 1].q));
        chatQuick(QUIZ[quizIdx - 1].opts);
        return;
      }
    }
    if (/(اختبار|وجّهني|وجهنا|رشح|رشّح|اقترح|اقترحلي|مسار مناسب|اختار تفرع|عايز أختار|عايز اختار|تفرع|اختار مسار|اختيار مسار|رشّحلي|هديني|هديني)/.test(q)) {
      quizIdx = 1; quizAns = [];
      chatAdd(botMessage("تمام! هسألك 3 أسئلة وأرشّحلك أنسب مسار target\n\n" + QUIZ[0].q));
      chatQuick(QUIZ[0].opts);
      return;
    }
    // فتح مسار مرشح
    if (/(افتح المسار)/.test(q) && window._recPath) {
      const id = window._recPath;
      window._recPath = null;
      chatQuick(QUICK);
      setTimeout(() => go("path", id), 500);
      return;
    }
    // بحث في المنصة
    const m = q.match(/(كورس|كورسات|دور|ابحث|دوسيس)/);
    if (m) {
      const cleaned = text.trim()
        .replace(/(دور|ابحث|اعملي|عايز|اريد|كورس|كورسات|دوسيس|عن|لي|على|من|فى|في)/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const res = botSearch(cleaned.length > 1 ? cleaned : text.trim());
      if (res.length) {
        chatAdd(botMessage("لقيت لك " + res.length + " كورس cap\n" + res.map((c) => "• **" + c.title + "**").join("\n") + "\n\nدوس «الكورسات» للتفاصيل."));
        chatQuick(["منين أبدأ؟", "search ابحث على ويكي"]);
        return;
      }
    }
    // قواعد
    for (const r of BOT_RULES) {
      if (r.k.some((k) => q.includes(k.toLowerCase()))) {
        if (r.web) {
          chatAdd(botMessage(r.r));
          const w = await wikiSearch(text.trim().replace(/^.*(ويكي|wiki)\s*(عن|على)?\s*/, "").trim() || text.trim());
          if (w) {
            chatAdd(botMessage("🌐 **" + w.title + "**\n\n" + w.text));
            chatQuick(["اسأل الذكاء الاصطناعي: " + w.title, "منين أبدأ؟"]);
          } else {
            chatAdd(botMessage("معلش، مقدرتش ألاقي نتيجة في ويكيبيديا. جرب «اسأل الذكاء الاصطناعي»."));
            chatQuick(QUICK);
          }
          return;
        }
        if (r.ai) {
          chatAdd(botMessage(r.r));
          const a = await aiAnswer(text.trim().replace(/^.*(الذكاء الاصطناعي|ai)\s*(عن|:)?\s*/, "").trim() || text.trim());
          if (a) {
            chatAdd(botMessage("bot " + a));
            chatQuick(["search ابحث على ويكي", "منين أبدأ؟"]);
          } else {
            chatAdd(botMessage(FALLBACK));
            chatQuick(QUICK);
          }
          return;
        }
        chatAdd(botMessage(r.r));
        if (r.action) {
          chatQuick([r.action === "roadmap" ? "شوف خريطة الطريق" : r.action === "paths" ? "افتح مساراتك" : "منين أبدأ؟"]);
          window._botAction = r.action;
        } else chatQuick(QUICK);
        return;
      }
    }
    // بحث ويكي / AI
    chatQuick(["search ابحث على ويكي", "اسأل الذكاء الاصطناعي"]);
    const w = await wikiSearch(text.trim());
    if (w) {
      chatAdd(botMessage("🌐 **" + w.title + "**\n\n" + w.text + "\n\n_من ويكيبيديا — دوس «اسأل الذكاء الاصطناعي» لتفصيل أكتر_"));
      chatQuick(QUICK);
      return;
    }
    const a = await aiAnswer(text.trim());
    if (a) {
      chatAdd(botMessage("bot " + a));
      chatQuick(QUICK);
      return;
    }
    chatAdd(botMessage(FALLBACK));
    chatQuick(QUICK);
  }

  function sendChat(text) {
    if (!text || !text.trim()) return;
    if (typeof SOUND !== "undefined") SOUND.send();
    window._lastQ = text.trim();
    chatAdd(userMessage(text.trim()));
    chatQuick([]);
    $("#chatText").value = "";
    setTimeout(() => botReply(text.trim()), 400);
  }

  function initChat() {
    const fab = $("#chatFab"), panel = $("#chatPanel");
    if (!fab) return;
    fab.addEventListener("click", openChat);
    $("#chatClose").addEventListener("click", closeChat);
    $("#chatForm").addEventListener("submit", (e) => { e.preventDefault(); sendChat($("#chatText").value); });
    // إجراء سريع بعد رد المساعد
    $("#chatQuick").addEventListener("click", (e) => {
      const chip = e.target.closest("[data-chip]");
      if (!chip) return;
      const t = chip.dataset.chip;
      if (t === "شوف خريطة الطريق") { go("roadmap"); closeChat(); }
      else if (t === "افتح مساراتك") { go("paths"); closeChat(); }
      else if (t === "افتح المسار" && window._recPath) { const id = window._recPath; window._recPath = null; go("path", id); closeChat(); }
      else if (t === "search ابحث على ويكي") sendChat("ابحث لي على ويكي عن " + (window._lastQ || ""));
      else if (t === "اسأل الذكاء الاصطناعي") sendChat("اسأل الذكاء الاصطناعي: " + (window._lastQ || ""));
    });
  }

  /* ============ فوتر ============ */
  function renderFooter() {
    $("#footer").innerHTML =
      '<div class="wrap">' +
        '<div class="footer-grid">' +
          '<div><div class="footer-brand"><div class="brand-mark">' + logoSVG("wl-grad-f") + '</div><div><div class="brand-name">weston</div><div class="brand-sub">منصة الذكاء الاصطناعي بالعربي</div></div></div>' +
          '<div style="color:var(--muted);font-size:13.5px;max-width:300px">مسارات مرتّبة من الصفر إلى الاحتراف، بمصادر مجانية عالمية، وشهادات إتمام معتمدة.</div></div>' +
          "<div><h4>المنصة</h4>" +
            '<a href="#" data-go="tracks">المسارات</a><a href="#" data-go="courses">الكورسات</a><a href="#" data-go="dashboard">تقدّمي</a><a href="#" data-go="certs">الشهادات</a></div>' +
          "<div><h4>مصادر</h4>" +
            '<a href="#" data-go="tools">الأدوات</a><a href="#" data-go="faqs">الأسئلة الشائعة</a><a href="https://www.edraak.org/" target="_blank">إدراك</a><a href="https://rwaq.org/" target="_blank">رواق</a></div>' +
          "<div><h4>تواصل</h4>" +
            '<a href="https://wa.me/201212439985" target="_blank">واتساب</a></div>' +
          "<div><h4>المدير</h4>" +
            '<a href="#" data-go="admin">لوحة المدير</a></div>' +
        "</div>" +
        '<div class="footer-bottom"><span>weston — مسار مجاني كامل لتعلم الذكاء الاصطناعي.</span><span id="footStat"></span></div>' +
      "</div>";
    $$("#footer [data-go]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); go(a.dataset.go); }));
  }

  /* ============ عوام ============ */
  function updateFloat() { const f = $("#floatBar"); if (f) f.style.width = percent() + "%"; }
  function updateFoot() { const f = $("#footStat"); if (f) f.textContent = "أتممت " + doneLessons() + " درس • " + doneHours() + " ساعة"; }

  function refresh() {
    renderHome(); renderMyPlan(); renderTracks(); renderCourses(); renderCerts(); renderTools(); renderFaqs(); renderDashboard();
    renderCourseGrid();
    updateFloat(); updateFoot();
  }

  /* ============ بوابة الدخول ============ */
  function applyGate(forceHide) {
    const gate = $("#gate");
    if (!gate) return;
    const u = (typeof AUTH !== "undefined") ? AUTH.current() : null;
    if (forceHide || u) { gate.classList.remove("show"); document.body.classList.remove("locked"); }
    else { gate.classList.add("show"); document.body.classList.add("locked"); }
  }

  /* ============ الحساب ============ */
  let authMode = "login";
  function openAuth(mode) {
    setAuthMode(mode || "login");
    $("#authModal").classList.add("open");
    setTimeout(() => { const f = $(authMode === "register" ? "#authName" : "#authEmail"); if (f) f.focus(); }, 120);
  }
  function closeAuth() { $("#authModal").classList.remove("open"); }
  function setAuthMode(m) {
    authMode = m;
    $$("#authModal .auth-tab").forEach((t) => t.classList.toggle("active", t.dataset.authtab === m));
    $("#authNameField").style.display = m === "register" ? "block" : "none";
    $("#authSubmit").textContent = m === "register" ? "اعمل حساب" : "دخول";
    $("#authMsg").textContent = "";
    $("#authMsg").className = "auth-msg";
    $("#authPass").autocomplete = m === "register" ? "new-password" : "current-password";
  }
  async function submitAuth(e) {
    e.preventDefault();
    const btn = $("#authSubmit"), msg = $("#authMsg");
    const data = { name: $("#authName").value, email: $("#authEmail").value, password: $("#authPass").value };
    btn.disabled = true;
    btn.textContent = "استنى لحظة…";
    const res = authMode === "register" ? await AUTH.register(data) : await AUTH.login(data);
    btn.disabled = false;
    btn.textContent = authMode === "register" ? "اعمل حساب" : "دخول";
    if (!res.ok) {
      msg.className = "auth-msg err";
      msg.textContent = res.msg;
      if (typeof SOUND !== "undefined") SOUND.error();
      return;
    }
    msg.className = "auth-msg ok";
    msg.textContent = res.msg;
    reloadState();
    // اسحب التقدم من السحابة بعد الدخول/التسجيل
    if (typeof AUTH !== "undefined" && AUTH.cloud) {
      try {
        const remote = await AUTH.pullProgress();
        if (remote) { state.done = remote.done || {}; state.plan = remote.plan || {}; }
      } catch (e) {}
    }
    save();
    updateAccountBtn();
    refresh();
    if (typeof SOUND !== "undefined") SOUND.success();
    applyGate();
    setTimeout(() => { closeAuth(); go("account"); }, 700);
  }
  async function logout() {
    if (typeof AUTH !== "undefined" && AUTH.logout) { try { await AUTH.logout(); } catch (e) {} }
    reloadState();
    updateAccountBtn();
    toast("تم تسجيل الخروج");
    applyGate();
    view = "home";
    $$(".view").forEach((x) => x.classList.remove("active"));
    const h = $("#view-home"); if (h) { h.classList.add("active"); renderHome(); }
    window.scrollTo({ top: 0 });
  }
  function updateAccountBtn() {
    const btn = $("#btnAccount");
    if (!btn) return;
    const u = AUTH.current();
    if (u) {
      btn.innerHTML = '<span class="acc-avatar">' + esc(AUTH.initials(u.name)) + "</span>";
      btn.title = u.name;
      btn.classList.add("is-user");
    } else {
      btn.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>';
      btn.title = "حسابي";
      btn.classList.remove("is-user");
    }
  }
  function renderAccount() {
    const el = $("#view-account");
    if (!el) return;
    const u = AUTH.current();
    if (!u) {
      el.innerHTML =
        '<div class="wrap"><section class="section"><div class="acc-empty">' +
          '<div class="acc-empty-icon">👤</div>' +
          '<h3>لسه مفيش حساب</h3>' +
          "<p>اعمل حساب عشان يبقى لتك تقدمك الخاص على كل جهاز، وتقدر ترجع ليه في أي وقت.</p>" +
          '<div class="acc-empty-btns">' +
            '<button class="btn btn-primary" data-open-auth="register">اعمل حساب</button>' +
            '<button class="btn btn-ghost" data-open-auth="login">عندي حساب</button>' +
          "</div>" +
        "</div></section></div>";
      $$("#view-account [data-open-auth]").forEach((b) => b.addEventListener("click", () => openAuth(b.dataset.openAuth)));
      return;
    }
    const doneLessons = Object.keys(state.done).length;
    const totalLessons = ACADEMY.courses.reduce((s, c) => s + ((c.lessons || []).length || 0), 0);
    const doneCourses = ACADEMY.courses.filter((c) => courseComplete(c.id)).length;
    const pct = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;
    el.innerHTML =
      '<div class="wrap"><section class="section">' +
        '<div class="section-head"><div class="eyebrow">حسابي</div><div class="section-title">ملفي الشخصي</div>' +
        '<div class="section-sub">تقدّمك مربوط بحسابك — بيتحفظ تلقائياً.</div>' +
        '<span class="acc-mode ' + ((typeof AUTH !== "undefined" && AUTH.cloud) ? "cloud" : "local") + '">' +
          ((typeof AUTH !== "undefined" && AUTH.cloud) ? icon("globe", 14) + " حساب سحابي — بيشتغل على كل الأجهزة" : icon("cpu", 14) + " حساب محلي على هذا الجهاز") +
        "</span></div>" +
        '<div class="acc-grid">' +
          '<div class="acc-card acc-profile">' +
            '<div class="acc-avatar-lg">' + esc(AUTH.initials(u.name)) + "</div>" +
            "<div><div class=\"acc-name\">" + esc(u.name) + '</div><div class="acc-mail">' + esc(u.email) + "</div>" +
            '<div class="acc-since">عضو weston</div></div>' +
          "</div>" +
          '<div class="acc-card acc-stats">' +
            '<div class="acc-stat"><b>' + doneLessons + '</b><span>درس مكتمل</span></div>' +
            '<div class="acc-stat"><b>' + doneCourses + '</b><span>كورس خلصته</span></div>' +
            '<div class="acc-stat"><b>' + ACADEMY.certs.length + '</b><span>شهادة متاحة</span></div>' +
          "</div>" +
        "</div>" +
        '<div class="acc-card acc-progress"><div class="acc-progress-top"><span>نسبة الإنجاز</span><b>' + pct + '%</b></div>' +
          '<div class="acc-bar"><span style="width:' + pct + '%"></span></div></div>' +
        '<div class="acc-actions">' +
          '<button class="btn btn-ghost" id="accGoDash">تقدّمي بالتفصيل</button>' +
          '<button class="btn btn-ghost" id="accExport">تصدير التقدم</button>' +
          '<button class="btn btn-danger" id="accLogout">تسجيل الخروج</button>' +
        "</div>" +
        '<p class="auth-note">حسابك وتقدّمك في السحابة — بيشتغلوا على كل أجهزتك. مفيش مشاركة مع أي طرف.</p>' +
      "</section></div>";
    const d = $("#accGoDash"); if (d) d.addEventListener("click", () => go("dashboard"));
    const ex = $("#accExport"); if (ex) ex.addEventListener("click", exportProgress);
    const lo = $("#accLogout"); if (lo) lo.addEventListener("click", logout);
  }

  /* ============ لوحة المدير ============ */
  function adminApi(path, opts) {
    return fetch((typeof AUTH !== "undefined" ? AUTH.API : "https://rakm-wahid.pages.dev/api") + path, opts).then((r) => r.json()).catch(() => ({ ok: false, msg: "مشكلة اتصال" }));
  }

  function renderAdmin() {
    const el = $("#view-admin");
    if (!el) return;
    el.innerHTML =
      '<div class="wrap"><section class="section">' +
        '<div class="section-head"><div class="eyebrow">المدير</div><div class="section-title">لوحة المدير</div>' +
        '<div class="section-sub">كل اللي سجلوا في المنصة — الاسم والإيميل وعدد الدروس وتاريخ التسجيل.</div></div>' +
        '<div class="admin-box">' +
          '<div class="admin-row">' +
            '<input id="adminKey" type="password" placeholder="كلمة سر المدير" autocomplete="off">' +
            '<button class="btn btn-primary" id="adminLoad">اعرض المستخدمين</button>' +
            '<button class="btn btn-ghost" id="adminStatsBtn">إحصائيات</button>' +
          "</div>" +
          '<div class="admin-msg" id="adminMsg"></div>' +
          '<div id="adminStats"></div>' +
          '<div class="admin-table-wrap"><table class="admin-table" id="adminTable"></table></div>' +
        "</div>" +
        '<div class="admin-box admin-setkey">' +
          '<h4>تغيير مفتاح المدير</h4>' +
          '<div class="admin-row">' +
            '<input id="adminOld" type="password" placeholder="المفتاح الحالي">' +
            '<input id="adminNew" type="password" placeholder="مفتاح جديد (6 حروف+)" autocomplete="off">' +
            '<button class="btn btn-ghost" id="adminSetKey">حفظ</button>' +
          "</div>" +
        "</div>" +
      "</section></div>";

    const load = $("#adminLoad"), msg = $("#adminMsg");
    async function loadUsers() {
      const key = $("#adminKey").value.trim();
      if (!key) { msg.className = "admin-msg err"; msg.textContent = "اكتب كلمة سر المدير"; return; }
      msg.className = "admin-msg"; msg.textContent = "بتتحمل…";
      const d = await adminApi("/admin?key=" + encodeURIComponent(key));
      if (!d || !d.ok) {
        msg.className = "admin-msg err";
        msg.textContent = (d && d.msg) || "مشكلة في الاتصال";
        $("#adminTable").innerHTML = "";
        $("#adminStats").innerHTML = "";
        return;
      }
      msg.className = "admin-msg ok";
      msg.textContent = d.count + " مستخدم مسجل";
      const rows = d.users.map((u) => {
        const dt = u.createdAt ? new Date(u.createdAt).toLocaleDateString("ar-EG") : "—";
        return '<tr><td>' + esc(u.name) + "</td><td>" + esc(u.email) + '</td><td class="num">' + u.lessons + '</td><td>' + dt + '</td>' +
          '<td><button class="admin-del" data-email="' + esc(u.email) + '">حذف</button></td></tr>';
      }).join("");
      $("#adminTable").innerHTML =
        "<thead><tr><th>الاسم</th><th>الإيميل</th><th>دروس</th><th>التسجيل</th><th></th></tr></thead><tbody>" +
        (rows || '<tr><td colspan="5" style="text-align:center;color:var(--muted)">مفيش مستخدمين لسه</td></tr>') +
        "</tbody>";
      $$("#adminTable [data-email]").forEach((b) => b.addEventListener("click", async () => {
        if (!confirm("متأكد عايز تحذف " + b.dataset.email + "؟")) return;
        const r = await adminApi("/admin", { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify({ key: $("#adminKey").value.trim(), action: "remove", email: b.dataset.email }) });
        if (r && r.ok) { loadUsers(); }
        else { msg.className = "admin-msg err"; msg.textContent = (r && r.msg) || "فشل الحذف"; }
      }));
    }
    if (load) load.addEventListener("click", loadUsers);
    const ak = $("#adminKey"); if (ak) ak.addEventListener("keydown", (e) => { if (e.key === "Enter") loadUsers(); });

    const sb = $("#adminStatsBtn");
    if (sb) sb.addEventListener("click", async () => {
      const key = $("#adminKey").value.trim();
      const d = await adminApi("/admin", { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify({ key, action: "stats" }) });
      if (!d || !d.ok) { msg.className = "admin-msg err"; msg.textContent = (d && d.msg) || "مشكلة"; return; }
      msg.className = "admin-msg ok"; msg.textContent = "إحصائيات";
      $("#adminStats").innerHTML =
        '<div class="admin-stats"><div class="as"><b>' + d.users + '</b><span>مستخدم</span></div>' +
        '<div class="as"><b>' + d.activeSessions + '</b><span>جلسة نشطة</span></div>' +
        '<div class="as"><b>' + d.totalLessons + '</b><span>درس مكتمل</span></div></div>';
    });

    const sk = $("#adminSetKey");
    if (sk) sk.addEventListener("click", async () => {
      const oldKey = $("#adminOld").value.trim(), newKey = $("#adminNew").value.trim();
      const d = await adminApi("/admin", { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify({ action: "setkey", oldKey, newKey }) });
      msg.className = "admin-msg " + (d && d.ok ? "ok" : "err");
      msg.textContent = (d && d.msg) || "مشكلة";
      if (d && d.ok) { $("#adminOld").value = ""; $("#adminNew").value = ""; }
    });
  }

  /* ============ بحث ============ */
  function onSearch(e) { query = e.target.value || ""; if (view !== "courses") go("courses"); applyCourseFilter(); }

  /* ============ درج البحث (موبايل) ============ */
  function openSearchDrawer() {
    $("#searchDrawer").classList.add("open");
    $("#searchInput").focus();
    if ($("#searchInput").value) runDrawerSearch();
  }
  function closeSearchDrawer() {
    $("#searchDrawer").classList.remove("open");
    $("#searchInput").value = "";
    $("#searchResults").innerHTML = "";
  }
  function runDrawerSearch() {
    const q = ($("#searchInput").value || "").trim();
    const box = $("#searchResults");
    if (!q) { box.innerHTML = ""; return; }
    const ql = q.toLowerCase();
    const res = [];
    ACADEMY.courses.forEach((c) => {
      if ((c.title + " " + (c.titleEn || "") + " " + c.desc).toLowerCase().includes(ql))
        res.push({ icon: "cap", name: c.title, sub: c.trackTitle || "", kind: "كورس", go: "courses" });
    });
    ACADEMY.tracks.forEach((t) => {
      if ((t.title + " " + t.tagline).toLowerCase().includes(ql))
        res.push({ icon: icon(t.icon, 18), name: t.title, sub: t.tagline, kind: "مسار", go: "tracks" });
    });
    if (typeof PATHS !== "undefined") PATHS.forEach((p) => {
      if ((p.title + " " + (p.tagline || "")).toLowerCase().includes(ql))
        res.push({ icon: icon(p.icon || "compass", 18), name: p.title, sub: p.tagline || "", kind: "مسار مهني", go: "paths" });
    });
    if (typeof TOOLS !== "undefined") TOOLS.forEach((t) => {
      if ((t.n + " " + t.d).toLowerCase().includes(ql))
        res.push({ icon: "🛠️", name: t.n, sub: t.d, kind: "أداة", go: "tools" });
    });
    box.innerHTML = res.length
      ? res.slice(0, 12).map((r) =>
          '<div class="search-result" data-go="' + r.go + '"><span class="sr-icon">' + r.icon + '</span><span class="sr-txt"><b>' + esc(r.name) + '</b><small>' + esc(r.sub) + '</small></span><span class="sr-kind">' + r.kind + "</span></div>"
        ).join("")
      : '<div class="search-empty">مفيش نتائج لـ «' + esc(q) + "»</div>";
    $$("#searchResults [data-go]").forEach((el) => el.addEventListener("click", () => { closeSearchDrawer(); go(el.dataset.go); }));
  }


  /* ============ تصدير/استيراد ============ */
  function exportProgress() {
    const data = { app: "weston", version: 1, exportedAt: new Date().toISOString(), done: state.done };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "weston-progress.json";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast("تم تصدير تقدّمك");
  }
  function importProgress(file) {
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (!d || typeof d !== "object") throw 0;
        state.done = d.done || {}; save(); refresh();
        toast("تم استيراد تقدّمك بنجاح");
      } catch (e) { toast("ملف غير صالح"); }
    };
    r.readAsText(file);
  }

  /* ============ تهيئة ============ */
  async function init() {
    // تجهيز الحسابات أولاً (سحابي أو محلي) قبل أي رسم
    if (typeof AUTH !== "undefined" && AUTH.init) { try { await AUTH.init(); } catch (e) {} }
    reloadState();
    // اسحب التقدم من السحابة لو فيه حساب محفوظ
    if (typeof AUTH !== "undefined" && AUTH.cloud && AUTH.current()) {
      try {
        const remote = await AUTH.pullProgress();
        if (remote) { state.done = remote.done || state.done || {}; state.plan = remote.plan || state.plan || {}; save(); }
      } catch (e) {}
    }
    updateStreak();
    initChat();
    document.documentElement.setAttribute("data-theme", state.theme);
    $("#brand").addEventListener("click", () => go("home"));
    $$(".topnav button").forEach((b) => b.addEventListener("click", () => go(b.dataset.view)));
    $("#btnMenu").addEventListener("click", () => $("#topnav").classList.toggle("open"));
    $("#btnExport").addEventListener("click", exportProgress);
    $("#btnImport").addEventListener("click", () => $("#importFile").click());
    $("#importFile").addEventListener("change", (e) => { if (e.target.files[0]) importProgress(e.target.files[0]); e.target.value = ""; });
    $("#search").addEventListener("input", onSearch);
    $("#btnSearch").addEventListener("click", openSearchDrawer);
    $("#searchClose").addEventListener("click", closeSearchDrawer);
    $("#searchInput").addEventListener("input", runDrawerSearch);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSearchDrawer(); });
    // زر الصوت
    const btnSound = $("#btnSound");
    if (btnSound) {
      btnSound.addEventListener("click", (e) => {
        e.stopPropagation();
        const on = SOUND.toggle();
        btnSound.classList.toggle("off", !on);
        btnSound.title = on ? "المؤثرات الصوتية: مفعّلة" : "المؤثرات الصوتية: متوقفة";
        toast(on ? "الصوت مفعّل" : "الصوت متوقف");
      });
    }
    // نقرة عامة على الأزرار
    document.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b && !b.id?.includes("Sound") && typeof SOUND !== "undefined") SOUND.click();
    });
    // الحساب
    applyGate();
    updateAccountBtn();
    const accBtn = $("#btnAccount");
    if (accBtn) accBtn.addEventListener("click", () => { const u = AUTH.current(); if (u) go("account"); else openAuth("login"); });
    const authClose = $("#authClose");
    if (authClose) authClose.addEventListener("click", closeAuth);
    const modal = $("#authModal");
    if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeAuth(); });
    $$("#authModal .auth-tab").forEach((t) => t.addEventListener("click", () => setAuthMode(t.dataset.authtab)));
    const authForm = $("#authForm");
    if (authForm) authForm.addEventListener("submit", submitAuth);
    document.addEventListener("click", (e) => {
      const oa = e.target.closest("[data-open-auth]");
      if (oa) openAuth(oa.dataset.openAuth);
    });
    document.addEventListener("click", (e) => {
      const g = e.target.closest("[data-gate]");
      if (g) openAuth(g.dataset.gate);
    });
    document.addEventListener("click", (e) => {
      const ga = e.target.closest("[data-gate-admin]");
      if (ga) go("admin");
    });
    // رابط مباشر: ?admin=1
    try {
      if (new URLSearchParams(location.search).get("admin") === "1") go("admin");
    } catch (e) {}

    renderFooter();
    refresh();
  }

  document.addEventListener("DOMContentLoaded", () => { init(); });
})();
