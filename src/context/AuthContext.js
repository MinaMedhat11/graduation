// AuthContext.js (الأجزاء ذات الصلة)
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getUser()); // تهيئة من localStorage مباشرة
  const [guard, setGuard] = useState(() => authService.getGuard()); // تهيئة من localStorage مباشرة
  const [token, setToken] = useState(() => authService.getToken()); // تهيئة التوكن
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // ... (باقي الحالات)

  useEffect(() => {
    const verifyUserSession = async () => {
      setLoading(true);
      const currentToken = authService.getToken(); // احصل على التوكن الحالي

      if (!currentToken) {
        // لا يوجد توكن، فالمستخدم غير مسجل دخوله
        setUser(null);
        setGuard(null);
        setToken(null); // تأكد من تحديث حالة التوكن أيضًا
        // لا تمسح localStorage هنا، فقد يكون المستخدم فتح تاب جديدة
        setLoading(false);
        return;
      }

      try {
        // checkAuth الآن سترجع status code إذا فشلت
        const res = await authService.checkAuth();

        if (res.success && res.user) {
          setUser(res.user);
          // إذا checkAuth رجعت guard، استخدمه، وإلا احتفظ بالـ guard الحالي من state (اللي تم تهيئته من localStorage)
          setGuard(res.guard || authService.getGuard()); 
          // تأكد أن user و guard في localStorage محدثان إذا checkAuth يعيدهم (authService يجب أن يفعل هذا)
          // ويمكن لـ checkAuth أن يعيد التوكن إذا كان هناك آلية لتجديده
          // setToken(authService.getToken()); // أعد قراءة التوكن إذا تم تجديده
        } else {
          // فشل checkAuth (مثلاً 401 Unauthorized أو خطأ آخر)
          console.warn('AuthContext: checkAuth failed.', res.message);
          // إذا كان الفشل بسبب عدم صلاحية التوكن (مثلاً status 401 من checkAuth)
          if (res.status === 401) {
            console.log('AuthContext: Token invalid (401), clearing session.');
            authService.clearAuthData(); // الآن نمسح كل شيء لأن التوكن غير صالح
            setUser(null);
            setGuard(null);
            setToken(null);
          } else {
            // لأخطاء أخرى، قد لا ترغب في مسح الجلسة فورًا
            // لكن من الأمان عادةً تسجيل الخروج إذا فشل checkAuth
            // setUser(null); // تم تعيينه بالفعل إذا لم تكن res.success
            // setGuard(null);
            // setToken(null);
          }
        }
      } catch (e) { // هذا الـ catch لأخطاء الشبكة أو أخطاء JavaScript في authService.checkAuth
        console.error('AuthContext: Critical error during checkAuth:', e);
        // في حالة خطأ فادح، من الأفضل تسجيل الخروج
        authService.clearAuthData();
        setUser(null);
        setGuard(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUserSession();
  }, []); // يعتمد على [] ليشتغل مرة واحدة

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        setUser(response.user);
        setGuard(response.guard); // authService.login يجب أن يضمن تخزين هذا
        setToken(response.token); // authService.login يجب أن يضمن تخزين هذا
        // setMessage(response.message);
        setLoading(false);
        return { success: true, guard: response.guard };
      } else {
        // setMessage(response.message);
        setError(response.message || 'Login failed');
        setLoading(false);
        return { success: false, message: response.message };
      }
    } catch (err) { // أخطاء من authService.login نفسه (مثل throw)
      setError(err.message || 'An unexpected error occurred during login.');
      setLoading(false);
      throw err; // أعد رمي الخطأ إذا كنت تريد معالجته في مكان الاستدعاء
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout(); // authService.logout سيمسح localStorage
    } catch (err) {
      console.error('AuthContext: Logout API call failed:', err);
      setError(err.message || "Logout from server failed.");
      // حتى لو فشل طلب الخادم، authService.logout يجب أن يكون قد نظف localStorage
    } finally {
      setUser(null);
      setGuard(null);
      setToken(null);
      // setMessage(null);
      setLoading(false);
    }
  };
  
  // ... (دالة register إذا كنت تحتاجها بنفس الطريقة)

  return (
    <AuthContext.Provider
      value={{
        user,
        guard,
        token, // أضف التوكن إذا كنت تحتاجه في مكان آخر
        loading,
        error,
        // message,
        isAuthenticated: !!user && !!token, // تحقق من user و token
        login,
        // register,
        logout,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};