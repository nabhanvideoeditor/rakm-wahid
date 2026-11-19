# تفعيل الحسابات السحابية (Firebase) — weston

الحساب دلوقتي بيتحفظ **على الجهاز فقط**. لو عايز الحساب يشتغل على أي جهاز (موبايل + كمبيوتر + أي متصفح)، فعّل Firebase — **5 دقايق**.

---

## الخطوات

### 1) اعمل مشروع Firebase
- افتح: https://console.firebase.google.com
- دوس **Add project**
- اكتب الاسم: `weston-academy`
- اقفل **Google Analytics** (مش مطلوب) → **Create project** → **Continue**

### 2) فعّل تسجيل الدخول بالإيميل
- من القائمة الجانبية: **Build → Authentication**
- دوس **Get started**
- تبويب **Sign-in method**
- **Email/Password** → فعّل أول خيار (Enable) → **Save**

### 3) اعمل تطبيق ويب واخد المفاتيح
- أعلى الصفحة دوس أيقونة **</>** (إضافة تطبيق ويب)
- اكتب الاسم: `weston-web`
- **بلاش** علامة من «Firebase Hosting»
- دوس **Register app**
- هتظهر لك كود زي ده:

```js
const firebaseConfig = {
  apiKey: "AIzaSyD....",
  authDomain: "weston-academy.firebaseapp.com",
  projectId: "weston-academy",
  appId: "1:123456789:web:abcdef",
};
```

### 4) حط المفاتيح في الملف
- افتح الملف: `assets/js/firebase-config.js`
- استبدل القيم الأربعة بالمفاتيح بتاعتك:

```js
const FIREBASE_CONFIG = {
  apiKey: "المفتاح بتاعك",
  authDomain: "النطاق بتاعك",
  projectId: "الـ ID بتاعك",
  appId: "الـ App ID بتاعك",
};
```

### 5) انشر التحديث
```
wrangler pages deploy . --project-name rakm-wahid --branch main --commit-dirty=true
```

---

## بعد التفعيل

- الحساب هيشتغل على **كل الأجهزة** تلقائياً
- لو جرّب تسجيل إيميل مستخدم → هيظهر له «الإيميل مستخدم بالفعل — سجّل دخول»
- صفحة حسابك هتغيّر المؤشر لـ «☁️ حساب سحابي — بيشتغل على كل الأجهزة»

## ملاحظات
- لو المفاتيح فاضية، الموقع يشتغل بالوضع المحلي (احتياطي) — مفيش أي توقف.
- تقدّمك بيتحفظ على جهازك (localStorage) مربوط بإيميل حسابك.
- مفاتيح Firebase دي **مفاتيح عامة** ومصممة للظهور في المتصفح — الأمان بيحكمه قواعد Firebase.
