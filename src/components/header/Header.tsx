'use client'
import Image from "next/image"
import styles from "./Header.module.css"
import Link from "next/link"
import SignInButton from "./ui/SignInButton"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const Header = () =>{
    const { data : session } = useSession()
    const router = useRouter()
    const makePost = () => {
        router.push("/post/add")
        return
    }
    return (
        <main className={`w-screen h-[60px] p-[20px] ${styles.headerMain} flex justify-between items-center z-30`}>
            <Link href={{ pathname : '/' }}>
                <Image 
                    src='/img/Science TIMEs_Logo.png'
                    alt="Sites Logo"
                    width={120}
                    height={20}
                />
            </Link>
            <div className="flex">
                {session && (
                <button className="bg-black text-white rounded-md px-[10px] py-[5px] text-sm mr-[10px]" onClick={makePost}>포스트 작성</button>
                )}
                <SignInButton></SignInButton>
            </div>
        </main>
    )
}

export default Header