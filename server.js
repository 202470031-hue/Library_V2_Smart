const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
// المنفذ الافتراضي 3000 محلياً، ويتغير تلقائياً في السحابة
const PORT = process.env.PORT || 3000;

// 🔗 رابط مجلد جوجل درايف (ضع الـ ID الخاص بمجلد الـ 2 تيرابايت هنا)
const CLOUD_BASE_URL = "https://drive.google.com/drive/folders/اكتب_هنا_ايدي_مجلد_جوجل_درايف";

// مصفوفات لإدارة الأجهزة المحظورة والمتصلة
const connectedDevices = new Map(); // IP -> Connection Time
const bannedIPs = new Set();

// التأكد من وجود مجلد المكتبة الرئيسي محلياً (لتفادي الأخطاء أثناء الفحص المحلي)
const libraryRoot = path.join(__dirname, 'library');
if (!fs.existsSync(libraryRoot)) {
    fs.mkdirSync(libraryRoot, { recursive: true });
}

// 🛡️ جدار حماية (Middleware) لفحص الحظر ومراقبة الأجهزة المتصلة
app.use((req, res, next) => {
    let ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ip.includes('::ffff:')) {
        ip = ip.replace('::ffff:', ''); // تنظيف الـ IP من البادئة IPv6
    }
    
    // التحقق من قائمة الحظر
    if (bannedIPs.has(ip)) {
        return res.status(403).send('❌ Access Denied: You have been kicked/banned from this server.');
    }
    
    // تسجيل وقت دخول الجهاز لأول مرة حساباً للمدة
    if (!connectedDevices.has(ip)) {
        connectedDevices.set(ip, Date.now());
    }
    next();
});

// تفعيل مشاركة الملفات الثابتة (واجهة المستخدم) والمكتبة المحلية
app.use(express.static(__dirname));
app.use('/library', express.static(libraryRoot));

// ⚙️ إعدادات نظام رفع الملفات والمجلدات الذكي (Multer)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const currentPath = req.body.currentPath || "";
        const targetDir = path.join(libraryRoot, currentPath);
        
        // إنشاء المجلد الفرعي تلقائياً إذا لم يكن موجوداً
        fs.mkdirSync(targetDir, { recursive: true });
        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// 1️⃣ API: جلب الملفات والمجلدات بشكل شجري وديناميكي للواجهة
app.get('/api/materials', (req, res) => {
    const relPath = req.query.path || "";
    const targetDir = path.join(libraryRoot, relPath);

    // حماية أمنية حرجّة: منع محاولات الخروج عن مجلد library الرئيسي عبر التلاعب بالمسارات
    if (!targetDir.startsWith(libraryRoot)) {
        return res.status(403).json({ error: "Access denied" });
    }

    if (!fs.existsSync(targetDir)) {
        return res.json([]);
    }

    fs.readdir(targetDir, { withFileTypes: true }, (err, files) => {
        if (err) return res.status(500).json({ error: "Failed to read directory" });
        
        const materials = files.map(file => ({
            name: file.name,
            is_dir: file.isDirectory(),
            cloudPath: CLOUD_BASE_URL
        }));
        res.json(materials);
    });
});

// 2️⃣ API: استقبال الملفات والمجلدات المرفوعة من لوحة التحكم
app.post('/api/upload', upload.array('files'), (req, res) => {
    res.sendStatus(200);
});

// 3️⃣ API: حذف الملفات أو المجلدات بالكامل
app.delete('/api/delete', (req, res) => {
    const itemPath = req.query.path;
    if (!itemPath) return res.sendStatus(400);

    const target = path.join(libraryRoot, itemPath);
    if (!target.startsWith(libraryRoot)) {
        return res.status(403).send("Access denied");
    }

    if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true });
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// 4️⃣ API: عرض الأجهزة المتصلة حالياً وحساب مدة نشاطها بالثواني والدقائق
app.get('/api/devices', (req, res) => {
    const list = [];
    connectedDevices.forEach((startTime, ip) => {
        const diff = Date.now() - startTime;
        const hrs = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const mins = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const secs = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        
        list.push({ ip, duration: `${hrs}:${mins}:${secs}` });
    });
    res.json(list);
});

// 5️⃣ API: طرد وحظر جهاز معين عبر الـ IP لمنعه من التحميل والتصفح
app.post('/api/kick', (req, res) => {
    const ip = req.query.ip;
    if (ip) {
        bannedIPs.add(ip);
        connectedDevices.delete(ip);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

// 🚀 تشغيل السيرفر ودعم الـ Binding على كل الشبكات ليتوافق مع السحاب والمحلي
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Smart Library Cloud-Ready Server is RUNNING!`);
    console.log(`==================================================`);
    console.log(`[+] Active Port: ${PORT}`);
    console.log(`[+] System Status: 🟢 Server is live and listening...`);
    console.log(`==================================================\n`);
});