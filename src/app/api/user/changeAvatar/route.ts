import { NextResponse } from "next/server";
import prisma from "#/prisma/client"

export async function POST(request : Request) {
    const body = await request.json();
    const { avatar, email } = body

    try {
        await prisma.user.update({
            where : {email},
            data : {image : avatar}
        })

        return NextResponse.json({ message : "성공적으로 아바타를 업로드했습니다." }, { status : 200 })
    } catch (error) {
        return NextResponse.json({ message : "아바타 업로드 중 에러가 발생했습니다.", error : error }, { status : 500 })
    }
}