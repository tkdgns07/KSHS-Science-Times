import { NextResponse } from "next/server";
import prisma from "#/prisma/client";

// Define the type for a post
interface Post {
  id: number;
  title: string;
  thumbnail: string | null;
  details: string | null;
  field: number;
  createdAt: Date;
  user: {
    name: string | null; // Allow name to be null
    image: string | null;
  };
}

export async function POST(request: Request) {
  const body = await request.json();
  const { contentParam } = body;

  const url = new URL(request.url);
  const skip = url.searchParams.get("skip");
  if (!skip) {
    return NextResponse.json(
      { error: '"id" 매개변수는 유효한 숫자여야 합니다.' },
      { status: 400 }
    );
  }
  const skipInt = parseInt(skip);

  const parts = contentParam.split("$%^");
  const userNameWhere = parts[0] ? { user: { name: parts[0] } } : {};
  const tags: string[] = parts[1].split(" ");

  const posts: Post[] = await prisma.post.findMany({
    where: userNameWhere,
    select: {
      id: true,
      title: true,
      thumbnail: true,
      details: true,
      field: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  const postsWithTagCount = posts.map((post) => {
    const matchedTags = tags.filter((tag) => post.title.includes(tag));
    return {
      ...post,
      tagCount: matchedTags.length,
    };
  });

  const sortedPosts = postsWithTagCount
    .filter((post) => post.tagCount > 0)
    .sort((a, b) => b.tagCount - a.tagCount);

  const startIndex = skipInt * 6;
  const paginatedPosts = sortedPosts.slice(startIndex, startIndex + 6);

  const postsResult = paginatedPosts.map(({ tagCount, ...post }) => post);

  if (!postsResult) {
    const formattedPosts = "";
    return NextResponse.json({ formattedPosts }, { status: 200 });
  }

  const formattedPosts = postsResult.map((post) => ({
    post: {
      id: post.id,
      title: post.title,
      thumbnail: post.thumbnail,
      details: post.details,
      field: post.field,
      createdAt: post.createdAt,
    },
    user: {
      name: post.user.name,
      image: post.user.image,
    },
  }));

  return NextResponse.json({ formattedPosts }, { status: 200 });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const skip = url.searchParams.get("skip");
  if (!skip) {
    return NextResponse.json(
      { error: '"id" 매개변수는 유효한 숫자여야 합니다.' },
      { status: 400 }
    );
  }

  const skipNum = parseInt(skip, 10) * 6;

  if (isNaN(skipNum)) {
    return NextResponse.json(
      { error: '"id" 매개변수는 유효한 숫자여야 합니다.' },
      { status: 400 }
    );
  }

  try {
    const posts: Post[] = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: skipNum,
      take: 6,
      select: {
        id: true,
        title: true,
        thumbnail: true,
        details: true,
        field: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    const formattedPosts = posts.map((post) => ({
      post: {
        id: post.id,
        title: post.title,
        thumbnail: post.thumbnail,
        details: post.details,
        field: post.field,
        createdAt: post.createdAt,
      },
      user: {
        name: post.user.name,
        image: post.user.image,
      },
    }));

    return NextResponse.json({ formattedPosts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error, message: "서버데이터를 가져오지 못했습니다." },
      { status: 400 }
    );
  }
}
