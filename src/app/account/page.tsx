'use client'
import { useSession } from "next-auth/react"
import { useRef, useState, ChangeEvent } from "react";
import { toast } from "sonner"
import axios from "axios";

export default function Page () {
    const { data : session, status } = useSession()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [inputName, setInputName] = useState("")
    
    
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        await uploadToServer(file);
    };

    const uploadToServer = async (file: File) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/api/media/upload/image', {
                formData,
            });

            toast.success('업로드에 성공했습니다.');

            await axios.post('/api/user/changeAvatar', {
                avatar : response.data.file.url,
                email : session?.user.email
            })
        } catch {
            toast.error('업로드 중 에러가 발생했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputName = () => {
        try {
            if (!inputName) {
                toast.warning("이름을 입력해주세요.")
                return
            }
            axios.post('/api/user/changeName', {
                email : session?.user.email,
                changedName : inputName
            })

            toast.success("이름 변경에 성공했습니다.")
        } catch (error) {
            toast.error("이름 변경에 실패했습니다.")
        }
    }

    return (
        <main className="flex flex-col w-full items-center">
            <div className="w-[800px]">
            <div className="p-[20px] border rounded-lg border-black flex items-center w-auto mb-[50px] justify-between">
                <div className="mr-[100px]">
                    <p className="text-xl mb-[20px]">Avatar</p>
                    <p>아바타를 변경할 수 있습니다. JPG, PNG, JPEG 파일만 수용 가능합니다.</p>
                </div>
                {session ? (
                    <button onClick={handleButtonClick}>
                        <img src={session?.user.image} alt="avtar" className="aspect-square object-cover rounded-full hover:brightness-50 duration-200" />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </button>
                ) : (
                    <span className="aspect-square h-[60px] bg-slate-300 rounded-full"></span>
                )}
            </div>
            <div className="p-[20px] border rounded-lg border-black flex flex-col w-auto">
                <div className="mr-[100px] mb-[20px]">
                    <p className="text-xl mb-[20px]">Name</p>
                    <p>이름을 수정할 수 있습니다. 되도록 학번 이름으로 설정해주세요</p>
                </div>
                <div className="relative">
                <input
                    placeholder="Name"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="text-md border rounded-sm outline-none h-[40px] px-[10px] w-full border-black"
                />
                <button
                    className="absolute h-[40px] rounded-r-sm top-0 right-0 px-[10px] border flex items-center border-black bg-black"
                    onClick={handleInputName}
                >
                    <p className="text-white">업로드</p>
                </button>
                </div>
            </div>
            </div>
        </main>
    )
}