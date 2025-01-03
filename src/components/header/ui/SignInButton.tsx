'use client'
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from "./uiStyles.module.css"
import axios from 'axios';

const SignInButton: React.FC = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

    const handleSignOut = async () => {    
        try {
            await axios.delete("/api/auth/sessionApi", {
                headers: {
                  Authorization: `Bearer ${session?.user.token}`,
                },
            });
            signOut({ callbackUrl: "/" });
        } catch (error) {
          console.error("Sign out failed:", error);
        }
    };    

    return (
        <div>
            {session ? (
                <div className={styles.profile}>
                    <img src={session.user.image} alt="프로필 이미지" className='w-[30px]'/>
                    <div className='bg-background border border-black p-[5px] w-[200px]'>
                        <p className='font-bold text-sm px-[5px] pt-[5px]'>{session.user.name}</p>
                        <p className='text-subtext text-xs px-[5px]'>{session.user.email}</p>
                        <Link href={{ pathname : "/dashboard" }}>
                            <p className='font-bold text-sm hover:bg-gray-100 my-[5px] flex items-center p-[5px] rounded-md'>대시보드</p>
                        </Link>
                        <Link href={{ pathname : "/account" }}>
                            <p className='font-bold text-sm hover:bg-gray-100 my-[5px] flex items-center p-[5px] rounded-md'>계정 설정</p>
                        </Link>
                        <button
                            className='bg-black rounded-md w-full p-[5px] mt-[5px]'
                            onClick={handleSignOut}
                        >
                            <p className='font-bold text-sm flex items-center justify-center text-background'>로그아웃</p>
                        </button>
                    </div>
                </div>
            ) : (
                <Link href={{ pathname : pathname == '/signin' ? '/register' : '/signin' }}>
                    <div className='bg-none border border-black rounded-full flex justify-center items-center px-[10px] py-[5px] hover:bg-gray-100 duration-200'>
                        <p className='font-bold text-sm'>{pathname == '/signin' ? 'Register' : 'Sign In'}</p>
                    </div>
                </Link>
            )}
        </div>
    )
}

export default SignInButton