// app/api/byfile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import prisma from "../../../../../../prisma/client"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'editorjs',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    // 5) 업로드 결과에서 secure_url 추출
    const { secure_url, public_id } = uploadResult as {
        secure_url: string;
        public_id: string;
    };

    try {
        const response = await prisma.imageDB.create({
            data : {
                publicID : public_id,
                url : secure_url
            }
        })
    }catch (error) { 
        return NextResponse.json({
            error : "Can't add image info to db",
            message : "이미지 정보를 DB에 전달하지 못했습니다."
        }, { status : 500 })
    }

    return NextResponse.json({
      success: 1,
      file: {
        url: secure_url,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Cloudinary upload failed' }, { status: 500 });
  }
}
