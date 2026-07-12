// Chuyển chuỗi giá kiểu "3.990.000₫" hoặc "3,990,000đ" thành số nguyên VNĐ
function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  const digits = String(priceStr).replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

// Chuyển số nguyên thành chuỗi hiển thị kiểu "3.990.000₫"
function formatPrice(amount) {
  const n = Number(amount) || 0;
  return n.toLocaleString('vi-VN') + '₫';
}

module.exports = { parsePrice, formatPrice };
//hehehehe