import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import bcrypt from "bcrypt";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const generateRandomAvatar = (): string => {
  const color1 = getRandomColor();
  const color2 = getRandomColor();

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#grad)" />
    </svg>
  `;
};

const emailPattern = /^h012s24\d{3}@gw1\.kr$/;
function isValidEmail(email: string) {
  return emailPattern.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const userName = await prisma.user.findMany({
      where : {
        name
      }
    })

    if (userName) {
      return NextResponse.json({ error: "Existing Name" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatarSVG = generateRandomAvatar();
    const avatarBase64 = Buffer.from(avatarSVG).toString("base64");

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image: `data:image/svg+xml;base64,${avatarBase64}`,
      },
    });

    return NextResponse.json({ message: "User created successfully", user }, { status: 200 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
