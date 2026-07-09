require('dotenv').config();
const connectDB = require('./config/db');
const Destination = require('./models/Destination');
const Tour = require('./models/Tour');
const Review = require('./models/Review');
const Service = require('./models/Service');
const Visa = require('./models/Visa');
const ComboVoucher = require('./models/ComboVoucher');

const destinations = [
  { name: 'Đà Nẵng – Hội An', region: 'Miền Trung', tours: 24, image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=700&q=80&auto=format&fit=crop', order: 1 },
  { name: 'Đà Lạt', region: 'Tây Nguyên', tours: 18, image: 'https://images.unsplash.com/photo-1775151870524-b4f81665dfe7?w=700&q=80&auto=format&fit=crop', order: 2 },
  { name: 'Nha Trang', region: 'Miền Trung', tours: 21, image: 'https://images.unsplash.com/photo-1690316731203-3aa7f9eea7f8?w=700&q=80&auto=format&fit=crop', order: 3 },
  { name: 'Hạ Long – Cát Bà', region: 'Miền Bắc', tours: 16, image: 'https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?w=700&q=80&auto=format&fit=crop', order: 4 },
  { name: 'Quy Nhơn – Phú Yên', region: 'Miền Trung', tours: 12, image: 'https://images.unsplash.com/photo-1715949227016-aa23cab9950a?w=700&q=80&auto=format&fit=crop', order: 5 },
  { name: 'Sapa – Hà Nội', region: 'Miền Bắc', tours: 19, image: 'https://images.unsplash.com/photo-1694152491511-ff12adad9223?w=700&q=80&auto=format&fit=crop', order: 6 },
  { name: 'Đà Nẵng – Cầu Rồng', region: 'Miền Trung', tours: 15, image: 'https://images.unsplash.com/photo-1558002890-c0b30998d1e6?w=700&q=80&auto=format&fit=crop', order: 7 },
];

const tours = [
  { name: 'Đà Nẵng – Hội An Luxury', location: 'Đà Nẵng, Hội An', duration: '4N3Đ', price: '3.990.000₫', originalPrice: '4.990.000₫', badge: 'Bán chạy', badgeColor: '#C9A96E', rating: 4.9, reviews: 238, image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=700&q=80&auto=format&fit=crop', order: 1, type: 'domestic' },
  { name: 'Hạ Long Cruise Premium', location: 'Hạ Long, Quảng Ninh', duration: '3N2Đ', price: '5.990.000₫', badge: 'HOT', badgeColor: '#E84C3D', rating: 4.8, reviews: 312, image: 'https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?w=700&q=80&auto=format&fit=crop', order: 2, type: 'domestic' },
  { name: 'Đà Lạt Romantic Escape', location: 'Đà Lạt, Lâm Đồng', duration: '3N2Đ', price: '2.990.000₫', originalPrice: '3.490.000₫', badge: 'Tiết kiệm', badgeColor: '#046148', rating: 4.7, reviews: 184, image: 'https://images.unsplash.com/photo-1775151870524-b4f81665dfe7?w=700&q=80&auto=format&fit=crop', order: 3, type: 'domestic' },
  { name: 'Nha Trang Resort & Sea', location: 'Nha Trang, Khánh Hòa', duration: '4N3Đ', price: '3.490.000₫', badge: 'Mới', badgeColor: '#C9A96E', rating: 4.8, reviews: 97, image: 'https://images.unsplash.com/photo-1690316731203-3aa7f9eea7f8?w=700&q=80&auto=format&fit=crop', order: 4, type: 'domestic' },
  { name: 'Phú Quốc Island Paradise', location: 'Phú Quốc, Kiên Giang', duration: '4N3Đ', price: '6.490.000₫', originalPrice: '7.290.000₫', badge: '-11%', badgeColor: '#E84C3D', rating: 4.9, reviews: 201, image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=700&q=80&auto=format&fit=crop', order: 5, type: 'domestic' },
  { name: 'Sapa & Hà Nội Heritage', location: 'Sapa, Lào Cai', duration: '5N4Đ', price: '4.790.000₫', originalPrice: '5.500.000₫', badge: '-13%', badgeColor: '#C9A96E', rating: 4.9, reviews: 156, image: 'https://images.unsplash.com/photo-1694152491511-ff12adad9223?w=700&q=80&auto=format&fit=crop', order: 6, type: 'domestic' },
  { name: 'Quy Nhơn – Phú Yên Discovery', location: 'Quy Nhơn, Bình Định', duration: '4N3Đ', price: '3.290.000₫', badge: 'Mới', badgeColor: '#046148', rating: 4.6, reviews: 72, image: 'https://images.unsplash.com/photo-1715949227016-aa23cab9950a?w=700&q=80&auto=format&fit=crop', order: 7, type: 'domestic' },
  { name: 'Huế Cố Đô Trải Nghiệm', location: 'Huế, Thừa Thiên Huế', duration: '3N2Đ', price: '2.890.000₫', badge: 'Văn hóa', badgeColor: '#046148', rating: 4.7, reviews: 88, image: 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=700&q=80&auto=format&fit=crop', order: 8, type: 'domestic' },
  { name: 'Côn Đảo Biển Xanh Bí Ẩn', location: 'Côn Đảo, Bà Rịa - Vũng Tàu', duration: '3N2Đ', price: '5.290.000₫', badge: 'Khám phá', badgeColor: '#C9A96E', rating: 4.8, reviews: 64, image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=700&q=80&auto=format&fit=crop', order: 9, type: 'domestic' },
  { name: 'Mũi Né – Phan Thiết Getaway', location: 'Phan Thiết, Bình Thuận', duration: '2N1Đ', price: '1.890.000₫', badge: 'Cuối tuần', badgeColor: '#C9A96E', rating: 4.5, reviews: 132, image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=700&q=80&auto=format&fit=crop', order: 10, type: 'domestic' },
  { name: 'Ninh Bình – Tràng An Kỳ Quan', location: 'Ninh Bình', duration: '2N1Đ', price: '1.690.000₫', badge: 'Mới', badgeColor: '#046148', rating: 4.8, reviews: 96, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=700&q=80&auto=format&fit=crop', order: 11, type: 'domestic' },
  { name: 'Cần Thơ Miệt Vườn Sông Nước', location: 'Cần Thơ', duration: '2N1Đ', price: '1.990.000₫', badge: 'Tiết kiệm', badgeColor: '#046148', rating: 4.6, reviews: 58, image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=700&q=80&auto=format&fit=crop', order: 12, type: 'domestic' },
  { name: 'Singapore City Break', location: 'Singapore', duration: '4N3Đ', price: '12.990.000₫', badge: 'Mới', badgeColor: '#C9A96E', rating: 4.8, reviews: 97, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=700&q=80&auto=format&fit=crop', order: 13, type: 'international' },
  { name: 'Tokyo & Kyoto Discovery', location: 'Nhật Bản', duration: '5N4Đ', price: '19.990.000₫', originalPrice: '22.500.000₫', badge: '-13%', badgeColor: '#C9A96E', rating: 4.9, reviews: 156, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&q=80&auto=format&fit=crop', order: 14, type: 'international' },
  { name: 'Dubai Luxury Escape', location: 'Dubai', duration: '6N5Đ', price: '24.990.000₫', badge: 'Premium', badgeColor: '#046148', rating: 4.6, reviews: 72, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&q=80&auto=format&fit=crop', order: 15, type: 'international' },
  { name: 'Seoul & Nami Island K-Style', location: 'Hàn Quốc', duration: '5N4Đ', price: '15.990.000₫', originalPrice: '17.900.000₫', badge: '-11%', badgeColor: '#E84C3D', rating: 4.8, reviews: 210, image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=700&q=80&auto=format&fit=crop', order: 16, type: 'international' },
  { name: 'Bangkok – Pattaya Sun & Fun', location: 'Thái Lan', duration: '4N3Đ', price: '8.990.000₫', badge: 'Bán chạy', badgeColor: '#C9A96E', rating: 4.7, reviews: 268, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=700&q=80&auto=format&fit=crop', order: 17, type: 'international' },
  { name: 'Châu Âu Cổ Kính: Ý – Pháp – Thụy Sĩ', location: 'Châu Âu', duration: '9N8Đ', price: '48.990.000₫', badge: 'Cao cấp', badgeColor: '#046148', rating: 4.9, reviews: 45, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=700&q=80&auto=format&fit=crop', order: 18, type: 'international' },
  { name: 'Vũng Tàu Biển Gần Sài Gòn', location: 'Vũng Tàu', duration: '2N1Đ', price: '1.590.000₫', badge: 'Cuối tuần', badgeColor: '#C9A96E', rating: 4.5, reviews: 110, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=700&q=80&auto=format&fit=crop', order: 19, type: 'domestic' },
  { name: 'Hà Giang Mùa Hoa Tam Giác Mạch', location: 'Hà Giang', duration: '3N2Đ', price: '2.690.000₫', badge: 'Khám phá', badgeColor: '#046148', rating: 4.9, reviews: 76, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=700&q=80&auto=format&fit=crop', order: 20, type: 'domestic' },
  { name: 'Cát Bà Đảo Ngọc Xanh', location: 'Cát Bà, Hải Phòng', duration: '2N1Đ', price: '1.790.000₫', badge: 'Mới', badgeColor: '#C9A96E', rating: 4.6, reviews: 54, image: 'https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?w=700&q=80&auto=format&fit=crop', order: 21, type: 'domestic' },
  { name: 'Kuala Lumpur – Malacca Discovery', location: 'Malaysia', duration: '4N3Đ', price: '9.490.000₫', badge: 'Mới', badgeColor: '#C9A96E', rating: 4.6, reviews: 63, image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=700&q=80&auto=format&fit=crop', order: 22, type: 'international' },
  { name: 'Ấn Độ Huyền Bí: Taj Mahal & Delhi', location: 'Ấn Độ', duration: '6N5Đ', price: '18.990.000₫', badge: 'Khám phá', badgeColor: '#046148', rating: 4.7, reviews: 38, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&q=80&auto=format&fit=crop', order: 23, type: 'international' },
  { name: 'Sydney – Melbourne Nước Úc Xa Hoa', location: 'Úc', duration: '7N6Đ', price: '35.990.000₫', originalPrice: '39.900.000₫', badge: '-10%', badgeColor: '#E84C3D', rating: 4.9, reviews: 29, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=700&q=80&auto=format&fit=crop', order: 24, type: 'international' },
];

const visas = [
  { country: 'Hàn Quốc', region: 'Châu Á', title: 'Visa du lịch Hàn Quốc', processingTime: '5-7 ngày', price: '2.500.000₫', description: 'Được Đại Sứ Quán Hàn Quốc chỉ định nộp visa đoàn C32.', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=700&q=80&auto=format&fit=crop', order: 1 },
  { country: 'Nhật Bản', region: 'Châu Á', title: 'Visa du lịch Nhật Bản', processingTime: '5-7 ngày', price: '2.200.000₫', description: 'Hỗ trợ hồ sơ nhanh chóng, tỷ lệ đậu cao.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&q=80&auto=format&fit=crop', order: 2 },
  { country: 'Schengen (Châu Âu)', region: 'Châu Âu', title: 'Visa Schengen đa quốc gia', processingTime: '10-15 ngày', price: '3.900.000₫', description: 'Áp dụng cho 27 nước khối Schengen.', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=700&q=80&auto=format&fit=crop', order: 3 },
  { country: 'Mỹ', region: 'Châu Mỹ', title: 'Visa du lịch Mỹ', processingTime: '20-30 ngày', price: '4.500.000₫', description: 'Tư vấn hồ sơ phỏng vấn chi tiết.', image: 'https://images.unsplash.com/photo-1501466044931-62695578adb3?w=700&q=80&auto=format&fit=crop', order: 4 },
  { country: 'Úc', region: 'Châu Úc', title: 'Visa du lịch Úc', processingTime: '15-20 ngày', price: '3.200.000₫', description: 'Hỗ trợ hồ sơ tài chính, lịch trình chi tiết.', image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=700&q=80&auto=format&fit=crop', order: 5 },
];

const combos = [
  { name: 'Đà Nẵng Luxury Resort 3N2Đ', type: 'resort', region: 'Miền Trung', originalPrice: '5.500.000₫', discountedPrice: '3.850.000₫', discount: '-30%', badge: 'Hot', badgeColor: '#E84C3D', description: 'Combo villa 5 sao + vé máy bay khứ hồi.', image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=700&q=80&auto=format&fit=crop', order: 1 },
  { name: 'Phú Quốc Flight + Hotel 4N3Đ', type: 'flight_hotel', region: 'Miền Nam', originalPrice: '7.900.000₫', discountedPrice: '6.200.000₫', discount: '-22%', badge: 'Mới', badgeColor: '#C9A96E', description: 'Vé máy bay + khách sạn 4 sao trung tâm.', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=700&q=80&auto=format&fit=crop', order: 2 },
  { name: 'Hà Nội Old Quarter Voucher', type: 'hotel', region: 'Miền Bắc', originalPrice: '2.200.000₫', discountedPrice: '1.490.000₫', discount: '-32%', badge: 'Bán chạy', badgeColor: '#046148', description: 'Voucher lưu trú 2N1Đ khách sạn phố cổ.', image: 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=700&q=80&auto=format&fit=crop', order: 3 },
];

const reviews = [
  { name: 'Nguyễn Thị Lan', location: 'Hà Nội', tour: 'Tour Hạ Long 3N2Đ', rating: 5, initials: 'NL', avatarBg: '#046148', order: 1,
    text: 'Chuyến đi thật sự tuyệt vời! Hướng dẫn viên nhiệt tình, am hiểu văn hóa địa phương. Khách sạn 5 sao, ẩm thực phong phú. VIETBLUETOUR đã tạo cho gia đình tôi những kỷ niệm không thể quên.' },
  { name: 'Trần Văn Minh', location: 'TP. Hồ Chí Minh', tour: 'Tour Đà Nẵng – Hội An 4N3Đ', rating: 5, initials: 'TM', avatarBg: '#054d3a', order: 2,
    text: 'Từ lần đầu liên hệ đến khi kết thúc tour, team VIETBLUETOUR luôn chuyên nghiệp và chu đáo. Lịch trình hợp lý, không bị gò bó. Đặc biệt phần ẩm thực Hội An rất ấn tượng!' },
  { name: 'Phạm Thị Hoa', location: 'Đà Nẵng', tour: 'Tour Đà Lạt 3N2Đ', rating: 5, initials: 'PH', avatarBg: '#046148', order: 3,
    text: 'Giá cực kỳ hợp lý so với chất lượng dịch vụ nhận được. Tôi đã đặt visa và tour cùng lúc, mọi thứ diễn ra suôn sẻ. Nhất định sẽ quay lại với VIETBLUETOUR cho chuyến tiếp theo!' },
  { name: 'Lê Công Tuấn', location: 'Hải Phòng', tour: 'Tour Sapa – Hà Nội 5N4Đ', rating: 5, initials: 'LT', avatarBg: '#033d30', order: 4,
    text: 'Lần đầu trải nghiệm Sapa với VIETBLUETOUR và tôi hoàn toàn bị chinh phục. Cảnh đẹp đến không ngờ, nhà hàng địa phương ngon xuất sắc, còn được tặng quà lưu niệm. 10/10!' },
  { name: 'Võ Thị Thanh', location: 'Cần Thơ', tour: 'Tour Nha Trang 4N3Đ', rating: 5, initials: 'VT', avatarBg: '#046148', order: 5,
    text: 'Dịch vụ thuê xe và đặt phòng villa của VIETBLUETOUR rất tiện lợi. Xe mới, tài xế lịch sự. Villa view biển cực đẹp. Sẽ giới thiệu cho tất cả bạn bè và đồng nghiệp!' },
];

const services = [
  { title: 'Dịch vụ Visa', href: '#visa', icon: 'visa', order: 1,
    desc: 'Hỗ trợ xin visa nhanh chóng trên 50+ quốc gia. Tỷ lệ thành công cao, hướng dẫn hồ sơ tận tình.' },
  { title: 'Thuê xe du lịch', href: '#transport', icon: 'car', order: 2,
    desc: 'Đội xe hiện đại, tài xế chuyên nghiệp. Cho thuê theo ngày, theo chặng, đón sân bay 24/7.' },
  { title: 'Vé máy bay', href: '#flight', icon: 'flight', order: 3,
    desc: 'Tìm kiếm & đặt vé máy bay giá tốt nhất. Nội địa và quốc tế, cập nhật lịch bay thời gian thực.' },
  { title: 'Homestay & Villa', href: '#homestay', icon: 'home', order: 4,
    desc: 'Bộ sưu tập homestay, villa cao cấp trên khắp Việt Nam. Giá ưu đãi, view đẹp, trải nghiệm địa phương.' },
];

async function seed() {
  await connectDB();

  await Promise.all([
    Destination.deleteMany({}),
    Tour.deleteMany({}),
    Review.deleteMany({}),
    Service.deleteMany({}),
    Visa.deleteMany({}),
    ComboVoucher.deleteMany({}),
  ]);

  await Destination.insertMany(destinations);
  await Tour.insertMany(tours);
  await Review.insertMany(reviews);
  await Service.insertMany(services);
  await Visa.insertMany(visas);
  await ComboVoucher.insertMany(combos);

  console.log('🌱 Đã seed dữ liệu mẫu vào MongoDB thành công!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Lỗi seed dữ liệu:', err);
  process.exit(1);
});
