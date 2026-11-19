/* =========================================================
   weston — إعدادات Firebase
   =========================================================
   الخطوات (5 دقايق):
   1) افتح https://console.firebase.google.com
   2) «Add project» → اكتب اسم (مثلاً weston-academy) → Continue
   3) اقفل Google Analytics (مش مطلوب) → Create project
   4) من القائمة الجانبية: Build → Authentication → Get started
   5) تبويب Sign-in method → Email/Password → فعّل أول واحد → Save
   6) أعلى الصفحة: Project Overview → أيقونة الويب </> → اكتب اسم → Register
   7) هتشوف «Firebase SDK snippet» → انسخ القيم وحطها هنا
   ========================================================= */

const FIREBASE_CONFIG = {
  apiKey: "ضع apiKey هنا",
  authDomain: "ضع authDomain هنا",
  projectId: "ضع projectId هنا",
  appId: "ضع appId هنا",
};

/* هل السحابة جاهزة؟ */
const FIREBASE_ENABLED = !(
  !FIREBASE_CONFIG.apiKey ||
  FIREBASE_CONFIG.apiKey === "ضع apiKey هنا" ||
  !FIREBASE_CONFIG.projectId ||
  FIREBASE_CONFIG.projectId === "ضع projectId هنا"
);
