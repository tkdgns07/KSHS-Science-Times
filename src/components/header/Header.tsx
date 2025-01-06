'use client'
import Image from "next/image"
import styles from "./Header.module.css"
import Link from "next/link"
import SignInButton from "./ui/SignInButton"

const Header = () =>{
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
            <SignInButton></SignInButton>
        </main>
    )
}

export default Header