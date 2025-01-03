'use client';
import { useState } from "react";
import { signIn } from "next-auth/react";
import styles from "./signin.module.css";
import { toast } from 'sonner'
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<string>("")

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading("login")
    const result = await signIn("credentials", {
      redirect: false, // 리디렉션 방지
      email,
      password,
    });
    setLoading("")
  
    if (result?.error) {
      // 로그인 실패 시
      toast.error("비밀번호 또는 이메일이 옳지 않습니다.");
    } else if (result?.ok) {
      // 로그인 성공 시
      router.push("/"); // 원하는 경로로 이동
    }
  };
  
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setVisiblePassword((prev) => !prev);
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
          <h2 className="text-2xl font-bold mb-4">Sign In</h2>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className={`${styles.Input} relative`}>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`mt-1 p-2 block w-full border focus:-translate-x-1 focus:-translate-y-1 z-20 rounded-none border-black duration-200`}
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className={`${styles.Input} relative`}>
              <input
                type={visiblePassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`mt-1 p-2 block w-full border focus:-translate-x-1 focus:-translate-y-1 z-20 rounded-none border-black duration-200`}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30"
                onClick={() => togglePasswordVisibility()}
                type="button"
              >
                {visiblePassword ? (
                  <img src="/icons/visible.svg" alt="Show password" />
                ) : (
                  <img src="/icons/invisible.svg" alt="Hide password" />
                )}
              </button>
            </div>
          </div>
          <div className="relative before:absolute before:content-[''] before:w-full before:h-full before:bg-black mt-[20px]">
            <button
              type="submit"
              className={`flex justify-center items-center w-full bg-blue-500 h-[50px] py-2 px-4 focus:bg-blue-600 relative z-10 -translate-x-1 -translate-y-1 active:translate-x-0 active:translate-y-0 duration-200 ${loading == "login" ? 'pointer-events-none' : ''}`}
            >
              {loading == "login" ? (
                <div className="load">
                  <hr/><hr/><hr/><hr/>
                </div>              
              ) : (
                <p className="text-white text-lg">Sign In</p>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
