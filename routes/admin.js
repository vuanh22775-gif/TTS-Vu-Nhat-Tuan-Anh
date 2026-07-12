const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import models
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const Lead = require('../models/Lead');
const Admin = require('../models/Admin');
const Visit = require('../models/Visit');
const Visa = require('../models/Visa');
const ComboVoucher = require('../models/ComboVoucher');
const { parsePrice, formatPrice } = require('../utils/price');

// Middleware to check if admin is logged in
const checkAuth = (req, res, next) => {
  if (!req.session.adminId) {
    return res.redirect('/admin/login');
  }
  next();
};

// Gắn trạng thái kết nối MongoDB vào mọi trang admin để hiển thị cảnh báo nếu chưa kết nối được
router.use((req, res, next) => {
  res.locals.dbConnected = mongoose.connection.readyState === 1;
  next();
});

// Với các thao tác ghi dữ liệu (POST), phản hồi ngay nếu chưa kết nối MongoDB,
// tránh treo trang ~10s do Mongoose buffering timeout.
router.use((req, res, next) => {
  if (req.method === 'POST' && req.path !== '/login' && mongoose.connection.readyState !== 1) {
    req.session.message = 'Chưa kết nối được MongoDB nên chưa thể lưu thay đổi. Vui lòng kiểm tra MONGODB_URI trong .env.';
    return res.redirect('back');
  }
  next();
});
// Gắn trạng thái kết nối kkk vào mọi trang admin để hiển thị cảnh báo nếu chưa kết nối được


// GET /admin/login - Show login page
router.get('/login', (req, res) => {
  res.render('admin/login', { message: req.session.message || '' });
  delete req.session.message;
});

// POST /admin/login - Process login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Demo credentials
    if (username === 'admin' && password === '123456') {
      req.session.adminId = 'admin-001';
      req.session.admin = { username: 'admin', fullName: 'Admin User' };
      return res.redirect('/admin/dashboard');
    }

    // Check database (commented out for demo)
    /*
    const admin = await Admin.findOne({ username });
    if (admin && admin.password === password) {
      req.session.adminId = admin._id;
      req.session.admin = admin;
      return res.redirect('/admin/dashboard');
    }
    */

    res.render('admin/login', { message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.render('admin/login', { message: 'Error during login' });
  }
});

