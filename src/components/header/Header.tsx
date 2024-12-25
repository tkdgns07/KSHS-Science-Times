import Image from "next/image"
import Logo from "@/img/Science TIMEs_Logo.png"
import styles from "./Header.module.css"

const Header = () =>{
    return (
        <main className={`w-screen h-[60px] p-[20px] {styles.headerMain}`}>
            <Image 
                src={Logo}
                alt="Sites Logo"
                height={20}
            />
        </main>
    )
}

export default Header