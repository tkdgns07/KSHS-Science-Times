'use client'
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function Page () {
    const param = useSearchParams().get('code')?.toString()
    const [verified, setVerified] = useState<boolean>(false)
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        email: ""
    });
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
        

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!param) {
          toast.warning("인증 코드가 없습니다.");
          return;
        }
      
        try {
          const responseVerify = await fetch("/api/auth/verifyEmail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: param }), // code를 전송
          });
      
          const result = await responseVerify.json();
          if (responseVerify.ok) {
            toast.success("인증되었습니다. 회원정보를 작정해주세요.");
            setVerified(true)

            setFormData((prev) => ({
                ...prev,
                email: result.email,
            }));
          } else {
            toast.error(result.error || "인증에 실패했습니다. 다시 시도해주세요.");
          }
        } catch (error) {
          toast.error("서버 오류: 인증 에러");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }),
          });
      
          const result = await response.json();
          if (response.ok) {
            toast.success("가입되었습니다. 다시 로그인 해주세요.");
            router.push("/signin");
          } else {
            toast.error(result.error || "가입에 실패했습니다. 다시 시도해주세요.");
          }
        } catch (error) {
          toast.error("서버 오류: 가입 에러");
        }
    };
      
    const [visiblePassword, setVisiblePassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setVisiblePassword((prev) => !prev);
    };
      
    return (
        <Suspense>
        <main
            className="flex items-center justify-center"
            style={{ height: "calc(100vh - 60px)" }}
        >
                {verified ? (
                    <div className="relative w-full max-w-sm flex items-center justify-center h-full">
                        <form
                        onSubmit={handleRegister}
                        className="bg-white p-6 w-full max-w-sm border border-black absolute styles.logInForm"
                        >
                        <p className="text-2xl font-bold mb-4">Register</p>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                            </label>
                            <div className="Input relative">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className={`mt-1 p-2 block w-full border focus:-translate-x-1 focus:-translate-y-1 z-20 rounded-none border-black duration-200`}
                            />
                            <div className="absolute top-0 left-0 w-full h-full bg-black z-0" />
                            </div>
                            <p className="text-xs text-subtext mt-1 mb-0 w-full text-end">되도록 학번 이름으로 가입해주세요.</p>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                            </label>
                            <div className="Input relative">
                            <input
                                type={visiblePassword ? "password" : "text"}
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className={`mt-1 p-2 block w-full border focus:-translate-x-1 focus:-translate-y-1 z-20 rounded-none border-black duration-200`}
                            />
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 transition-transform duration-200"
                                type="button"
                                onClick={togglePasswordVisibility}
                            >
                                <div className="absolute top-0 left-0 w-full h-full bg-black z-0" />
                            </button>
                            </div>
                        </div>
                        <div className="relative before:absolute before:content-[''] before:w-full before:h-full before:bg-black mt-[20px]">
                            <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 focus:bg-blue-600 relative z-10 -translate-x-1 -translate-y-1 active:translate-x-0 active:translate-y-0 duration-200"
                            >
                            Register
                            </button>
                        </div>
                        </form>
                    </div>
                ) : (
                    <div className="relative w-full max-w-sm flex items-center justify-center h-full">
                        <form
                            onSubmit={handleVerify}
                            className="bg-white p-6 w-full max-w-sm border border-black absolute logInForm"
                        >
                            <h2 className="text-2xl font-bold mb-4">Verify Email</h2>
                            
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
                )}
        </main>
        </Suspense>
    )
}