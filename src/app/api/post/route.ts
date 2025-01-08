import { NextResponse } from 'next/server';
import prisma from "../../../../prisma/client";

interface PostProps {
    id: number;
    title: string;
    thumbnail: string;
    details: string;
    field: number;
    content : any;
}

interface UserProps {
    name: string;
    image: string;
}

interface fetchResponse {
    post : PostProps
    user : UserProps
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, thumbnail, details, content, userId, field } = body;

  try {
    // const tags = await prisma.tags.findMany({
    //   where: {
    //     name: { in: tagsName },
    //   },
    //   select: { id: true },
    // });

    // // 3. 트랜잭션 처리
    // const postResponse = await prisma.$transaction(async (tx) => {
    //   // Post 생성
    //   const newPost = await tx.post.create({
    //     data: {
    //       title,
    //       thumbnail,
    //       details,
    //       content,
    //       createdBy: userId,
    //       field: field.id,
    //     },
    //   });

    //   // PostTags 관계 추가 (태그가 존재할 경우에만 처리)
    //   if (tags.length > 0) {
    //     await tx.postTags.createMany({
    //       data: tags.map((tag) => ({
    //         postId: newPost.id,
    //         tagId: tag.id,
    //       })),
    //     });
    //   }

        const postResponse = await prisma.post.create({
            data : {
                title,
                thumbnail,
                details,
                content,
                createdBy: userId,
                field,
            }
        })

    return NextResponse.json({ message: '게시물이 생성되었습니다.', postId: postResponse.id }, { status: 201 });
  } catch (error) {

    // Prisma 에러 처리
    return NextResponse.json(
      { error: error || '서버 오류', message: body },
      { status: 500 }
    );
  }
}

export async function GET(
    req: Request  ) {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');  
      
        if (!id) {
          return NextResponse.json(
            { error: '"id" 매개변수는 유효한 숫자여야 합니다.' },
            { status: 400 }
          );
        }
    
        const postId = parseInt(id, 10);
    
  
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });
  
      if (!post) {
        return NextResponse.json(
          { error: '포스트를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      const userInfo = await prisma.user.findUnique({
        where :{
            id : post.createdBy
        },
        select : {
            name : true,
            image : true
        }
      })
  
      // 포스트 반환
      return NextResponse.json({post : post, user : userInfo}, { status: 200 });
    } catch (error) {
      console.error('Error fetching post:', error);
    
      // 일반 서버 에러 처리
      return NextResponse.json(
        { error: '서버 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
  }
export async function DELETE(req: Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');  
  
    if (!id) {
      return NextResponse.json(
        { error: '"id" 매개변수는 유효한 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    const postId = parseInt(id, 10);

  try {
    const response = await prisma.post.delete({
        where : { id : postId }
    })

    return NextResponse.json({ message: `Deleted post ${id}` }, { status : 200})
  } catch (error) {
    return NextResponse.json({ error : error, message : `${id}번 개시물을 삭제하지 못했습니다.` }, { status : 500 });
  }
}

export async function PATCH(req: Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');  
  
    if (!id) {
      return NextResponse.json(
        { error: '"id" 매개변수는 유효한 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    const postId = parseInt(id, 10);

    const body = await req.json();
    const { postData } = body;
  
    try {
    //   const post = await prisma.post.findUnique({
    //     where: { id },
    //   });
  
    //   if (!post) {
    //     return NextResponse.json({ error: "Post not found" }, { status: 404 });
    //   }
  
    //   const field = await prisma.field.findUnique({
    //     where: { name: fieldName },
    //   });
  
    //   if (!field) {
    //     return NextResponse.json({ error: "Field not found" }, { status: 404 });
    //   }
  
    //   // 3. Tags 확인 및 ID 추출
    //   const existingTags = await prisma.tags.findMany({
    //     where: {
    //       name: {
    //         in: tagsName,
    //       },
    //     },
    //     select: { id: true },
    //   });
  
    //   const existingTagIds = existingTags.map(tag => tag.id);
  
    //   // 4. 현재 PostTags 관계 확인
    //   const currentPostTags = await prisma.postTags.findMany({
    //     where: { postId: id }, // 수정된 부분
    //     select: { tagId: true },
    //   });
  
    //   const currentTagIds = currentPostTags.map(tag => tag.tagId);
  
    //   const tagsToAdd = existingTagIds.filter(tagId => !currentTagIds.includes(tagId));
    //   const tagsToRemove = currentTagIds.filter(tagId => !existingTagIds.includes(tagId));
  
    //   const updatedPost = await prisma.$transaction(async (tx) => {
    //     const updated = await tx.post.update({
    //       where: { id },
    //       data: {
    //         title,
    //         thumbnail,
    //         details,
    //         content,
    //         field: field.id,
    //       },
    //     });
  
    //     if (tagsToAdd.length > 0) {
    //       await tx.postTags.createMany({
    //         data: tagsToAdd.map(tagId => ({
    //           postId: id, // 수정된 부분
    //           tagId,
    //         })),
    //       });
    //     }
  
    //     if (tagsToRemove.length > 0) {
    //       await tx.postTags.deleteMany({
    //         where: {
    //           postId: id,
    //           tagId: { in: tagsToRemove },
    //         },
    //       });
    //     }
  
    //     return updated;
    //   });
        
        const updatedPost = await prisma.post.update({
            where : { id : postData.post.id, user : postData.user },
            data : postData.post
        })

      return NextResponse.json(updatedPost, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error, message : "게시물은 업데이트하지 못했습니다." }, { status: 500 });
    }
  }
  