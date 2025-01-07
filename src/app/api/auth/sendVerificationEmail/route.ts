import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "#/prisma/client"
import crypto from "crypto";

const sendVerificationEmail = async (email: string, verificationCode: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "이메일 인증",
    html: `
      <p>이메일 인증을 위해 아래 링크를 클릭하세요:</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/verify?code=${verificationCode}">
        인증하기
      </a>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "이메일이 필요합니다." }, { status: 400 });
    }

    const checkEmail = await prisma.user.findUnique({
      where : {
        email : email
      }
    })

    if(checkEmail) {
      return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 400 });
    }

    // 인증 코드 생성
    const verificationCode = Math.random().toString(36).substring(2, 15);
    const hashedCode = crypto.createHash("sha256").update(verificationCode).digest("hex");

    // 기존 토큰 삭제 (중복 방지)
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // 새 토큰 저장
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedCode,
        expires: new Date(Date.now() + 5 * 60 * 1000), // 5분 후 만료
      },
    });

    // 이메일 발송
    await sendVerificationEmail(email, hashedCode);

    return NextResponse.json({ message: "이메일이 성공적으로 발송되었습니다." }, { status: 200 });
  } catch (error) {
    console.error("이메일 발송 실패:", error);
    return NextResponse.json({ error: "이메일 발송 실패" }, { status: 500 });
  }
}
