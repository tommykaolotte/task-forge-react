# Finix AI API Integration Guide

## Tổng quan

Project này đã được tích hợp sẵn với Finix AI API tại `http://finixai.mywire.org:8000`. Đây là hướng dẫn chi tiết về cách API được tích hợp và sử dụng trong ứng dụng.

## Cấu trúc API Integration

### 1. Cấu hình API (src/config/api.ts)
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://finixai.mywire.org:8000',
  ENDPOINTS: {
    HEALTH: '/health',
    TODOS: '/todos',
    // ... các endpoints khác
  },
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};
```

### 2. API Service (src/services/api.ts)
File này chứa tất cả các hàm để tương tác với Finix AI API:

- `healthCheck()` - Kiểm tra trạng thái API
- `getTodos()` - Lấy danh sách todos
- `createTodo()` - Tạo todo mới
- `updateTodo()` - Cập nhật todo
- `deleteTodo()` - Xóa todo
- `getStats()` - Lấy thống kê todos
- `searchTodos()` - Tìm kiếm todos
- `bulkUpdate()` - Cập nhật hàng loạt
- `bulkCreate()` - Tạo hàng loạt

### 3. Types (src/types/todo.ts)
Định nghĩa các kiểu dữ liệu TypeScript cho Todo:

```typescript
export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  due_date?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export type TodoStatus = 'pending' | 'in_progress' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high';
```

## Các tính năng đã được tích hợp

### ✅ CRUD Operations
- ✅ Tạo todo mới
- ✅ Đọc danh sách todos
- ✅ Cập nhật todo
- ✅ Xóa todo

### ✅ Advanced Features
- ✅ Tìm kiếm todos
- ✅ Lọc theo status, priority, tag
- ✅ Phân trang
- ✅ Thống kê
- ✅ Bulk operations

### ✅ Error Handling
- ✅ Request/Response interceptors
- ✅ Error logging
- ✅ User-friendly error messages
- ✅ Toast notifications

### ✅ UI Components
- ✅ Todo List view
- ✅ Kanban Board view
- ✅ Dashboard với thống kê
- ✅ Todo Form (tạo/chỉnh sửa)
- ✅ Search và Filter

## Cách test API Integration

### 1. Truy cập trang test API
Vào URL: `http://localhost:5173/api-test` (hoặc domain của bạn)

### 2. Sử dụng API Test Component
- Click vào icon Settings ⚙️ trong header
- Chạy các test để kiểm tra kết nối API:
  - **Health Check**: Kiểm tra API server có hoạt động không
  - **Get Todos**: Test lấy danh sách todos
  - **Create Todo**: Test tạo todo mới
  - **Get Stats**: Test lấy thống kê

### 3. Kiểm tra Console Logs
Mở Developer Tools và xem tab Console để thấy các API requests/responses được log.

## API Documentation

Finix AI API có documentation đầy đủ tại: http://finixai.mywire.org:8000/docs

### Các endpoints chính:

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/health` | Kiểm tra trạng thái API |
| GET | `/todos` | Lấy danh sách todos |
| POST | `/todos` | Tạo todo mới |
| GET | `/todos/{id}` | Lấy chi tiết todo |
| PUT | `/todos/{id}` | Cập nhật todo |
| DELETE | `/todos/{id}` | Xóa todo |
| PATCH | `/todos/{id}/status` | Cập nhật status |
| POST | `/todos/search` | Tìm kiếm todos |
| GET | `/todos/stats` | Lấy thống kê |
| PUT | `/todos/bulk` | Cập nhật hàng loạt |
| POST | `/todos/bulk` | Tạo hàng loạt |

## Cách chạy project

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy development server
```bash
npm run dev
```

### 3. Truy cập ứng dụng
- Main app: http://localhost:5173
- API test: http://localhost:5173/api-test

## Troubleshooting

### 1. Lỗi kết nối API
- Kiểm tra API server có đang chạy tại `http://finixai.mywire.org:8000`
- Kiểm tra network connectivity
- Xem console logs để biết chi tiết lỗi

### 2. CORS Issues
Nếu gặp CORS error, có thể cần cấu hình CORS trên server API hoặc sử dụng proxy.

### 3. Timeout Issues
API có timeout 10 giây. Nếu server phản hồi chậm, có thể tăng timeout trong `src/config/api.ts`.

## Customization

### Thay đổi API URL
Chỉnh sửa `BASE_URL` trong `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://your-api-domain.com',
  // ...
};
```

### Thêm Authentication
Uncomment và chỉnh sửa phần authorization trong `src/config/api.ts`:

```typescript
addAuth: (config: any) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}
```

### Thêm endpoints mới
Thêm vào `API_CONFIG.ENDPOINTS` và tạo functions tương ứng trong `todoApi`.

## Tài liệu tham khảo

- [Axios Documentation](https://axios-http.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Finix AI API Docs](http://finixai.mywire.org:8000/docs) 