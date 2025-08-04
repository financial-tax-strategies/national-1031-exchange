import { jsxDEV } from 'react/jsx-dev-runtime';
import { useState } from 'react';
import { D as DatabaseService } from './database.service_C6kdc69n.mjs';

class AuthService {
  static instance;
  dbService;
  constructor() {
    this.dbService = DatabaseService.getInstance();
  }
  /**
   * Get singleton instance of AuthService
   */
  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  /**
   * Login with email and password
   */
  async login(credentials) {
    try {
      const { email, password } = credentials;
      const { data: authData, error: authError } = await this.dbService.getClient().auth.signInWithPassword({
        email,
        password
      });
      if (authError) {
        return {
          success: false,
          error: this.mapAuthError(authError)
        };
      }
      if (!authData.user) {
        return {
          success: false,
          error: {
            code: "NO_USER",
            message: "Authentication failed"
          }
        };
      }
      const adminProfile = await this.getAdminProfile(authData.user.id);
      if (!adminProfile) {
        await this.logout();
        return {
          success: false,
          error: {
            code: "NOT_ADMIN",
            message: "Access denied. Admin privileges required."
          }
        };
      }
      if (!adminProfile.is_active) {
        await this.logout();
        return {
          success: false,
          error: {
            code: "ACCOUNT_DISABLED",
            message: "Your account has been disabled. Please contact support."
          }
        };
      }
      await this.updateLastLogin(adminProfile.id);
      const context = {
        user: authData.user,
        session: authData.session,
        adminProfile,
        isAuthenticated: true,
        isAdmin: true
      };
      return {
        success: true,
        data: context
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: {
          code: "LOGIN_ERROR",
          message: "An error occurred during login",
          details: error
        }
      };
    }
  }
  /**
   * Logout current user
   */
  async logout() {
    try {
      const { error } = await this.dbService.getClient().auth.signOut();
      if (error) {
        return {
          success: false,
          error: this.mapAuthError(error)
        };
      }
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        error: {
          code: "LOGOUT_ERROR",
          message: "An error occurred during logout",
          details: error
        }
      };
    }
  }
  /**
   * Get current user session
   */
  async getSession() {
    try {
      const { data: { session }, error } = await this.dbService.getClient().auth.getSession();
      if (error) {
        return {
          success: false,
          error: this.mapAuthError(error)
        };
      }
      return {
        success: true,
        data: session
      };
    } catch (error) {
      console.error("Get session error:", error);
      return {
        success: false,
        error: {
          code: "SESSION_ERROR",
          message: "Failed to retrieve session",
          details: error
        }
      };
    }
  }
  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.dbService.getClient().auth.getUser();
      if (error || !user) {
        return {
          success: true,
          data: null
        };
      }
      const sessionResponse = await this.getSession();
      if (!sessionResponse.success || !sessionResponse.data) {
        return {
          success: true,
          data: null
        };
      }
      const adminProfile = await this.getAdminProfile(user.id);
      if (!adminProfile || !adminProfile.is_active) {
        return {
          success: true,
          data: null
        };
      }
      const context = {
        user,
        session: sessionResponse.data,
        adminProfile,
        isAuthenticated: true,
        isAdmin: true
      };
      return {
        success: true,
        data: context
      };
    } catch (error) {
      console.error("Get current user error:", error);
      return {
        success: false,
        error: {
          code: "USER_ERROR",
          message: "Failed to get current user",
          details: error
        }
      };
    }
  }
  /**
   * Register new admin user (super admin only)
   */
  async register(data) {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser.success || !currentUser.data || currentUser.data.adminProfile?.role !== "super_admin") {
        return {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Only super admins can create new admin users"
          }
        };
      }
      const { data: authData, error: authError } = await this.dbService.getClient().auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName
          }
        }
      });
      if (authError) {
        return {
          success: false,
          error: this.mapAuthError(authError)
        };
      }
      if (!authData.user) {
        return {
          success: false,
          error: {
            code: "REGISTRATION_FAILED",
            message: "Failed to create user account"
          }
        };
      }
      const adminProfile = await this.createAdminProfile({
        id: authData.user.id,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role || "admin",
        permissions: this.getDefaultPermissions(data.role || "admin")
      });
      const context = {
        user: authData.user,
        session: authData.session,
        adminProfile,
        isAuthenticated: true,
        isAdmin: true
      };
      return {
        success: true,
        data: context
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: {
          code: "REGISTRATION_ERROR",
          message: "Failed to register admin user",
          details: error
        }
      };
    }
  }
  /**
   * Request password reset
   */
  async requestPasswordReset(request) {
    try {
      const { error } = await this.dbService.getClient().auth.resetPasswordForEmail(request.email, {
        redirectTo: request.redirectTo || `${window.location.origin}/reset-password`
      });
      if (error) {
        return {
          success: false,
          error: this.mapAuthError(error)
        };
      }
      return { success: true };
    } catch (error) {
      console.error("Password reset request error:", error);
      return {
        success: false,
        error: {
          code: "RESET_ERROR",
          message: "Failed to send password reset email",
          details: error
        }
      };
    }
  }
  /**
   * Update password
   */
  async updatePassword(request) {
    try {
      const { error } = await this.dbService.getClient().auth.updateUser({
        password: request.newPassword
      });
      if (error) {
        return {
          success: false,
          error: this.mapAuthError(error)
        };
      }
      return { success: true };
    } catch (error) {
      console.error("Password update error:", error);
      return {
        success: false,
        error: {
          code: "UPDATE_ERROR",
          message: "Failed to update password",
          details: error
        }
      };
    }
  }
  /**
   * Refresh session
   */
  async refreshSession() {
    try {
      const { data: { session }, error } = await this.dbService.getClient().auth.refreshSession();
      if (error) {
        return {
          success: false,
          error: this.mapAuthError(error)
        };
      }
      return {
        success: true,
        data: session
      };
    } catch (error) {
      console.error("Session refresh error:", error);
      return {
        success: false,
        error: {
          code: "REFRESH_ERROR",
          message: "Failed to refresh session",
          details: error
        }
      };
    }
  }
  /**
   * Check if user has specific permission
   */
  hasPermission(adminProfile, resource, action) {
    if (!adminProfile) return false;
    if (adminProfile.role === "super_admin") return true;
    const permissions = adminProfile.permissions;
    return permissions?.[resource]?.[action] === true;
  }
  /**
   * Get admin profile from database
   */
  async getAdminProfile(userId) {
    try {
      const { data, error } = await this.dbService.getClient().from("admin_users").select("*").eq("id", userId).single();
      if (error || !data) {
        console.error("Failed to get admin profile:", error);
        return null;
      }
      return data;
    } catch (error) {
      console.error("Get admin profile error:", error);
      return null;
    }
  }
  /**
   * Create admin profile in database
   */
  async createAdminProfile(data) {
    const { data: profile, error } = await this.dbService.getClient().from("admin_users").insert({
      ...data,
      is_active: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }).select().single();
    if (error || !profile) {
      throw new Error("Failed to create admin profile");
    }
    return profile;
  }
  /**
   * Update last login timestamp
   */
  async updateLastLogin(adminId) {
    await this.dbService.getClient().from("admin_users").update({ last_login_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", adminId);
  }
  /**
   * Get default permissions based on role
   */
  getDefaultPermissions(role) {
    const fullAccess = {
      read: true,
      write: true,
      delete: true
    };
    const readOnly = {
      read: true,
      write: false,
      delete: false
    };
    switch (role) {
      case "super_admin":
        return {
          leads: fullAccess,
          appointments: fullAccess,
          orders: fullAccess,
          customers: fullAccess,
          settings: { read: true, write: true },
          reports: { view: true, export: true }
        };
      case "admin":
        return {
          leads: fullAccess,
          appointments: fullAccess,
          orders: fullAccess,
          customers: { read: true, write: true, delete: false },
          settings: { read: true, write: false },
          reports: { view: true, export: true }
        };
      case "manager":
        return {
          leads: { read: true, write: true, delete: false },
          appointments: { read: true, write: true, delete: false },
          orders: { read: true, write: true, delete: false },
          customers: readOnly,
          settings: { read: false, write: false },
          reports: { view: true, export: false }
        };
      default:
        return {
          leads: readOnly,
          appointments: readOnly,
          orders: readOnly,
          customers: readOnly,
          settings: { read: false, write: false },
          reports: { view: false, export: false }
        };
    }
  }
  /**
   * Map Supabase auth errors to our error structure
   */
  mapAuthError(error) {
    const errorMap = {
      "Invalid login credentials": "Invalid email or password",
      "Email not confirmed": "Please verify your email address",
      "User not found": "No account found with this email",
      "Invalid password": "Password does not meet requirements"
    };
    return {
      code: error.code || "AUTH_ERROR",
      message: errorMap[error.message] || error.message || "Authentication error",
      details: error
    };
  }
}

const LoginForm = ({
  redirectUrl = "/admin",
  isAdminLogin = false,
  onSuccess
}) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const authService = AuthService.getInstance();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          const urlParams = new URLSearchParams(window.location.search);
          const redirect = urlParams.get("redirect") || redirectUrl;
          window.location.href = redirect;
        }
      } else {
        setError(response.error || { code: "LOGIN_FAILED", message: "Login failed" });
      }
    } catch (err) {
      setError({
        code: "UNEXPECTED_ERROR",
        message: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleForgotPassword = async () => {
    if (!credentials.email) {
      setError({
        code: "EMAIL_REQUIRED",
        message: "Please enter your email address first"
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await authService.requestPasswordReset({
        email: credentials.email
      });
      if (response.success) {
        setError({
          code: "SUCCESS",
          message: "Password reset instructions have been sent to your email"
        });
      } else {
        setError(response.error || {
          code: "RESET_FAILED",
          message: "Failed to send reset email"
        });
      }
    } catch (err) {
      setError({
        code: "UNEXPECTED_ERROR",
        message: "Failed to send reset email. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "w-full max-w-md mx-auto", children: /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, className: "bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 text-center", children: isAdminLogin ? "Admin Login" : "Customer Portal Login" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
        lineNumber: 103,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 text-center mt-2", children: isAdminLogin ? "Access your admin dashboard" : "Access your 1031 exchange portal" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
        lineNumber: 106,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
      lineNumber: 102,
      columnNumber: 9
    }, undefined),
    error && /* @__PURE__ */ jsxDEV("div", { className: `mb-4 p-3 rounded ${error.code === "SUCCESS" ? "bg-green-100 text-green-700 border border-green-400" : "bg-red-100 text-red-700 border border-red-400"}`, children: /* @__PURE__ */ jsxDEV("p", { className: "text-sm", children: error.message }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
      lineNumber: 119,
      columnNumber: 13
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
      lineNumber: 114,
      columnNumber: 11
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxDEV("label", { htmlFor: "email", className: "block text-gray-700 text-sm font-bold mb-2", children: "Email Address" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
        lineNumber: 124,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          type: "email",
          id: "email",
          value: credentials.email,
          onChange: (e) => setCredentials({ ...credentials, email: e.target.value }),
          className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
          placeholder: "you@example.com",
          required: true,
          autoComplete: "email",
          disabled: isLoading
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
          lineNumber: 127,
          columnNumber: 11
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
      lineNumber: 123,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxDEV("label", { htmlFor: "password", className: "block text-gray-700 text-sm font-bold mb-2", children: "Password" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
        lineNumber: 141,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: showPassword ? "text" : "password",
            id: "password",
            value: credentials.password,
            onChange: (e) => setCredentials({ ...credentials, password: e.target.value }),
            className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10",
            placeholder: "••••••••",
            required: true,
            autoComplete: "current-password",
            disabled: isLoading
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
            lineNumber: 145,
            columnNumber: 13
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: () => setShowPassword(!showPassword),
            className: "absolute inset-y-0 right-0 pr-3 flex items-center",
            tabIndex: -1,
            children: showPassword ? /* @__PURE__ */ jsxDEV("svg", { className: "h-5 w-5 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
              lineNumber: 164,
              columnNumber: 19
            }, undefined) }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
              lineNumber: 163,
              columnNumber: 17
            }, undefined) : /* @__PURE__ */ jsxDEV("svg", { className: "h-5 w-5 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [
              /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
                lineNumber: 168,
                columnNumber: 19
              }, undefined),
              /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
                lineNumber: 169,
                columnNumber: 19
              }, undefined)
            ] }, void 0, true, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
              lineNumber: 167,
              columnNumber: 17
            }, undefined)
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
            lineNumber: 156,
            columnNumber: 13
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
        lineNumber: 144,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
      lineNumber: 140,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxDEV("label", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "checkbox",
            checked: rememberMe,
            onChange: (e) => setRememberMe(e.target.checked),
            className: "mr-2 leading-tight",
            disabled: isLoading
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
            lineNumber: 178,
            columnNumber: 13
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV("span", { className: "text-sm text-gray-600", children: "Remember me" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
          lineNumber: 185,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
        lineNumber: 177,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: handleForgotPassword,
          className: "text-sm text-blue-600 hover:text-blue-800 font-medium",
          disabled: isLoading,
          children: "Forgot password?"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
          lineNumber: 187,
          columnNumber: 11
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
      lineNumber: 176,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "submit",
        disabled: isLoading,
        className: `w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`,
        children: isLoading ? "Signing in..." : "Sign In"
      },
      void 0,
      false,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
        lineNumber: 198,
        columnNumber: 11
      },
      undefined
    ) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
      lineNumber: 197,
      columnNumber: 9
    }, undefined),
    !isAdminLogin && /* @__PURE__ */ jsxDEV("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600", children: [
      "Don't have an account?",
      " ",
      /* @__PURE__ */ jsxDEV("a", { href: "/contact", className: "text-blue-600 hover:text-blue-800 font-medium", children: "Contact us" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
        lineNumber: 215,
        columnNumber: 15
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
      lineNumber: 213,
      columnNumber: 13
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
      lineNumber: 212,
      columnNumber: 11
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
    lineNumber: 101,
    columnNumber: 7
  }, undefined) }, void 0, false, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm.tsx",
    lineNumber: 100,
    columnNumber: 5
  }, undefined);
};

export { AuthService as A, LoginForm as L };
