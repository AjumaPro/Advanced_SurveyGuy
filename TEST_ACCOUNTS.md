# 🧪 Test Accounts for SurveyGuy

## 📋 **Available Test Accounts**

### **1. Demo User Account** 🎯
- **Email**: `demo@surveyguy.com`
- **Password**: `demo123456`
- **Name**: Demo User
- **User ID**: 4
- **Type**: Regular User
- **Status**: Approved

### **2. Manager User Account** 👨‍💼
- **Email**: `manager@surveyguy.com`
- **Password**: `manager123456`
- **Name**: Manager User
- **User ID**: 5
- **Type**: Regular User
- **Status**: Approved

### **3. Regular User Account** 👤
- **Email**: `user@surveyguy.com`
- **Password**: `user123456`
- **Name**: Regular User
- **User ID**: 6
- **Type**: Regular User
- **Status**: Approved

### **4. Previous Test Account** 🔧
- **Email**: `test@example.com`
- **Password**: `testpass123`
- **Name**: Test User
- **User ID**: 2
- **Type**: Regular User
- **Status**: Approved

---

## 🚀 **How to Use These Accounts**

### **Option 1: React Frontend (Recommended)**
1. **Open**: http://localhost:3002
2. **Click**: "Login" or "Sign Up"
3. **Enter**: Any of the credentials above
4. **Access**: All features of the application

### **Option 2: API Testing**
```bash
# Login with Demo account
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@surveyguy.com","password":"demo123456"}'

# Login with Manager account
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@surveyguy.com","password":"manager123456"}'

# Login with Regular User account
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@surveyguy.com","password":"user123456"}'
```

---

## 🎯 **Recommended Testing Flow**

### **1. Start with Demo Account**
- **Login**: `demo@surveyguy.com` / `demo123456`
- **Test**: Basic survey creation and management
- **Explore**: Dashboard, analytics, templates

### **2. Test Manager Account**
- **Login**: `manager@surveyguy.com` / `manager123456`
- **Test**: Team management features
- **Explore**: User management, permissions

### **3. Test Regular User Account**
- **Login**: `user@surveyguy.com` / `user123456`
- **Test**: Survey responses and participation
- **Explore**: Public survey features

---

## 🔐 **Account Features**

### **All Accounts Include:**
- ✅ **Full Authentication** - Login/logout working
- ✅ **JWT Tokens** - Secure session management
- ✅ **Profile Access** - User profile management
- ✅ **Survey Creation** - Create and manage surveys
- ✅ **Analytics Access** - View survey analytics
- ✅ **Template Library** - Access survey templates
- ✅ **Team Features** - Team management (if applicable)

### **Account Permissions:**
- **User Type**: All accounts are "Regular User" type
- **Approval Status**: All accounts are pre-approved
- **Access Level**: Full access to all user features
- **Admin Features**: Limited (need admin role for full admin access)

---

## 🛠️ **Creating Additional Test Accounts**

### **Via API:**
```bash
curl -X POST http://localhost:8001/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","password":"password123","name":"New Test User"}'
```

### **Via Django Admin:**
1. **Access**: http://localhost:8001/admin/
2. **Login**: With admin credentials
3. **Navigate**: Accounts → Users
4. **Create**: New user with desired permissions

---

## 📊 **Account Statistics**

| Account | User ID | Created | Status | Last Login |
|---------|---------|---------|--------|------------|
| Demo User | 4 | 2025-08-18 15:32:23 | ✅ Active | Ready |
| Manager User | 5 | 2025-08-18 15:32:39 | ✅ Active | Ready |
| Regular User | 6 | 2025-08-18 15:32:56 | ✅ Active | Ready |
| Test User | 2 | 2025-08-18 15:26:47 | ✅ Active | Ready |

---

## 🎉 **Ready to Test!**

**All test accounts are ready and fully functional!**

- ✅ **Authentication working**
- ✅ **JWT tokens generated**
- ✅ **Database records created**
- ✅ **API endpoints responding**
- ✅ **React frontend ready**

**Start testing your SurveyGuy application now!** 🚀

---

## 🔗 **Quick Links**

- **React Frontend**: http://localhost:3002
- **Django API**: http://localhost:8001/api/
- **Django Admin**: http://localhost:8001/admin/
- **API Health**: http://localhost:8001/api/health/

**Happy testing!** 🧪✨ 