"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./register.module.css";
import { toast } from 'sonner';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Register user and send verification email
      const response = await fetch("/api/auth/sendVerificationEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("인증 이메일이 전송되었습니다. 메일함을 확인하세요.");
        router.push("/")
      } else {
        toast.error(result.error || "이메일 전송에 실패했습니다.");
      }
    } catch (error) {
      toast.error("서버 오류: 이메일 전송 실패.");
    }
  };

  return (
    <main
      className="flex items-center justify-center"
      style={{ height: "calc(100vh - 60px)" }}
    >
      <div className="relative w-full max-w-sm flex items-center justify-center h-full">
        <form
          onSubmit={handleSubmit}
          className={`bg-white p-6 w-full max-w-sm border border-black absolute ${styles.logInForm}`}
        >
          <p className="text-2xl font-bold mb-4">Verify Email</p>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className={`${styles.Input} relative`}>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`mt-1 p-2 block w-full border focus:-translate-x-1 focus:-translate-y-1 z-20 rounded-none border-black duration-200`}
              />
              <div className="absolute top-0 left-0 w-full h-full bg-black z-0" />
            </div>
            <p className="text-xs text-subtext mt-1 mb-0 w-full text-end">학교 구글 이메일로 가입해주세요.</p>
          </div>
          <div className="relative before:absolute before:content-[''] before:w-full before:h-full before:bg-black mt-[20px]">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 focus:bg-blue-600 relative z-10 -translate-x-1 -translate-y-1 active:translate-x-0 active:translate-y-0 duration-200"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
