import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      console.log("Registering with data:", signUpFormData);
      const data = await registerService(signUpFormData);
      console.log("Registration response:", data);
      
      if (data?.success) {
        // Reset form after successful registration
        setSignUpFormData(initialSignUpFormData);
        // Optionally set auth state or redirect
        alert("Registration successful! Please sign in.");
      } else {
        console.error("Registration failed:", data?.message);
        alert("Registration failed: " + (data?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration error: " + (error?.response?.data?.message || error.message || "Unknown error"));
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      console.log("Logging in with data:", signInFormData);
      const data = await loginService(signInFormData);
      console.log("Login response:", data);

      if (data?.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        console.error("Login failed:", data?.message);
        alert("Login failed: " + (data?.message || "Invalid credentials"));
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuth({
        authenticate: false,
        user: null,
      });
      alert("Login error: " + (error?.response?.data?.message || error.message || "Unknown error"));
    }
  }

  //check auth user

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  console.log(auth, "gf");

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
