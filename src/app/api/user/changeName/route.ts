import { NextResponse } from "next/server";
import prisma from "#/prisma/client";

export async function POST(request : Request) {
    const body = await request.json()
    const { email, changedName } = body

    try {
        await prisma.user.update({
            where : {email},
            data : {
                name : changedName
            }
        })

        return NextResponse.json({ message : "닉네임을 성공적으로 업네디트 했습니다." }, { status : 200 })
    } catch (error) {
        return NextResponse.json({ message : "닉네임을 업데이트 하는데 문제가 발생했습니다.", error }, { status : 200 })
    }
}