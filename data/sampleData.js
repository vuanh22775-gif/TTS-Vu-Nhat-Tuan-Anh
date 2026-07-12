const fallbackDestinations = [
  { name: 'Đà Nẵng – Hội An', region: 'Miền Trung', tours: 24, image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=700&q=80&auto=format&fit=crop', order: 1 },
  { name: 'Đà Lạt', region: 'Tây Nguyên', tours: 18, image: 'https://images.unsplash.com/photo-1775151870524-b4f81665dfe7?w=700&q=80&auto=format&fit=crop', order: 2 },
  { name: 'Nha Trang', region: 'Miền Trung', tours: 21, image: 'https://images.unsplash.com/photo-1690316731203-3aa7f9eea7f8?w=700&q=80&auto=format&fit=crop', order: 3 },
  { name: 'Hạ Long – Cát Bà', region: 'Miền Bắc', tours: 16, image: 'https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?w=700&q=80&auto=format&fit=crop', order: 4 },
];

const fallbackTours = [
  { _id: 'fallback-0', name: 'Đà Nẵng – Hội An Luxury', location: 'Đà Nẵng, Hội An', duration: '4N3Đ', price: '3.990.000₫', originalPrice: '4.990.000₫', badge: 'Bán chạy', badgeColor: '#C9A96E', rating: 4.9, reviews: 238, image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=700&q=80&auto=format&fit=crop', order: 1, type: 'domestic' },
  { _id: 'fallback-1', name: 'Hạ Long Cruise Premium', location: 'Hạ Long, Quảng Ninh', duration: '3N2Đ', price: '5.990.000₫', badge: 'HOT', badgeColor: '#E84C3D', rating: 4.8, reviews: 312, image: 'https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?w=700&q=80&auto=format&fit=crop', order: 2, type: 'domestic' },
  { _id: 'fallback-2', name: 'Đà Lạt Romantic Escape', location: 'Đà Lạt, Lâm Đồng', duration: '3N2Đ', price: '2.990.000₫', originalPrice: '3.490.000₫', badge: 'Tiết kiệm', badgeColor: '#046148', rating: 4.7, reviews: 184, image: 'https://images.unsplash.com/photo-1775151870524-b4f81665dfe7?w=700&q=80&auto=format&fit=crop', order: 3, type: 'domestic' },
  { _id: 'fallback-3', name: 'Nha Trang Resort & Sea', location: 'Nha Trang, Khánh Hòa', duration: '4N3Đ', price: '3.490.000₫', badge: 'Mới', badgeColor: '#C9A96E', rating: 4.8, reviews: 143, image: 'https://images.unsplash.com/photo-1690316731203-3aa7f9eea7f8?w=700&q=80&auto=format&fit=crop', order: 4, type: 'domestic' },
  { _id: 'fallback-4', name: 'Phú Quốc Island Paradise', location: 'Phú Quốc, Kiên Giang', duration: '4N3Đ', price: '6.490.000₫', originalPrice: '7.290.000₫', badge: '-11%', badgeColor: '#E84C3D', rating: 4.9, reviews: 201, image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=700&q=80&auto=format&fit=crop', order: 5, type: 'domestic' },
  { _id: 'fallback-5', name: 'Sapa & Hà Nội Heritage', location: 'Sapa, Lào Cai', duration: '5N4Đ', price: '4.790.000₫', originalPrice: '5.500.000₫', badge: '-13%', badgeColor: '#C9A96E', rating: 4.9, reviews: 156, image: 'https://images.unsplash.com/photo-1694152491511-ff12adad9223?w=700&q=80&auto=format&fit=crop', order: 6, type: 'domestic' },
  { _id: 'fallback-6', name: 'Quy Nhơn – Phú Yên Discovery', location: 'Quy Nhơn, Bình Định', duration: '4N3Đ', price: '3.290.000₫', badge: 'Mới', badgeColor: '#046148', rating: 4.6, reviews: 72, image: 'https://images.unsplash.com/photo-1715949227016-aa23cab9950a?w=700&q=80&auto=format&fit=crop', order: 7, type: 'domestic' },
  { _id: 'fallback-7', name: 'Huế Cố Đô Trải Nghiệm', location: 'Huế, Thừa Thiên Huế', duration: '3N2Đ', price: '2.890.000₫', badge: 'Văn hóa', badgeColor: '#046148', rating: 4.7, reviews: 88, image: 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=700&q=80&auto=format&fit=crop', order: 8, type: 'domestic' },
  { _id: 'fallback-8', name: 'Côn Đảo Biển Xanh Bí Ẩn', location: 'Côn Đảo, Bà Rịa - Vũng Tàu', duration: '3N2Đ', price: '5.290.000₫', badge: 'Khám phá', badgeColor: '#C9A96E', rating: 4.8, reviews: 64, image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=700&q=80&auto=format&fit=crop', order: 9, type: 'domestic' },
  { _id: 'fallback-9', name: 'Mũi Né – Phan Thiết Getaway', location: 'Phan Thiết, Bình Thuận', duration: '2N1Đ', price: '1.890.000₫', badge: 'Cuối tuần', badgeColor: '#C9A96E', rating: 4.5, reviews: 132, image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=700&q=80&auto=format&fit=crop', order: 10, type: 'domestic' },
  { _id: 'fallback-10', name: 'Ninh Bình – Tràng An Kỳ Quan', location: 'Ninh Bình', duration: '2N1Đ', price: '1.690.000₫', badge: 'Mới', badgeColor: '#046148', rating: 4.8, reviews: 96, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=700&q=80&auto=format&fit=crop', order: 11, type: 'domestic' },
  { _id: 'fallback-11', name: 'Cần Thơ Miệt Vườn Sông Nước', location: 'Cần Thơ', duration: '2N1Đ', price: '1.990.000₫', badge: 'Tiết kiệm', badgeColor: '#046148', rating: 4.6, reviews: 58, image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=700&q=80&auto=format&fit=crop', order: 12, type: 'domestic' },
  { _id: 'fallback-12', name: 'Singapore City Break', location: 'Singapore', duration: '4N3Đ', price: '12.990.000₫', badge: 'Mới', badgeColor: '#C9A96E', rating: 4.8, reviews: 97, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=700&q=80&auto=format&fit=crop', order: 13, type: 'international' },
  { _id: 'fallback-13', name: 'Tokyo & Kyoto Discovery', location: 'Nhật Bản', duration: '5N4Đ', price: '19.990.000₫', originalPrice: '22.500.000₫', badge: '-13%', badgeColor: '#C9A96E', rating: 4.9, reviews: 156, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&q=80&auto=format&fit=crop', order: 14, type: 'international' },
  { _id: 'fallback-14', name: 'Dubai Luxury Escape', location: 'Dubai', duration: '6N5Đ', price: '24.990.000₫', badge: 'Premium', badgeColor: '#046148', rating: 4.6, reviews: 72, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&q=80&auto=format&fit=crop', order: 15, type: 'international' },
  { _id: 'fallback-15', name: 'Seoul & Nami Island K-Style', location: 'Hàn Quốc', duration: '5N4Đ', price: '15.990.000₫', originalPrice: '17.900.000₫', badge: '-11%', badgeColor: '#E84C3D', rating: 4.8, reviews: 210, image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=700&q=80&auto=format&fit=crop', order: 16, type: 'international' },
  { _id: 'fallback-16', name: 'Bangkok – Pattaya Sun & Fun', location: 'Thái Lan', duration: '4N3Đ', price: '8.990.000₫', badge: 'Bán chạy', badgeColor: '#C9A96E', rating: 4.7, reviews: 268, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=700&q=80&auto=format&fit=crop', order: 17, type: 'international' },
  { _id: 'fallback-17', name: 'Châu Âu Cổ Kính: Ý – Pháp – Thụy Sĩ', location: 'Châu Âu', duration: '9N8Đ', price: '48.990.000₫', badge: 'Cao cấp', badgeColor: '#046148', rating: 4.9, reviews: 45, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=700&q=80&auto=format&fit=crop', order: 18, type: 'international' },
  { _id: 'fallback-18', name: 'Vũng Tàu Biển Gần Sài Gòn', location: 'Vũng Tàu', duration: '2N1Đ', price: '1.590.000₫', badge: 'Cuối tuần', badgeColor: '#C9A96E', rating: 4.5, reviews: 110, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=700&q=80&auto=format&fit=crop', order: 19, type: 'domestic' },
  { _id: 'fallback-19', name: 'Hà Giang Mùa Hoa Tam Giác Mạch', location: 'Hà Giang', duration: '3N2Đ', price: '2.690.000₫', badge: 'Khám phá', badgeColor: '#046148', rating: 4.9, reviews: 76, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=700&q=80&auto=format&fit=crop', order: 20, type: 'domestic' },
  { _id: 'fallback-20', name: 'Cát Bà Đảo Ngọc Xanh', location: 'Cát Bà, Hải Phòng', duration: '2N1Đ', price: '1.790.000₫', badge: 'Mới', badgeColor: '#C9A96E', rating: 4.6, reviews: 54, image: 'https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?w=700&q=80&auto=format&fit=crop', order: 21, type: 'domestic' },
  { _id: 'fallback-21', name: 'Kuala Lumpur – Malacca Discovery', location: 'Malaysia', duration: '4N3Đ', price: '9.490.000₫', badge: 'Mới', badgeColor: '#C9A96E', rating: 4.6, reviews: 63, image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=700&q=80&auto=format&fit=crop', order: 22, type: 'international' },
  { _id: 'fallback-22', name: 'Ấn Độ Huyền Bí: Taj Mahal & Delhi', location: 'Ấn Độ', duration: '6N5Đ', price: '18.990.000₫', badge: 'Khám phá', badgeColor: '#046148', rating: 4.7, reviews: 38, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&q=80&auto=format&fit=crop', order: 23, type: 'international' },
  { _id: 'fallback-23', name: 'Sydney – Melbourne Nước Úc Xa Hoa', location: 'Úc', duration: '7N6Đ', price: '35.990.000₫', originalPrice: '39.900.000₫', badge: '-10%', badgeColor: '#E84C3D', rating: 4.9, reviews: 29, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=700&q=80&auto=format&fit=crop', order: 24, type: 'international' },
];

const fallbackReviews = [
  { name: 'Nguyễn Thị Lan', location: 'Hà Nội', tour: 'Tour Hạ Long 3N2Đ', rating: 5, initials: 'NL', avatarBg: '#046148', order: 1, text: 'Chuyến đi thật sự tuyệt vời!' },
  { name: 'Trần Văn Minh', location: 'TP. Hồ Chí Minh', tour: 'Tour Đà Nẵng – Hội An 4N3Đ', rating: 5, initials: 'TM', avatarBg: '#054d3a', order: 2, text: 'Dịch vụ chuyên nghiệp và chu đáo.' },
];

const fallbackServices = [
  { title: 'Dịch vụ Visa', href: '#visa', icon: 'visa', order: 1, desc: 'Hỗ trợ xin visa nhanh chóng trên 50+ quốc gia.' },
  { title: 'Thuê xe du lịch', href: '#transport', icon: 'car', order: 2, desc: 'Đội xe hiện đại, tài xế chuyên nghiệp.' },
  { title: 'Vé máy bay', href: '#flight', icon: 'flight', order: 3, desc: 'Đặt vé nội địa và quốc tế giá tốt.' },
  { title: 'Homestay & Villa', href: '#homestay', icon: 'home', order: 4, desc: 'Bộ sưu tập nghỉ dưỡng cao cấp.' },
];

module.exports = {
  fallbackDestinations,
  fallbackTours,
  fallbackReviews,
  fallbackServices,
};
//hehehehe