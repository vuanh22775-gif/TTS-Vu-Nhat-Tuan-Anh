const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Tour = require('../models/Tour');
const { fallbackTours } = require('../data/sampleData');

// POST /api/leads - lưu thông tin form "Nhận tư vấn" (VBTCTA) vào MongoDB
router.post('/leads', async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!phone || !phone.trim()) {
      return res.status(400).json({ ok: false, message: 'Vui lòng nhập số điện thoại.' });
    }

    const lead = await Lead.create({ name: (name || '').trim(), phone: phone.trim() });

    res.json({ ok: true, message: 'Đã nhận thông tin! Chuyên gia sẽ gọi lại sớm.', lead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
  }
});

// GET /api/tours - lấy danh sách tours
router.get('/tours', async (req, res) => {
  try {
    const tours = await Tour.find().sort({ order: 1 }).lean();
    const type = req.query.type;
    const list = tours.length ? tours : fallbackTours;

    if (type === 'domestic') {
      return res.json(list.filter((tour) => (tour.type || 'domestic') !== 'international'));
    } else if (type === 'international') {
      return res.json(list.filter((tour) => tour.type === 'international'));
    }

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Có lỗi xảy ra.' });
  }
});

// GET /api/tours/:id - lấy chi tiết tour
router.get('/tours/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).lean();
    if (!tour) {
      return res.status(404).json({ ok: false, message: 'Không tìm thấy tour.' });
    }
    res.json(tour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Có lỗi xảy ra.' });
  }
});

module.exports = router;
