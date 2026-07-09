const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Destination = require('../models/Destination');
const Tour = require('../models/Tour');
const Review = require('../models/Review');
const Service = require('../models/Service');
const Visit = require('../models/Visit');
const Booking = require('../models/Booking');
const { fallbackDestinations, fallbackTours, fallbackReviews, fallbackServices } = require('../data/sampleData');
const { parsePrice, formatPrice } = require('../utils/price');

// Gán id ổn định (vd. "fallback-0") cho dữ liệu mẫu để trang chi tiết/đặt tour vẫn
// hoạt động được ngay cả khi MongoDB chưa kết nối/chưa seed dữ liệu.
const fallbackToursWithId = fallbackTours.map((t, i) => ({ ...t, _id: `fallback-${i}` }));

function findFallbackTour(id) {
  return fallbackToursWithId.find((t) => t._id === id);
}

async function loadContent() {
  try {
    const [destinations, tours, reviews, services] = await Promise.all([
      Destination.find().sort({ order: 1 }).lean(),
      Tour.find().sort({ order: 1 }).lean(),
      Review.find().sort({ order: 1 }).lean(),
      Service.find().sort({ order: 1 }).lean(),
    ]);

    return {
      destinations: destinations.length ? destinations : fallbackDestinations,
      tours: tours.length ? tours : fallbackToursWithId,
      reviews: reviews.length ? reviews : fallbackReviews,
      services: services.length ? services : fallbackServices,
    };
  } catch (err) {
    console.error('Không thể lấy dữ liệu từ MongoDB, dùng dữ liệu mẫu:', err.message);
    return {
      destinations: fallbackDestinations,
      tours: fallbackToursWithId,
      reviews: fallbackReviews,
      services: fallbackServices,
    };
  }
}

// Lấy tour theo id: thử MongoDB trước, nếu không phải ObjectId hợp lệ hoặc không tìm thấy,
// thử tiếp trong dữ liệu mẫu (fallback) để trang vẫn hoạt động khi chưa có MongoDB.
async function getTourById(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      const tour = await Tour.findById(id).lean();
      if (tour) return tour;
    } catch (err) {
      console.error('Lỗi truy vấn tour:', err.message);
    }
  }
  return findFallbackTour(id) || null;
}

