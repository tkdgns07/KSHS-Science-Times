'use client';
import Post from '@/components/home/ui/Post';
import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

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

export default function Home () {
    const { data : session, status } = useSession()

  const router = useRouter();

  useEffect(() => {
    if (status == "unauthenticated") {
      toast.warning("로그인 해주세요.")
      router.push("/signin")
    }
  }, [status])

  const fieldList = [
    { field: 6, color: '#780000', name: '수학' },
    { field: 2, color: '#c1121f', name: '물리학' },
    { field: 3, color: '#ff6700', name: '화학' },
    { field: 4, color: '#003049', name: '생명과학' },
    { field: 5, color: '#588157', name: '지구과학' },
    { field: 1, color: '#669bbc', name: '정보' },
];

const loader = useRef<HTMLDivElement | null>(null);

async function fetchPosts(pageParam: number): Promise<FetchResponse> {
  if (!session?.user?.email) {
    throw new Error("Session email is not available");
  }
  
  const { data } = await axios.post(`/api/post/allUser?skip=${pageParam}`, {
    userEmail: session.user.email,
  });

  const result: FetchResponse = data;
  return result;
}

const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
} = useInfiniteQuery<FetchResponse>({
  queryKey: ['posts', session?.user?.email], // session email을 queryKey에 추가
  queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam as number),
  initialPageParam: 0,
  enabled: !!session?.user?.email, // session 값이 없으면 비활성화
  getNextPageParam: (lastPage, allPages) => {
    return lastPage.formattedPosts.length === 9 ? allPages.length : undefined;
  },
});

  const posts = data?.pages.flatMap((page) => page.formattedPosts) || [];

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
    const fieldItem = fieldList.find(item => item.field === field);
    if (fieldItem) {
        return returnColor ? fieldItem.color : fieldItem.name;
    }
    return returnColor ? '#000000' : 'Unknown';
  };
  

  if (isLoading) {
    return <main className='flex justify-center items-center h-full'><Loader></Loader></main>;
  }

  return (
    <main className="flex flex-col h-full w-full items-center"> 
    <div className="w-full flex flex-col items-center mb-[30px]">
            <p className="font-light text-black text-2xl mb-[10px]">내가 쓴 글</p>
            <span className="w-[300px] h-[1px] bg-black"></span>
        </div>
      <div className={`grid md:grid-cols-3 grid-cols-2 gap-10`}>
        {posts.map((item: PostData) => (
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
        ))}
      </div>
      {isFetchingNextPage && <p className="text-center my-4"><Loader /></p>}
      <div ref={loader} />
    </main>

  );
};
