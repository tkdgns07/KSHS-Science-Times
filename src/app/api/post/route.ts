import { NextResponse } from 'next/server';
import prisma from '#prisma/client';

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
