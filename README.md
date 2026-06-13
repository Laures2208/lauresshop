# Laures Shop - Trải nghiệm Mua Bán Acc Game eSports

Dự án này sử dụng thư viện hoạt ảnh **Framer Motion** (nay đã được định danh và nâng cấp với tên gọi mới nhất là `motion`) để xử lý các hiệu ứng 3D và tương tác cực kỳ mượt mà.

## 1. Hướng Dẫn Cài Đặt Framer Motion

Nếu bạn chạy source code này trên máy cá nhân, hãy mở Terminal (trong thư mục gốc của dự án) và chạy dòng lệnh sau để cài đặt:

```bash
# Cài đặt thư viện motion (phiên bản mới và tốt nhất của framer-motion)
npm install motion
```

*(Lưu ý: Bạn cũng có thể dùng `npm install framer-motion`, tuy nhiên ở phiên bản mới nhất, tác giả đã chuyển sang package `motion` với cú pháp import là `motion/react` để tối ưu dung lượng và hiệu năng).*

Sau khi cài đặt thành công, hãy khởi động web bằng lệnh:
```bash
npm run dev
```

## 2. Cách Sử Dụng Trong Khối Code

Bạn có thể tham khảo component `HeroSection.tsx` hoặc `AccountCard3D.tsx` trong thư mục `src/components/`.

**Cú pháp cơ bản:**
```jsx
// Import thư viện
import { motion } from 'motion/react';

// Sử dụng thẻ motion thay cho thẻ HTML thường
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Nội dung xuất hiện từ dưới lên
</motion.div>

// Hiệu ứng nút bấm 3D Hover & Click
<motion.button
  whileHover={{ scale: 1.1, y: -5 }}
  whileTap={{ scale: 0.9 }}
>
  Click Me!
</motion.button>
```
