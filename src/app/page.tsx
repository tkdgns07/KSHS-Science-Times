'use client';
import Post from '@/components/home/ui/Post';
import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Search from '@/components/home/ui/Search';
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

  const router = useRouter();

  const fieldList = [
    { field: 6, color: '#780000', name: '수학' },
    { field: 2, color: '#c1121f', name: '물리학' },
    { field: 3, color: '#ff6700', name: '화학' },
    { field: 4, color: '#003049', name: '생명과학' },
    { field: 5, color: '#588157', name: '지구과학' },
    { field: 1, color: '#669bbc', name: '정보' },
];

async function fetchPosts(pageParam: number): Promise<FetchResponse> {
  const { data } = await axios.get(`/api/post/all/${pageParam}`);
  const result: FetchResponse = data
  return result
};

const goToPost = (id : number) => {
  router.push(`/post/edit?id=${id}`)
}

  const loader = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<FetchResponse>({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.formattedPosts.length === 6 ? allPages.length : undefined;
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
    return <p>Loading...</p>;
  }

  return (
    <main className="flex flex-col h-full w-full items-center">
      <Search></Search>
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
            goPost={goToPost}
            fieldColor={getFieldInfo}
          />
        ))}
      </div>
      {isFetchingNextPage && <p className="text-center my-4">데이터를 로드 중입니다...</p>}
      <div ref={loader} />
    </main>

  );
};