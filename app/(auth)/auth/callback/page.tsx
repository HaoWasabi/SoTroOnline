// pages/auth/callback.tsx
"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTaiKhoanStore } from "@/zustand/taikhoan-store";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = decodeURIComponent(searchParams.get("token") as string);
  const {setTaiKhoan} = useTaiKhoanStore();

  useEffect(() => {
    
    const fetchUserData = async () => {
      const response = await fetch("http://localhost:8080/api/auth/user-info", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if(response.ok) {
        const data = await response.json();
        setTaiKhoan(data.data);
      }
    }
    fetchUserData();
    router.push("/");
  }, [token]);

  return <p>Logging you in...</p>;
}
