import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const GUARD_KEY = 'guard';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add interceptor to handle token for requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - simplified to just pass through errors for now
// The AuthContext will handle the logic based on checkAuth's failure
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging, but don't automatically clear localStorage here
    // Let the calling function (e.g., in AuthContext) decide how to handle it.
    if (error.response?.status === 401) {
      console.warn('Axios interceptor: Received 401 Unauthorized. The token might be invalid or expired.');
      // It's crucial NOT to clear localStorage here if you want to avoid clearing on refresh
      // when checkAuth is the first call.
    }
    return Promise.reject(error); // Propagate the error
  }
);


export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/login', { // Endpoint نسبي
        email: credentials.email,
        password: credentials.password,
        guard: credentials.guard
      });
      
      // افترض أن الـ API يعيد guard في response.data.data.guard
      if (response.data.status && response.data.data.token && response.data.data.user) {
        localStorage.setItem(TOKEN_KEY, response.data.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));
        // خزن الـ guard الذي أرسلته أو الذي تم إرجاعه من الـ API
        const returnedGuard = response.data.data.guard || credentials.guard;
        localStorage.setItem(GUARD_KEY, returnedGuard);
        
        return {
          success: true, // استخدم boolean مباشرة
          message: response.data.message,
          user: response.data.data.user,
          token: response.data.data.token,
          guard: returnedGuard // أرجع الـ guard المستخدم
        };
      } else {
        // إذا لم تكن البيانات كاملة أو status false من الـ API
        return {
          success: false,
          message: response.data.message || 'Login failed: Incomplete data from server.',
        };
      }
    } catch (error) {
      console.error('Login service error:', error);
      return { // أرجع كائن خطأ متناسق
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed due to a network or server error.'
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/register', { // Endpoint نسبي
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        password_confirmation: userData.confirmPassword, // تأكد من اسم الحقل الصحيح
        gender: userData.gender,
        region_id: userData.region_id,
        age: userData.age,
        date_of_birth: userData.date_of_birth
      });
      
      // إذا كان التسجيل يسجل دخول المستخدم تلقائيًا ويعيد توكن و guard
      if (response.data.status && response.data.data?.token && response.data.data?.user) {
        localStorage.setItem(TOKEN_KEY, response.data.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));
        if (response.data.data.guard) { // إذا الـ API رجع guard
          localStorage.setItem(GUARD_KEY, response.data.data.guard);
        }
      }
      
      return {
        success: response.data.status,
        message: response.data.message,
        user: response.data.data?.user, // قد لا يكون هناك user في data إذا فشل
        token: response.data.data?.token,
        guard: response.data.data?.guard
      };
    } catch (error) {
      console.error('Register service error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed.'
      };
    }
  },

  logout: async () => {
    // لا حاجة لإرسال التوكن في الـ body للـ headers إذا كان الـ interceptor يعمل
    try {
      // استخدام endpoint نسبي إذا كان baseURL صحيحًا
      const response = await api.post('/user-logout'); // افترض أن هذا هو الـ endpoint الصحيح
      
      // بغض النظر عن استجابة الخادم، قم بتنظيف localStorage
      authService.clearAuthData();
      
      return {
        success: response.data.status, // أو true إذا لم يرجع الـ API status
        message: response.data.message
      };
    } catch (error) {
      console.error('Logout service error:', error);
      // حتى لو فشل طلب الخروج من الخادم، نظف localStorage
      authService.clearAuthData();
      return {
        success: false, // تشير إلى أن طلب الخادم فشل
        message: error.response?.data?.message || error.message || 'Logout from server failed, but local session cleared.'
      };
    }
  },

  checkAuth: async () => {
    // هذه الدالة هي التي يجب أن تحدد صلاحية الجلسة
    // الـ interceptor سيضيف التوكن تلقائيًا
    try {
      const response = await api.get('/auth/user'); // Endpoint للتحقق من المستخدم الحالي
      
      // إذا نجح الطلب، افترض أن الـ API يعيد بيانات المستخدم والـ guard إذا كان صالحًا
      if (response.data.status && response.data.data) {
        // يمكن تحديث user و guard في localStorage هنا إذا كانت الـ API تعيد أحدث نسخة
        // localStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));
        // if (response.data.data.guard) {
        //   localStorage.setItem(GUARD_KEY, response.data.data.guard);
        // }
        return {
          success: true,
          user: response.data.data.user, // أو response.data.data إذا كان الكائن هو المستخدم مباشرة
          guard: response.data.data.guard // افترض أن الـ API يعيد الـ guard هنا
        };
      } else {
        return { success: false, message: response.data.message || 'Auth check returned no user.' };
      }
    } catch (error) {
      console.error('CheckAuth service error:', error);
      // إذا كان الخطأ 401، فهذا يعني أن التوكن غير صالح
      // لا تمسح localStorage هنا، اترك AuthContext يقرر
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Authentication check failed.',
        status: error.response?.status // أرجع الـ status code للمساعدة في اتخاذ القرار
      };
    }
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
      return null;
    }
  },
  getGuard: () => localStorage.getItem(GUARD_KEY),

  clearAuthData: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(GUARD_KEY);
    console.log('AuthService: Cleared all auth data from localStorage.');
  }
};