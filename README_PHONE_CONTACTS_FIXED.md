# إصلاح استدعاء أرقام الهاتف — مساعد المدرس الذكي

تم إصلاح Plugin جهات الاتصال ليعمل كتطبيق Android أصلي مع Capacitor 7.

- الزر يفتح دفتر جهات اتصال الهاتف باستخدام Android Contacts Provider.
- يتم اختيار جهة اتصال تحتوي على رقم هاتف.
- يعاد الاسم والرقم إلى JavaScript عبر `PhoneContacts.pickPhoneContact()`.
- تم تنظيم Plugin في المسار الصحيح `contacts-plugin/android`.
- تم الإبقاء على Web fallback للمتصفحات التي تدعم Contact Picker.
- ملف البناء يتأكد من وجود `www/index.html` قبل تشغيل Capacitor.

## البناء

```bash
npm install
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

في GitHub Actions يتم تنفيذ نفس الخطوات تلقائيًا.
