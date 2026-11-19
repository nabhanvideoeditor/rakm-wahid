# إعداد تسجيل جوجل و GitHub — weston

الزرارين موجودين في الموقع وجاهزين. محتاجين منك **Client ID** (وجيت هاب **Client Secret**) — خطواتهم أقل من 10 دقايق وفيهم صور موثقة.

---

## 1) Google — Client ID

1. روح **https://console.cloud.google.com**
2. اعمل مشروع جديد (أو اختار واحد موجود) → **APIs & Services** → **Credentials**
3. اضغط **+ Create Credentials** → **OAuth client ID**
4. اختار النوع: **Web application**
5. سمّه: `weston`
6. حط في **Authorized JavaScript origins**:
   ```
   https://rakm-wahid.pages.dev
   ```
7. اضغط **Create** → هيظهرلك **Client ID** شكله:
   ```
   1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
   ```
8. **ابعتهولي** هنا في الشات.

> ملاحظة: لو لسه محتاج **OAuth consent screen**، اعمله الأول (External) وسمّي التطبيق `weston`.

---

## 2) GitHub — Client ID + Secret

1. روح **https://github.com/settings/developers**
2. **OAuth Apps** → **New OAuth App**
3. املأ:
   - **Application name**: `weston`
   - **Homepage URL**: `https://rakm-wahid.pages.dev`
   - **Authorization callback URL**: `https://rakm-wahid.pages.dev`
4. اضغط **Register application**
5. هتشوف **Client ID** — انسخه.
6. اضغط **Generate a new client secret** — انسخ الـ **Client secret** (مش هيتعرض تاني).

---

## 3) الإعداد على الخادم (أنا هعمله)

أول ما تبعتلي الـ IDs، هحطهم في متغيرات البيئة بتاعة Cloudflare Pages:

```
GOOGLE_CLIENT_ID     = (اللي هتبعته)
GITHUB_CLIENT_ID     = (اللي هتبعته)
GITHUB_CLIENT_SECRET = (اللي هتبعته)
```

وده بيتحط في **Cloudflare Dashboard → Pages → rakm-wahid → Settings → Environment variables** — أو أعمله من الـ CLI.

---

## بعد كده

هيبقى عندك في المودال:
```
[دخول]  أو سجّل بـ  [جوجل] [جيت هاب]
```
ولو جيت هاب مفيهوش إيميل عام، هتعرف ترجعه بالإيميل العادي.

---

## مشاكل ممكن تقابلك

| المشكلة | الحل |
|---|---|
| جوجل بتقول `redirect_uri_mismatch` | تأكد إن `https://rakm-wahid.pages.dev` موجود في Authorized origins و الـ Client ID صح |
| جيت هاب بتقول `bad_verification_code` | الكود قديم — اعمل تسجيل من الأول |
| نافذة جيت هاب مقفولة | اسمح بالنوافذ المنبثقة للموقع |
