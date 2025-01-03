import { NextResponse } from "next/server";
import prisma from "#prisma/client";

export async function GET(request: Request, context: { params: { skip: string } }) {
  const { skip } = await context.params;
  
    const skipNum = parseInt(skip, 10) * 15;
  
    if (isNaN(skipNum)) {
      return NextResponse.json(
        { error: '"id" 매개변수는 유효한 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    try {
        const posts = await prisma.post.findMany({
            orderBy: {
              createdAt: 'desc',
            },
            skip: skipNum,
            take: 15,
            select: {
              id: true,
              title: true,
              thumbnail: true,
              details: true,
              field: true,
              createdAt: true,
              user : {
                select : {
                    name : true,
                    image : true,    
                }
              }
            },
        });

        const formattedPosts = posts.map(post => ({
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

        return NextResponse.json({ formattedPosts }, { status : 200 })
    } catch (error) {
        return NextResponse.json({ error : error, message : "서버데이터를 가져오지 못했습니다." }, { status : 400 })
    }
}