import styles from "../styles.module.css"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type PostProps = {
    id: number;
    width: number
    title: string;
    thumbnail: string;
    details: string;
    field: number;
    name: string;
    image: string;
    fieldColor: (field : number, returnColor: boolean) => string;
};

const Post: React.FC<PostProps> = ({ id, width, title, thumbnail, details, field, name ,image, fieldColor }) => {
        const router = useRouter()
        const { data : session } = useSession()

        const goToPost = () => {
            if (session && session.user.name == name) {
                router.push(`/post/edit?id=${id}`)
                return
            }
            router.push(`/post/read?id=${id}`)
        }

        return (
            <div
                className={`relative h-auto inline-block`}
                style={{width : `${width}px`, height : "400px"}}
            >
                <div className={`absolute -top-1 -left-1 border-2 border-black ${styles.cardPa}`}>
                    <div className="bg-background">
                        <div
                            className="relative w-full overflow-hidden flex items-center justify-center"
                            style={{'height' : `${2 * width / 3}px`}}
                        >
                            <img src={thumbnail} alt="Example Image" className="absolute h-full w-full object-cover"/>
                        </div>
                        <div
                            className="bg-black h-[1px] my-[10px] mx-[10px]"
                            style={{width : `${width - 20}px`}}
                        ></div>
                        <div className='px-[10px]'>
                            <div
                                className=" px-[10px] py-[1px] inline-block mb-[10px]"
                                style={{ backgroundColor: fieldColor(field, true) }}
                            >
                                <p className="text-xs text-white">{fieldColor(field, false)}</p>
                            </div>
                            <p className="font-bold text-lg text-maintext">{title}</p>
                            <p className="text-xs text-subtext">{details}</p>
                            <div className="flex items-center mt-[5px] cursor-pointer">
                                <img src={image} alt="아바타" className="w-[15px] h-[15px] object-cover rounded-full overflow-hidden"/>
                                <p className="font-bold text-sm impactFont ml-[5px] mt-[2px]">{name}</p>
                            </div>
                            <div className="w-full flex flex-col items-end">
                                <div className="relative w-[60px] h-[30px]">
                                    <div className={`absolute w-full h-full`}>
                                        <button onClick={goToPost} className="w-full h-full">
                                            <div className={`w-[60px] h-[30px] bg-black absolute ${styles.cardButtonPa} flex justify-center items-center z-20 -translate-y-1/2`}>
                                                <p className="z-30 text-background !text-sx font-bold impactFont">보기</p>
                                            </div>
                                        </button>
                                    </div>
                                    <span className="w-[60px] h-[30px] bg-black absolute top=0 left-0 z-0"></span>
                                </div>
                            </div>
                            <div className="w-[300px] h-[10px]"></div>
                        </div>
                    </div>
                    <div className={`absolute top-1 left-1 bg-black w-full h-full -z-10 ${styles.cardCh}`}></div>
                </div>
            </div>
        );    
}

export default Post;