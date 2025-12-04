// pages/auth/callback.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTaiKhoanStore } from "@/zustand/taikhoan-store";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTaiKhoan } = useTaiKhoanStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processGoogleAuth = async () => {
      try {
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");

        if (!accessToken) {
          throw new Error("No access token received from Google OAuth");
        }

        // Store both tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }

        // Fetch complete user data from backend using the access token
        const response = await fetch("http://localhost:8080/api/auth/user-info", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Store user data in localStorage and Zustand
          localStorage.setItem('user', JSON.stringify(data.data));
          setTaiKhoan(data.data);
          
          router.push("/");
        } else {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication failed");
        // Redirect to login page after error
        setTimeout(() => router.push("/login-page"), 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    processGoogleAuth();
  }, [searchParams, setTaiKhoan, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Authentication Error: {error}</p>
          <p className="text-gray-600">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>{isProcessing ? "Processing Google login..." : "Login complete!"}</p>
      </div>
    </div>
  );
}
