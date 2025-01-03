'use client';

import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles.module.css';
import { toast } from 'sonner';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Editor = dynamic(() => import('@/components/post/ui/Editor'), { ssr: false });

export default function Page() {
    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [details, setDetails] = useState('');
    const [content, setContent] = useState({});
    const [field, setField] = useState<number | undefined>(undefined);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: session } = useSession();

    const router = useRouter();

    const fieldList = [
        { field: 6, color: '#780000', name: '수학' },
        { field: 2, color: '#c1121f', name: '물리학' },
        { field: 3, color: '#ff6700', name: '화학' },
        { field: 4, color: '#003049', name: '생명과학' },
        { field: 5, color: '#588157', name: '지구과학' },
        { field: 1, color: '#669bbc', name: '정보' },
    ];

    const handleSave = async () => {
        setIsSaving(true)
        try {
            if (!title) {
                toast.warning('제목을 입력해주세요');
                return;
            }
            if (!thumbnail) {
                toast.warning('썸네일 이미지를 업로드해주세요');
                return;
            }
            if (!details) {
                toast.warning('설명을 입력해주세요');
                return;
            }
            if (!field) {
                toast.warning('분야를 설정해주세요.');
                return;
            }

            const response = await axios.post('/api/post/', {
                title,
                thumbnail,
                details,
                content,
                userId: session?.user.id,
                field,
            });

            router.push(`/post/edit?id=${response.data.postId}`)
        } catch (error) {
            toast.error("저장에 실패했습니다.")
        } finally {
            setIsSaving(false)
        }
    };

    const setFieldFunc = (id: number) => {
        setField(id);
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
                setThumbnail(data.file.url);
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
        setIsDeleting(true);
        try {
            await fetch('/api/media/delete?img=' + encodeURIComponent(thumbnail), {
                method: 'DELETE',
            });
            setThumbnail('');
        } catch {
            toast.error('삭제 중 에러가 발생했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleSave();
        }, 5 * 60 * 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    
    return (
        <main className="w-full flex flex-col items-center">
            <div className={styles.header}>
                {isUploading && <p>업로드 중...</p>}

                {thumbnail ? (
                    <button className={styles.thumbnailButton} onClick={deleteImg}>
                        <img
                            src={thumbnail}
                            alt="업로드된 썸네일"
                            className="w-[650px] object-cover mb-[20px]"
                        />
                        <p
                            className={`text-lg text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible opacity-0 ${
                                isDeleting ? 'visible' : 'invisible'
                            }`}
                        >
                            제거하기
                        </p>
                        <div className={`load ${isDeleting ? 'visible' : 'invisible'}`}>
                            <hr />
                            <hr />
                            <hr />
                            <hr />
                        </div>
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-3xl font-bold"
                />

                <input
                    placeholder="Details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                />

                <div className="p-[5px] grid grid-cols-6 gap-3">
                    {fieldList.map((item) => (
                        <button
                            key={item.field}
                            className="flex justify-center items-center text-white text-xs p-[5px] rounded-full duration-100"
                            style={{
                                backgroundColor: field === item.field ? item.color : '#bcbcbc',
                            }}
                            onClick={() => setFieldFunc(item.field)}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>

            <Editor onChange={(data) => setContent(data)} />

            <button onClick={handleSave} className='w-[650px] bg-black rounded-md h-[40px] mb-[50px]'>
                {isSaving ? (
                    <p className='text-white'>저장중....</p>
                
                ) : (
                    <p className='text-white'>저장</p>
                )}
            </button>
        </main>
    );
}