// GET /admin/dashboard - Show admin dashboard
router.get('/dashboard', checkAuth, async (req, res) => {
  try {
    const toursCount = await Tour.countDocuments();
    const bookingsCount = await Booking.countDocuments({ status: 'pending' });
    const contactsCount = await Lead.countDocuments();

    const bookings = await Booking.find().limit(5).sort({ createdAt: -1 });
    const contacts = await Lead.find().limit(5).sort({ createdAt: -1 });

    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAgg[0] ? revenueAgg[0].total : 0;

    res.render('admin/dashboard', {
      title: 'Admin - Dashboard',
      user: req.session.admin || { fullName: 'Admin' },
      stats: {
        tours: toursCount,
        newBookings: bookingsCount,
        newContacts: contactsCount,
        totalRevenue,
      },
      bookings,
      contacts
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.render('admin/dashboard', {
      title: 'Admin - Dashboard',
      user: req.session.admin || { fullName: 'Admin' },
      stats: { tours: 0, newBookings: 0, newContacts: 0, totalRevenue: 0 },
      bookings: [],
      contacts: []
    });
  }
});

// GET /admin/reports - Báo cáo doanh thu & lượt truy cập / chuyển đổi đặt tour
router.get('/reports', checkAuth, async (req, res) => {
  try {
    // ----- 1. Doanh thu theo tháng (12 tháng gần nhất, không tính booking đã hủy) -----
    const revenueByMonthAgg = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    // ----- 2. Doanh thu & số đơn theo từng tour -----
    const revenueByTourAgg = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: '$tourId',
          tourName: { $first: '$tourName' },
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // ----- 3. Lượt truy cập theo từng tour (đã đặt / chưa đặt) -----
    const visitsByTourAgg = await Visit.aggregate([
      {
        $group: {
          _id: '$tourId',
          tourName: { $first: '$tourName' },
          totalVisits: { $sum: 1 },
          converted: { $sum: { $cond: ['$converted', 1, 0] } },
        },
      },
      { $sort: { totalVisits: -1 } },
    ]);

    // Gộp dữ liệu lượt truy cập + doanh thu theo tourId để hiển thị 1 bảng duy nhất
    const revenueByTourMap = new Map(
      revenueByTourAgg.map((r) => [String(r._id), r])
    );
    const tourStats = visitsByTourAgg.map((v) => {
      const rev = revenueByTourMap.get(String(v._id)) || { revenue: 0, bookings: 0 };
      const notBooked = Math.max(0, v.totalVisits - v.converted);
      const conversionRate = v.totalVisits > 0 ? Math.round((v.converted / v.totalVisits) * 100) : 0;
      return {
        tourId: v._id,
        tourName: v.tourName || rev.tourName || 'Không xác định',
        totalVisits: v.totalVisits,
        booked: v.converted,
        notBooked,
        conversionRate,
        revenue: rev.revenue || 0,
        bookingsCount: rev.bookings || 0,
      };
    });
    // Thêm các tour có booking nhưng chưa có lượt Visit ghi nhận (vd. dữ liệu cũ)
    revenueByTourAgg.forEach((r) => {
      if (!tourStats.find((t) => String(t.tourId) === String(r._id))) {
        tourStats.push({
          tourId: r._id,
          tourName: r.tourName,
          totalVisits: 0,
          booked: 0,
          notBooked: 0,
          conversionRate: 0,
          revenue: r.revenue,
          bookingsCount: r.bookings,
        });
      }
    });
    tourStats.sort((a, b) => b.revenue - a.revenue);

    // ----- 4. Tổng quan -----
    const totalRevenue = revenueByTourAgg.reduce((sum, r) => sum + r.revenue, 0);
    const totalBookings = await Booking.countDocuments({ status: { $ne: 'cancelled' } });
    const totalVisits = await Visit.countDocuments();
    const totalConverted = await Visit.countDocuments({ converted: true });
    const totalNotBooked = Math.max(0, totalVisits - totalConverted);
    const overallConversionRate = totalVisits > 0 ? Math.round((totalConverted / totalVisits) * 100) : 0;

    const maxMonthRevenue = Math.max(1, ...revenueByMonthAgg.map((m) => m.revenue));
    const maxTourVisits = Math.max(1, ...tourStats.map((t) => t.totalVisits));

    res.render('admin/reports', {
      title: 'Admin - Báo Cáo',
      user: req.session.admin || { fullName: 'Admin' },
      revenueByMonth: revenueByMonthAgg,
      tourStats,
      maxMonthRevenue,
      maxTourVisits,
      overview: {
        totalRevenue,
        totalBookings,
        totalVisits,
        totalConverted,
        totalNotBooked,
        overallConversionRate,
      },
    });
  } catch (error) {
    console.error('Reports error:', error);
    res.render('admin/reports', {
      title: 'Admin - Báo Cáo',
      user: req.session.admin || { fullName: 'Admin' },
      revenueByMonth: [],
      tourStats: [],
      maxMonthRevenue: 1,
      maxTourVisits: 1,
      overview: {
        totalRevenue: 0,
        totalBookings: 0,
        totalVisits: 0,
        totalConverted: 0,
        totalNotBooked: 0,
        overallConversionRate: 0,
      },
    });
  }
});

// GET /admin/tours - Manage tours
router.get('/tours', checkAuth, async (req, res) => {
  try {
    const tours = await Tour.find().sort({ order: 1 });
    res.render('admin/tours', {
      title: 'Admin - Manage Tours',
      user: req.session.admin || { fullName: 'Admin' },
      tours
    });
  } catch (error) {
    console.error('Tours error:', error);
    res.render('admin/tours', {
      title: 'Admin - Manage Tours',
      user: req.session.admin || { fullName: 'Admin' },
      tours: []
    });
  }
});

// POST /admin/tours - Create new tour
router.post('/tours', checkAuth, async (req, res) => {
  try {
    const { name, description, type, price, duration, location, image } = req.body;

    const newTour = new Tour({
      name,
      description,
      type: type || 'domestic',
      price: formatPrice(price), // lưu dạng "3.990.000₫" để đồng bộ với hiển thị ngoài trang chủ
      duration: `${duration}N${Math.max(1, parseInt(duration, 10) - 1 || 1)}Đ`,
      location,
      image,
      order: await Tour.countDocuments() + 1
    });

    await newTour.save();
    res.redirect('/admin/tours?success=Tour created successfully');
  } catch (error) {
    console.error('Create tour error:', error);
    res.redirect('/admin/tours?error=Error creating tour');
  }
});

// POST /admin/tours/:id/delete - Delete tour
router.post('/tours/:id/delete', checkAuth, async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
  } catch (error) {
    console.error('Delete tour error:', error);
  }
  res.redirect('/admin/tours');
});

