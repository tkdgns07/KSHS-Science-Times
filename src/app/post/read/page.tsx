"use client";
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../styles.module.css';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';
import { Suspense } from 'react'

const Editor = dynamic(() => import('@/components/post/ui/Editor'), { ssr: false });

interface PostInfo {
    id: number;
    title: string;
    thumbnail: string;
    details: string;
    field: number;
    content : any;
}
  
interface UserInfo {
    name: string;
    image: string;
}

interface PostData {
    post: PostInfo;
    user: UserInfo;
}


export default function Page() {
    const [clientLoad, setClientLoad] = useState(true);
    const [postData, setPostData] = useState<PostData | null>(null)

    const fieldList = [
        { field: 6, color: '#780000', name: '수학' },
        { field: 2, color: '#c1121f', name: '물리학' },
        { field: 3, color: '#ff6700', name: '화학' },
        { field: 4, color: '#003049', name: '생명과학' },
        { field: 5, color: '#588157', name: '지구과학' },
        { field: 1, color: '#669bbc', name: '정보' },
    ];

    const searchParams = useSearchParams();
    const idParam = searchParams.get('id');
    const id = idParam !== null ? Number(idParam) : NaN;

    const router = useRouter();
    const { data: session, status } = useSession();

    const getPostData = async () => {
        if (isNaN(id)) {
            toast.error('"id" 매개변수가 유효하지 않습니다.');
            router.push('/error');
            return;
        }

        try {
            const { data } = await axios.get(`/api/post?id=${id}`);

            setPostData(data)
        } catch (error) {
            toast.error('포스트 데이터를 불러오는 데 실패했습니다.');
            router.push('/error');
        } finally {
            setClientLoad(false);
        }
    };

    useEffect(() => {
        getPostData();
    }, []);

    const goEdit = () => {
        router.push(`/post/edit?id=${id}`)
    }
    if (postData) {
        return (
            <Suspense>
        <main className="w-full flex flex-col items-center">
            <div className={styles.header}>
                    <div>
                        <img
                            src={postData?.post.thumbnail}
                            alt="업로드된 썸네일"
                            className="w-[650px] object-cover mb-[20px]"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/default-thumbnail.jpg'; // 기본 이미지 경로
                            }}
                        />
                    </div>

                <p
                    className="text-3xl font-bold w-full mb-4"
                >{postData?.post.title}</p>

                <p
                    className="w-full mb-4"
                >{postData?.post.details}</p>

<div
                className='flex w-fit justify-center items-center text-white text-xs py-[5px] px-[10px] rounded-full mb-[20px]'
                style={{
                    backgroundColor: fieldList.find(item => item.field === postData?.post.field)?.color,
                }}
            >
                {fieldList.find(item => item.field === postData?.post.field)?.name}
            </div>
            <div className='flex flex-row justify-end w-full mb-[20px]'>
            <div className='flex items-center bg-gray-200 p-[5px] justify-end w-fit rounded-md'>
                <img src={postData?.user?.image} alt="프로필 이미지" className='w-[20px] mr-[5px]' />
                <p className=''>{postData?.user?.name}</p>
            </div>
            </div>
            <span className='w-full h-[2px] bg-gray-600'></span>

        </div>
        

                <Editor
                    key={id} // id를 key로 사용하여 콘텐츠 변경 시 Editor 재마운트
                    initialContent={postData?.post.content}
                    readOnly={true}
                />
                {session?.user.name == postData.user.name && <button className="w-[650px] py-[5px] text-white bg-black rounded-md mb-[30px]" onClick={goEdit}>편집하기</button>}
            
        </main>
        </Suspense>
    );
    } else {
        return (
            <Suspense>
            <div className='w-full h-screen flex justify-center items-center'>
            <Loader />
            </div>
        </Suspense>

        )
    }
}
