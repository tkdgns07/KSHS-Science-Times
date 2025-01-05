import { NextResponse } from 'next/server';
import prisma from "#prisma/client"

export async function GET(
    req: Request,
    context: { params: { id: string } } // id를 string으로 정의
  ) {
    const { id } = await context.params;
  
    // id를 정수로 변환
    const postId = parseInt(id, 10);
  
    // 유효하지 않은 id 처리
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '"id" 매개변수는 유효한 숫자여야 합니다.' },
        { status: 400 }
      );
    }
  
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
      return NextResponse.json({post : post, userInfo : userInfo}, { status: 200 });
    } catch (error) {
      console.error('Error fetching post:', error);
    
      // 일반 서버 에러 처리
      return NextResponse.json(
        { error: '서버 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
  }
export async function DELETE(req: Request, context: { params: { id: string } }) {
    const { id } = await context.params;
  
    const postId = parseInt(id, 10);
  
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '"id" 매개변수는 유효한 숫자여야 합니다.' },
        { status: 400 }
      );
    }

  try {
    const response = await prisma.post.delete({
        where : { id : postId }
    })

    return NextResponse.json({ message: `Deleted post ${id}` }, { status : 200})
  } catch (error) {
    return NextResponse.json({ error : error, message : `${id}번 개시물을 삭제하지 못했습니다.` }, { status : 500 });
  }
}

export async function PATCH(req: Request, context : { params: { id: string } }) {
    const { id } = await context.params;
  
    // id를 정수로 변환
    const postId = parseInt(id, 10);
  
    // 유효하지 않은 id 처리
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '"id" 매개변수는 유효한 숫자여야 합니다.' },
        { status: 400 }
      );
    }
    const body = await req.json();
    const { title, thumbnail, details, content, field } = body;
  
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
            where : { id : postId },
            data : {
                title,
                thumbnail,
                details,
                content,
                field: field,
            }
        })
  
      return NextResponse.json(updatedPost, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to update post", message : "게시물은 업데이트하지 못했습니다." }, { status: 500 });
    }
  }
  