router.get('/', async (req, res) => {
  try {
    const content = await loadContent();

    res.render('index', {
      title: 'VIETBLUETOUR - Khám Phá Việt Nam Theo Phong Cách Riêng',
      ...content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Có lỗi khi tải dữ liệu từ MongoDB. Bạn đã chạy "npm run seed" chưa?');
  }
});

// Domestic tours page
router.get('/tour-trong-nuoc', (req, res) => {
  res.render('tour-trong-nuoc', {
    title: 'Tour Trong Nước - VIETBLUETOUR'
  });
});

// International tours page
router.get('/tour-nuoc-ngoai', (req, res) => {
  res.render('tour-nuoc-ngoai', {
    title: 'Tour Nước Ngoài - VIETBLUETOUR'
  });
});

// Tour detail page
router.get('/tour-detail/:id', async (req, res) => {
  try {
    const tour = await getTourById(req.params.id);
    if (!tour) {
      return res.status(404).render('404', { title: 'Không tìm thấy tour' });
    }

    // Ghi nhận lượt truy cập tour (không chặn phản hồi trang nếu lỗi, chỉ áp dụng cho tour thật trong DB)
    if (mongoose.Types.ObjectId.isValid(tour._id)) {
      Visit.create({
        tourId: tour._id,
        tourName: tour.name,
        visitorId: req.visitorId,
      }).catch((err) => console.error('Không thể ghi lượt truy cập:', err.message));
    }

    res.render('tour-detail', {
      title: `${tour.name} - VIETBLUETOUR`,
      tour
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Có lỗi xảy ra.');
  }
});

// GET /dat-tour/:id - Trang form đặt tour
router.get('/dat-tour/:id', async (req, res) => {
  try {
    const tour = await getTourById(req.params.id);
    if (!tour) {
      return res.status(404).render('404', { title: 'Không tìm thấy tour' });
    }
    res.render('booking', {
      title: `Đặt Tour: ${tour.name} - VIETBLUETOUR`,
      tour,
      formatPrice,
      unitPriceNumber: parsePrice(tour.price),
      error: null,
      old: {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Có lỗi xảy ra.');
  }
});

// POST /dat-tour/:id - Xử lý đặt tour
router.post('/dat-tour/:id', async (req, res) => {
  try {
    const tour = await getTourById(req.params.id);
    if (!tour) {
      return res.status(404).render('404', { title: 'Không tìm thấy tour' });
    }

    const { customerName, customerEmail, customerPhone, numberOfGuests, departureDate, notes } = req.body;
    const guests = Math.max(1, parseInt(numberOfGuests, 10) || 1);

    if (!customerName || !customerPhone || !departureDate) {
      return res.status(400).render('booking', {
        title: `Đặt Tour: ${tour.name} - VIETBLUETOUR`,
        tour,
        formatPrice,
        unitPriceNumber: parsePrice(tour.price),
        error: 'Vui lòng điền đầy đủ Họ tên, Số điện thoại và Ngày khởi hành.',
        old: req.body,
      });
    }

    // Đặt tour cần lưu vào MongoDB thật - kiểm tra nhanh để tránh treo trang nếu chưa kết nối được
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).render('booking', {
        title: `Đặt Tour: ${tour.name} - VIETBLUETOUR`,
        tour,
        formatPrice,
        unitPriceNumber: parsePrice(tour.price),
        error: 'Hệ thống chưa kết nối được cơ sở dữ liệu nên chưa thể lưu đơn đặt tour. Vui lòng gọi hotline 0969 691 889 để được hỗ trợ đặt tour trực tiếp, hoặc thử lại sau ít phút.',
        old: req.body,
      });
    }

    const unitPrice = parsePrice(tour.price);
    const totalPrice = unitPrice * guests;
    const isRealTour = mongoose.Types.ObjectId.isValid(tour._id);

    const booking = await Booking.create({
      customerName: customerName.trim(),
      customerEmail: (customerEmail || '').trim(),
      customerPhone: customerPhone.trim(),
      tourId: isRealTour ? tour._id : undefined,
      tourName: tour.name,
      unitPrice,
      totalPrice,
      numberOfGuests: guests,
      departureDate: new Date(departureDate),
      notes: (notes || '').trim(),
      visitorId: req.visitorId,
      status: 'pending',
    });

    // Đánh dấu lượt truy cập gần nhất của khách với tour này là "đã đặt" (chỉ áp dụng tour thật)
    if (isRealTour) {
      Visit.findOneAndUpdate(
        { tourId: tour._id, visitorId: req.visitorId },
        { converted: true },
        { sort: { createdAt: -1 } }
      ).catch((err) => console.error('Không thể cập nhật Visit:', err.message));
    }

    res.redirect(`/dat-tour-thanh-cong/${booking.bookingCode}`);
  } catch (err) {
    console.error(err);
    const tour = await getTourById(req.params.id).catch(() => null);
    res.status(500).render('booking', {
      title: tour ? `Đặt Tour: ${tour.name} - VIETBLUETOUR` : 'Đặt Tour - VIETBLUETOUR',
      tour: tour || { _id: req.params.id, name: 'Tour', location: '', duration: '', image: '', price: '0₫' },
      formatPrice,
      unitPriceNumber: tour ? parsePrice(tour.price) : 0,
      error: 'Có lỗi xảy ra khi đặt tour. Vui lòng thử lại hoặc gọi hotline 0969 691 889.',
      old: req.body,
    });
  }
});

// GET /dat-tour-thanh-cong/:code - Trang xác nhận đặt tour thành công
router.get('/dat-tour-thanh-cong/:code', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingCode: req.params.code }).lean();
    if (!booking) {
      return res.status(404).render('404', { title: 'Không tìm thấy đơn đặt tour' });
    }
    res.render('booking-success', {
      title: 'Đặt Tour Thành Công - VIETBLUETOUR',
      booking,
      formatPrice,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Có lỗi xảy ra.');
  }
});

// About Us page
router.get('/ve-chung-toi', (req, res) => {
  res.render('about', {
    title: 'Về Chúng Tôi - VIETBLUETOUR'
  });
});

// Contact page
router.get('/lien-he', (req, res) => {
  res.render('contact', {
    title: 'Liên Hệ - VIETBLUETOUR'
  });
});

// Visa services page
router.get('/visa', (req, res) => {
  res.render('visa', {
    title: 'Dịch Vụ Visa - VIETBLUETOUR'
  });
});

// Combo & Voucher page
router.get('/combo-voucher', (req, res) => {
  res.render('combo-voucher', {
    title: 'Combo & Voucher - VIETBLUETOUR'
  });
});

// Homestay & Villa page
router.get('/homestay-villa', (req, res) => {
  res.render('homestay-villa', {
    title: 'Homestay & Villa - VIETBLUETOUR'
  });
});

module.exports = router;
