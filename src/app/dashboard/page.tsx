'use client'
import Post from "@/components/home/ui/Post";
import { useState, useEffect, useRef, useCallback, } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

interface PostInfo {
  id: number,
  title: string;
  thumbnail: string;
  details: string;
  field: number;
  createdAt : Date;
}

interface UserInfo {
  name: string;
  image: string;
}

interface PostData {
  post : PostInfo,
  user : UserInfo
}

const HomePage = () => {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [cardNum, setCardNum] = useState<number>(0);
  const [postData, setPostData] = useState<PostData[]>([])
  const [skip, setSkip] = useState(0);
  const [disableScroll, setDisableScroll] = useState<boolean>(false)

  const fieldList = [
    { field: 6, color: '#780000', name: '수학' },
    { field: 2, color: '#c1121f', name: '물리학' },
    { field: 3, color: '#ff6700', name: '화학' },
    { field: 4, color: '#003049', name: '생명과학' },
    { field: 5, color: '#588157', name: '지구과학' },
    { field: 1, color: '#669bbc', name: '정보' },
];

const checkPost = async (id: number) => {
    try {
        const { data } = await axios.get<PostData[]>(`/api/post/${id}`);

        setPostData(data)
    } catch (error) {
        console.error("Error fetching post details:", error);
    
        throw new Error("Failed to fetch post details.");
    }
}

const getFieldInfo = (field: number, returnColor: boolean): string => {
  const fieldItem = fieldList.find(item => item.field === field);
  if (fieldItem) {
      return returnColor ? fieldItem.color : fieldItem.name;
  }
  return returnColor ? '#000000' : 'Unknown';
};

const goToPost = (id : number) => {
  router.push(`/post/read?id=${id}`)
}

  useEffect(() => {
    // 초기 화면 너비 설정
    const updateWidth = () => setWindowWidth(window.innerWidth);

    updateWidth();

    window.addEventListener("resize", updateWidth);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(() => {
    if(windowWidth < 580 && windowWidth !== 0) {
      router.push("/error")
    }else{
      const num = Math.floor((windowWidth - 580) / 300)
      setCardNum(num)
    }
  }, [windowWidth])





  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getPostDataIn = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get(`/api/post/all/${skip}`)
      
      const newPost : PostData[] = data.formattedPosts

      if (newPost.length < 15) {
        setDisableScroll(true)
        setPostData(prevPosts => [...prevPosts, ...newPost]);
        console.log(disableScroll)
        return
      }

      setPostData(prevPosts => [...prevPosts, ...newPost]);
      console.log("dd")

    } catch (error) {
      toast.error("데이터 처리에 실패했습니다.")
    } finally {
      setIsLoading(false)
      setSkip(prevSkip => prevSkip + 1);
    }
  }

  const loader = useRef<HTMLDivElement | null>(null);

  const addNext15Ids = useCallback(() => {
    getPostDataIn()
  }, []);

  useEffect(() => {
      const options = {
          root: null,
          rootMargin: '20px',
          threshold: 1.0
      };

      const observer = new IntersectionObserver((entries) => {
          const target = entries[0];
          if (target.isIntersecting && (!isLoading && !disableScroll)) {
              addNext15Ids();
          }
      }, options);

      if (loader.current) {
          observer.observe(loader.current);
      }

      return () => {
          if (loader.current) {
              observer.unobserve(loader.current);
          }
      };
  }, [addNext15Ids, isLoading]);

  return (
    <main className="flex flex-col h-full w-full items-center">
        <div className="w-full flex flex-col items-center mb-[30px]">
            <p className="font-light text-black text-2xl mb-[10px]">내가 쓴 글</p>
            <span className="w-[300px] h-[1px] bg-black"></span>
        </div>
      <div className={`grid md:grid-cols-3 grid-cols-2 gap-10`}>
      {postData.map((item, index) => {
        return (
          <Post
            key={index}
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
        )
      })}
      </div>
      {!isLoading && <p className="text-center my-4">데이터를 로드 중입니다...</p>}
      <div ref={loader} />
    </main>
  );
}

export default HomePage