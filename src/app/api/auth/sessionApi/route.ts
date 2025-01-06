import { NextResponse } from "next/server";
import prisma from "#prisma/client";

function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

const addNewSession = async (sessionToken : string, expires : Date) => {
    try {
        await prisma.session.delete({
            where: { sessionToken },
        });

        const newSessionToken = generateRandomString(16);

        const response = await prisma.session.findFirst({
            where : { sessionToken : newSessionToken }
        })

        if (response) {
            addNewSession(sessionToken, expires)
            return
        }

        await prisma.session.update({
            where : { sessionToken },
            data: {
                sessionToken: newSessionToken,
                expires,
            },
        });

        return NextResponse.json({
            message: "Session renewed",
            sessionToken: newSessionToken,
            expires,
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to renew session" }, { status: 500 });
    }

}

export async function POST(req: Request) {
    const body = await req.json();
    const { sessionToken } = body;
    const currentDate = new Date();

    const session = await prisma.session.findUnique({
        where: { sessionToken },
    });

    if (!session) {
        return NextResponse.json({ error: "Unable Session Token" }, { status: 500 });
    }

    if (currentDate.getTime() >= new Date(session.expires).getTime()) {
        const expires = new Date();
        expires.setHours(expires.getHours() + 24);

        addNewSession(sessionToken, expires)
    }

    return NextResponse.json({ message: "Session is still valid" });
}

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 400 }
      );
    }

    const sessionToken = authHeader.split(" ")[1];

    const session = await prisma.session.findUnique({
      where: { sessionToken },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    try {
        await prisma.session.delete({
            where: { sessionToken },
          });      
    } catch (error) {
        return NextResponse.json({ error: "Unabled Session" }, { status: 400 });
    }
    return NextResponse.json({ message: "Session deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