// GET /admin/bookings - Manage bookings
router.get('/bookings', checkAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.render('admin/bookings', {
      title: 'Admin - Manage Bookings',
      user: req.session.admin || { fullName: 'Admin' },
      bookings: bookings || []
    });
  } catch (error) {
    console.error('Bookings error:', error);
    res.render('admin/bookings', {
      title: 'Admin - Manage Bookings',
      user: req.session.admin || { fullName: 'Admin' },
      bookings: []
    });
  }
});

// POST /admin/bookings/:id/status - Update booking status
router.post('/bookings/:id/status', checkAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (['pending', 'confirmed', 'cancelled'].includes(status)) {
      await Booking.findByIdAndUpdate(req.params.id, { status });
    }
  } catch (error) {
    console.error('Update booking status error:', error);
  }
  res.redirect('/admin/bookings');
});

// GET /admin/contacts - Manage contacts
router.get('/contacts', checkAuth, async (req, res) => {
  try {
    const contacts = await Lead.find().sort({ createdAt: -1 });
    res.render('admin/contacts', {
      title: 'Admin - Manage Contacts',
      user: req.session.admin || { fullName: 'Admin' },
      contacts: contacts || []
    });
  } catch (error) {
    console.error('Contacts error:', error);
    res.render('admin/contacts', {
      title: 'Admin - Manage Contacts',
      user: req.session.admin || { fullName: 'Admin' },
      contacts: []
    });
  }
});

// GET /admin/visas - Manage visa services
router.get('/visas', checkAuth, async (req, res) => {
  try {
    const visas = await Visa.find().sort({ order: 1 });
    res.render('admin/visas', {
      title: 'Admin - Manage Visa Services',
      user: req.session.admin || { fullName: 'Admin' },
      visas
    });
  } catch (error) {
    console.error('Visas error:', error);
    res.render('admin/visas', {
      title: 'Admin - Manage Visa Services',
      user: req.session.admin || { fullName: 'Admin' },
      visas: []
    });
  }
});

// POST /admin/visas - Create new visa service
router.post('/visas', checkAuth, async (req, res) => {
  try {
    const { country, region, title, processingTime, price, description, image } = req.body;
    await Visa.create({
      country,
      region,
      title,
      processingTime,
      price: formatPrice(price),
      description,
      image,
      order: await Visa.countDocuments() + 1,
    });
    res.redirect('/admin/visas');
  } catch (error) {
    console.error('Create visa error:', error);
    res.redirect('/admin/visas');
  }
});

// POST /admin/visas/:id/delete - Delete visa service
router.post('/visas/:id/delete', checkAuth, async (req, res) => {
  try {
    await Visa.findByIdAndDelete(req.params.id);
  } catch (error) {
    console.error('Delete visa error:', error);
  }
  res.redirect('/admin/visas');
});

// GET /admin/combos - Manage combos
router.get('/combos', checkAuth, async (req, res) => {
  try {
    const combos = await ComboVoucher.find().sort({ order: 1 });
    res.render('admin/combos', {
      title: 'Admin - Manage Combos',
      user: req.session.admin || { fullName: 'Admin' },
      combos
    });
  } catch (error) {
    console.error('Combos error:', error);
    res.render('admin/combos', {
      title: 'Admin - Manage Combos',
      user: req.session.admin || { fullName: 'Admin' },
      combos: []
    });
  }
});

// POST /admin/combos - Create new combo/voucher
router.post('/combos', checkAuth, async (req, res) => {
  try {
    const { name, type, region, originalPrice, discountedPrice, discount, badge, description, image } = req.body;
    await ComboVoucher.create({
      name,
      type,
      region,
      originalPrice: formatPrice(originalPrice),
      discountedPrice: formatPrice(discountedPrice),
      discount,
      badge,
      description,
      image,
      order: await ComboVoucher.countDocuments() + 1,
    });
    res.redirect('/admin/combos');
  } catch (error) {
    console.error('Create combo error:', error);
    res.redirect('/admin/combos');
  }
});

// POST /admin/combos/:id/delete - Delete combo/voucher
router.post('/combos/:id/delete', checkAuth, async (req, res) => {
  try {
    await ComboVoucher.findByIdAndDelete(req.params.id);
  } catch (error) {
    console.error('Delete combo error:', error);
  }
  res.redirect('/admin/combos');
});

// GET /admin/logout - Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
