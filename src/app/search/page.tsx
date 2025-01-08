'use client';
import Post from '@/components/home/ui/Post';
import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Search from '@/components/home/ui/Search';
import Loader from '@/components/ui/Loader';
import { Suspense } from 'react';

interface PostInfo {
  id: number;
  title: string;
  thumbnail: string;
  details: string;
  field: number;
  createdAt: Date;
}

interface UserInfo {
  name: string;
  image: string;
}

interface PostData {
  post: PostInfo;
  user: UserInfo;
}

interface FetchResponse {
  formattedPosts: PostData[];
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [contentParam, setContentParam] = useState<string | null>(null);
  const loader = useRef<HTMLDivElement | null>(null);

  const param = searchParams.get('content')?.toString();

  useEffect(() => {
    if (param) {
      setContentParam(param);
    }
  }, [searchParams]);

  const fieldList = [
    { field: 6, color: '#780000', name: '수학' },
    { field: 2, color: '#c1121f', name: '물리학' },
    { field: 3, color: '#ff6700', name: '화학' },
    { field: 4, color: '#003049', name: '생명과학' },
    { field: 5, color: '#588157', name: '지구과학' },
    { field: 1, color: '#669bbc', name: '정보' },
  ];

  async function fetchPosts(pageParam: number): Promise<FetchResponse> {
    const { data } = await axios.post(`/api/post/all?skip=${pageParam}`, {
      contentParam,
    });
    return data;
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<FetchResponse>({
    queryKey: ['posts', contentParam],
    queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.formattedPosts.length === 6 ? allPages.length : undefined;
    },
    enabled: !!contentParam, // contentParam 값이 있을 때만 실행
  });

  useEffect(() => {
    if (!contentParam) return;
    refetch(); // contentParam이 변경되면 데이터를 다시 로드
  }, [contentParam, refetch]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const getFieldInfo = (field: number, returnColor: boolean): string => {
    const fieldItem = fieldList.find((item) => item.field === field);
    if (fieldItem) {
      return returnColor ? fieldItem.color : fieldItem.name;
    }
    return returnColor ? '#000000' : 'Unknown';
  };

  const posts = data?.pages.flatMap((page) => page.formattedPosts) || [];

  if (isLoading) {
    return <main className='flex justify-center items-center h-full'><Loader></Loader></main>;
  }

  return (
    <Suspense fallback={<Loader />}>
      <main className="flex flex-col h-full w-full items-center">
        <div className="top-[6px] z-50 fixed flex justify-center">
          <Search initialContent={param} />
        </div>
        <div className={`grid md:grid-cols-3 grid-cols-2 gap-10`}>
          {posts.length > 0 ? (
            posts.map((item: PostData) => (
              <Post
                key={item.post.id}
                id={item.post.id}
                width={300}
                title={item.post.title}
                thumbnail={item.post.thumbnail}
                details={item.post.details}
                field={item.post.field}
                name={item.user.name}
                image={item.user.image}
                fieldColor={getFieldInfo}
              />
            ))
          ) : (
            <p className="text-xl font-bold">원하는 결과를 찾지 못했습니다.</p>
          )}
        </div>
        {isFetchingNextPage && <p className="text-center my-4"><Loader /></p>}
        <div ref={loader} />
      </main>
    </Suspense>
  );
    }
