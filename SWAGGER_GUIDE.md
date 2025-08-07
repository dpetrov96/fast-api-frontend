# 📚 Swagger Documentation Guide

## 🚀 Accessing Swagger UI

После като стартираш приложението с `python main.py`, отвори браузъра на:

**🔗 Swagger UI**: http://localhost:8000/docs  
**🔗 ReDoc**: http://localhost:8000/redoc  
**🔗 OpenAPI JSON**: http://localhost:8000/openapi.json

## 🔐 How to Test Authentication in Swagger

### Step 1: Register or Login
1. Разгъни секцията **🔐 Authentication**
2. Използвай **POST /auth/register** за нов потребител:
   ```json
   {
     "email": "test@example.com",
     "password": "securePassword123!",
     "full_name": "Test User"
   }
   ```
3. Или използвай **POST /auth/login** за съществуващ потребител
4. Копирай `access_token` от отговора

### Step 2: Authorize in Swagger
1. Натисни бутона 🔒 **Authorize** в горния десен ъгъл
2. В полето "Value" въведи: `Bearer YOUR_ACCESS_TOKEN`
   - Замени `YOUR_ACCESS_TOKEN` с реалният токен
   - Пример: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Натисни **Authorize**
4. Затвори диалога

### Step 3: Test Protected Endpoints
Сега можеш да тестваш защитените endpoint-и:
- **GET /auth/me** - Твоята потребителска информация
- **GET /protected/profile** - Детайлен профил
- **GET /protected/dashboard** - Персонализирано табло
- **POST /auth/refresh** - Нов токен

## 🎯 Swagger Features

### ✨ Enhanced Documentation
- **📝 Detailed Descriptions**: Всеки endpoint има подробно описание
- **💡 Examples**: Готови примери за заявки и отговори
- **🔐 Security Info**: Ясно указание кои endpoint-и изискват автентикация
- **📊 Response Codes**: Всички възможни HTTP статус кодове

### 🛠 Interactive Features
- **"Try it out"**: Тествай API директно от документацията
- **Code Generation**: Генериране на код за различни езици
- **Schema Explorer**: Разглеждане на структурата на данните
- **Authentication Testing**: Лесно тестване на защитени endpoint-и

## 📋 Available Endpoints

### 🔐 Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | User login | ❌ |
| GET | `/auth/me` | Current user info | ✅ |
| POST | `/auth/refresh` | Refresh token | ✅ |

### 🔒 Protected Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/protected/profile` | User profile | ✅ |
| GET | `/protected/dashboard` | User dashboard | ✅ |
| GET | `/protected/admin-only` | Admin endpoint | ✅ |

### ℹ️ General
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | API information | ❌ |
| GET | `/health` | Health check | ❌ |

## 🎨 Swagger UI Features

### 📱 Responsive Design
- Работи отлично на desktop и mobile
- Автоматично адаптиране на екрана

### 🔍 Search and Filter
- Търсене на endpoint-и по име
- Филтриране по tags
- Бърза навигация

### 📤 Export Options
- OpenAPI JSON/YAML export
- Postman collection export
- Code generation за multiple languages

## 🛡️ Security Features

### 🔐 JWT Authentication
- Автоматично добавяне на Authorization header
- Визуална индикация за защитени endpoint-и
- Token expiration handling

### 🔒 Authorization Testing
- Лесно тестване на различни потребители
- Бърза смяна на токени
- Clear error messages за неоторизирани заявки

## 💡 Tips for Usage

### 🎯 Best Practices
1. **Винаги започвай с authentication** - register или login първо
2. **Използвай примерите** - всеки endpoint има готови примери
3. **Провери response кодовете** - за разбиране на различните сценарии
4. **Тествай error cases** - пробвай невалидни данни за разбиране на валидацията

### 🔧 Troubleshooting
- **401 Unauthorized**: Провери дали токенът е валиден и правилно форматиран
- **422 Validation Error**: Провери format-а на заявката според schema-та
- **500 Internal Error**: Провери логовете на сървъра

## 🚀 Next Steps

След като тестваш API-то в Swagger:
1. **Integrate frontend**: Използвай API-то във frontend приложение
2. **Mobile app**: Създай mobile приложение с тези endpoint-и
3. **Extend functionality**: Добави нови features като password reset, email verification, etc.

---

**💡 Pro Tip**: Swagger UI е перфектен за споделяне на API документацията с други разработчици или клиенти!