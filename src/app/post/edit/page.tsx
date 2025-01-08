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
import { Suspense } from 'react';

// Editor 컴포넌트를 동적으로 로드하며, 서버 사이드 렌더링을 비활성화합니다.
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
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [clientLoad, setClientLoad] = useState(true);
    const [postData, setPostData] = useState<PostData>()

    const fieldList = [
        { field: 6, color: '#780000', name: '수학' },
        { field: 2, color: '#c1121f', name: '물리학' },
        { field: 3, color: '#ff6700', name: '화학' },
        { field: 4, color: '#003049', name: '생명과학' },
        { field: 5, color: '#588157', name: '지구과학' },
        { field: 1, color: '#669bbc', name: '정보' },
    ];

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: session, status } = useSession();

    const searchParams = useSearchParams();
    const idParam = searchParams.get('id');
    const id = idParam !== null ? Number(idParam) : NaN;

    const router = useRouter();

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
            setClientLoad(false)
        }
    };

    useEffect(() => {
        if (id !== undefined) {
            getPostData();
        }
    }, [id, session?.user.id]);

    useEffect(() => {
        if ((postData && postData.user.name !== session?.user.name || !session) || status !== "authenticated") {
            toast.warning("페이지를 다룰 권한이 없습니다.")
            router.push("/")
            return;
        }
    }, [session])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            if (!postData?.post.title) {
                toast.warning('제목을 입력해주세요');
                return;
            }
            if (!postData.post.thumbnail) {
                toast.warning('썸네일 이미지를 업로드해주세요');
                return;
            }
            if (!postData.post.details) {
                toast.warning('설명을 입력해주세요');
                return;
            }
            if (!postData.post.field) {
                toast.warning('분야를 설정해주세요.');
                return;
            }

            await axios.patch(`../api/post?id=${id}`, {
                postData
            });


            toast.success('성공적으로 저장되었습니다.');
        } catch (error) {
            toast.error('포스트 저장에 실패했습니다.');
        } finally {
            setIsSaving(false)
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await axios.delete(`../api/post?id=${id}`)

            toast.success("삭제에 성공했습니다.")
            router.push("/")
        } catch (error) {
            toast.error("삭제에 실패했습니다.")
        } finally {
            setIsDeleting(false)
        }
    }

    const setFieldFunc = (id: number) => {
        setPostData((prev) => {
            if (prev)
            return {
                ...prev,
                post: {
                    ...prev.post,
                    field : id,
                },
            };
        });
    };

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

            const res = await fetch('/api/media/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data?.success === 1 && data?.file?.url) {
                setPostData((prev) => {
                    if (prev)
                    return {
                        ...prev,
                        post: {
                            ...prev.post,
                            thumbnail : data.file.url,
                        },
                    };
                });
                toast.success('이미지 업로드 성공!');
            } else {
                toast.error('업로드 중 에러가 발생했습니다.');
            }
        } catch {
            toast.error('업로드 중 에러가 발생했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    const deleteImg = async () => {
        if (!postData?.post.thumbnail) {
            toast.error('삭제할 이미지가 없습니다.');
            return;
        }

        setIsDeleting(true);
        try {
            await fetch('/api/media/delete?img=' + encodeURIComponent(postData?.post.thumbnail), {
                method: 'DELETE',
            });
            setPostData((prev) => {
                if (prev)
                return {
                    ...prev,
                    post: {
                        ...prev.post,
                        thumbnail : "",
                    },
                };
            });
            toast.success('이미지가 삭제되었습니다.');
        } catch {
            toast.error('삭제 중 에러가 발생했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    // 5분마다 자동 저장
    useEffect(() => {
        const interval = setInterval(() => {
            handleSave();
            console.log('자동 저장 완료');
        }, 5 * 60 * 1000); // 5분

        return () => clearInterval(interval);
    }, [postData]); // 의존성 배열에 상태 추가

    if (!clientLoad || postData) {
        return (
            <Suspense>
                        <main className="w-full flex flex-col items-center">
                        <div className={styles.header}>
                            {isUploading && <p>업로드 중...</p>}
            
                            {postData?.post.thumbnail ? (
                                <button className={styles.thumbnailButton} onClick={deleteImg}>
                                    <img
                                        src={postData?.post.thumbnail}
                                        alt="업로드된 썸네일"
                                        className="w-[650px] object-cover mb-[20px]"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/default-thumbnail.jpg'; // 기본 이미지 경로
                                        }}
                                    />
                                    {isDeleting ? (
                                    <div className={`load ${isDeleting ? 'visible' : 'invisible'}`}>
                                    <hr />
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                                ) : (
                                    <p
                                    className={`text-lg text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
                                        isDeleting ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                    제거하기
                                </p>
            
                                )}
                                </button>
                            ) : (
                                <div className="!mb-[10px]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <button
                                        onClick={handleButtonClick}
                                        className={styles.imageInputButton}
                                    >
                                        <img
                                            src="/icons/image.svg"
                                            alt="이미지 아이콘"
                                            className="w-[15px] mr-[5px]"
                                        />
                                        배경 업로드
                                    </button>
                                </div>
                            )}
                            <input
                                placeholder="Title"
                                value={postData?.post.title}
                                onChange={(e) => {
                                    setPostData((prev) => {
                                        if (prev) {
                                            return {
                                                ...prev,
                                                post: {
                                                    ...prev.post,
                                                    title: e.target.value,
                                                },
                                            };    
                                        }
                                    });
                                }}
                                className="text-3xl font-bold w-full mb-4"
                            />
            
                            <input
                                placeholder="Details"
                                value={postData?.post.details}
                                onChange={(e) => {
                                    setPostData((prev) => {
                                        if (prev) {
                                            return {
                                                ...prev,
                                                post: {
                                                    ...prev.post,
                                                    details: e.target.value,
                                                },
                                            };    
                                        }
                                    });
                                }}
                                className="w-full mb-4"
                            />
            
                            <div className="p-[5px] grid grid-cols-6 gap-3 w-full">
                                {fieldList.map((item) => (
                                    <button
                                        key={item.field}
                                        className="flex justify-center items-center text-white text-xs p-[5px] rounded-full duration-100"
                                        style={{
                                            backgroundColor: postData?.post.field === item.field ? item.color : '#bcbcbc',
                                        }}
                                        onClick={() => setFieldFunc(item.field)}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
            
                        </div>
            
                        {/* Editor 컴포넌트를 조건부로 렌더링 */}
                        {postData?.post.content && (
                            <Editor
                                key={id} // id를 key로 사용하여 콘텐츠 변경 시 Editor 재마운트
                                onChange={(data) => setPostData((prev) => {
                                    if (prev)
                                    return {
                                        ...prev,
                                        post: {
                                            ...prev.post,
                                            content: data,
                                        },
                                    };
                                })}
                                initialContent={postData?.post.content}
                            />
                        )}
            <div className='w-[650px] flex'>
            <button onClick={handleSave} className='w-full bg-black rounded-md h-[40px] mb-[10px] mr-[10px]'>
                            {isSaving ? (
                                <p className='text-white'>저장중....</p>
                            
                            ) : (
                                <p className='text-white'>저장</p>
                            )}
                        </button>
                        <button onClick={handleDelete} className='w-full bg-red-600 rounded-md h-[40px] mb-[50px]'>
                            {isDeleting ? (
                                <p className='text-white'>삭제중....</p>
                            
                            ) : (
                                <p className='text-white'>삭제</p>
                            )}
                        </button>
                        </div>
                    </main>
                    </Suspense>
        )
    }else {
        return (
            <Suspense>
            <div className='w-full h-screen flex justify-center items-center'>
                <Loader />
            </div>
            </Suspense>
        );
    
    }
}
