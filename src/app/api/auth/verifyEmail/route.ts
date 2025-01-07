import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function POST(req: Request) {
  try {
    const { code } = await req.json(); // 요청에서 code 파싱

    if (!code) {
      return NextResponse.json({ error: "인증 코드가 제공되지 않았습니다." }, { status: 400 });
    }

    const verification = await prisma.verificationToken.findUnique({
      where: { token: code },
    });

    if (!verification) {
      return NextResponse.json({ error: "유효하지 않은 인증 코드입니다." }, { status: 400 });
    }

    if (new Date() > verification.expires) {
      return NextResponse.json({ error: "인증 코드가 만료되었습니다." }, { status: 400 });
    }

    // 인증 완료 처리 (예: 사용자를 활성화)
    await prisma.verificationToken.delete({
      where: { token: code },
    });

    return NextResponse.json({ 
      message: "이메일 인증이 완료되었습니다.",
      email : verification.identifier
    }, { status: 200 });
  } catch (error) {
    console.error("서버 오류:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}