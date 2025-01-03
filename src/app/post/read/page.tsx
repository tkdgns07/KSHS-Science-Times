'use client';

import dynamic from 'next/dynamic';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../styles.module.css';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';


// Editor 컴포넌트를 동적으로 로드하며, 서버 사이드 렌더링을 비활성화합니다.
const Editor = dynamic(() => import('@/components/post/ui/Editor'), { ssr: false });

interface PostData {
    title: string;
    thumbnail: string;
    details: string;
    content: any;
    createdBy: string;
    field: number;
}

interface UserInfo {
    name: string;
    image: string;
}

export default function Page() {
    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState<string | null>(null); // 초기값을 null로 설정
    const [details, setDetails] = useState('');
    const [content, setContent] = useState<any | null>(null); // 초기값을 null로 설정
    const [field, setField] = useState<number | undefined>(undefined);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<UserInfo>()
    const [clientLoad, setClientLoad] = useState(true);

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
            const { data } = await axios.get<{ post: PostData; userInfo: UserInfo }>(`/api/post/${id}`);

            const postData = data.post
            setTitle(postData.title);
            setThumbnail(postData.thumbnail);
            setDetails(postData.details);
            setContent(postData.content);
            setField(postData.field);

            const userData = data.userInfo
            setUserInfo(userData)
        } catch (error) {
            console.error('Failed to fetch post data:', error);
            toast.error('포스트 데이터를 불러오는 데 실패했습니다.');
            router.push('/error');
        } finally {
            setClientLoad(false);
        }
    };

    useEffect(() => {
        if (!isNaN(id) && status === "authenticated") {
            getPostData();
        }
    }, [id, session?.user.id, status]);

    const goEdit = () => {
        router.push(`/post/edit?id=${id}`)
    }
    if (!clientLoad) {
        return (
        <main className="w-full flex flex-col items-center">
            <div className={styles.header}>
                {thumbnail && (
                    <div>
                        <img
                            src={thumbnail}
                            alt="업로드된 썸네일"
                            className="w-[650px] object-cover mb-[20px]"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/default-thumbnail.jpg'; // 기본 이미지 경로
                            }}
                        />
                        <p
                            className={`text-lg text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
                                isDeleting ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            제거하기
                        </p>
                        {isDeleting && (
                            <div className="loader absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
                                <div className="spinner"></div>
                            </div>
                        )}
                    </div>
                )}

                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-3xl font-bold w-full mb-4"
                    readOnly
                />

                <input
                    placeholder="Details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full mb-4"
                    readOnly
                />

<div
                className='flex w-fit justify-center items-center text-white text-xs py-[5px] px-[10px] rounded-full mb-[20px]'
                style={{
                    backgroundColor: fieldList.find(item => item.field === field)?.color,
                }}
            >
                {fieldList.find(item => item.field === field)?.name}
            </div>
            <div className='flex flex-row justify-end w-full mb-[20px]'>
            <div className='flex items-center bg-gray-200 p-[5px] justify-end w-fit rounded-md'>
                <img src={userInfo?.image} alt="프로필 이미지" className='w-[20px] mr-[5px]' />
                <p className=''>{userInfo?.name}</p>
            </div>
            </div>
            <span className='w-full h-[2px] bg-gray-600'></span>

        </div>
        

            {/* Editor 컴포넌트를 조건부로 렌더링 */}
            {content && (
                <Editor
                    key={id} // id를 key로 사용하여 콘텐츠 변경 시 Editor 재마운트
                    onChange={(data) => setContent(data)}
                    initialContent={content}
                    readOnly={true}
                />
            )}

            <button className="w-[650px] py-[5px] text-white bg-black rounded-md mb-[30px]" onClick={goEdit}>편집하기</button>
        </main>
    );
    } else {
        return (
            <div className='w-full h-screen flex justify-center items-center'>
            <Loader />
        </div>

        )
    }
}
