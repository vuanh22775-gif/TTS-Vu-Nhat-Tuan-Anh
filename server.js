require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectDB = require('./config/db');


const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối MongoDB
connectDB();

// Cấu hình view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Tối ưu hiệu năng: nén gzip toàn bộ response (HTML/CSS/JS/JSON)
app.use(compression());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static assets: bật cache trình duyệt để giảm tải server & tăng tốc load lại trang
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '7d',
  etag: true,
}));
app.use('/media', express.static(path.join(__dirname, 'media'), {
  maxAge: '30d',
  etag: true,
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Gán visitorId ẩn danh (cookie 1 năm) để phục vụ thống kê lượt truy cập / tỉ lệ đặt tour
app.use((req, res, next) => {
  let visitorId = req.cookies && req.cookies.vbt_vid;
  if (!visitorId) {
    visitorId = crypto.randomBytes(16).toString('hex');
    res.cookie('vbt_vid', visitorId, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    });
  }
  req.visitorId = visitorId;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/admin'));

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Not Found' });
});

app.listen(PORT, () => {
  console.log(`🚀 VIETBLUETOUR đang chạy tại http://localhost:${PORT}`);
});
module.exports = app;