import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import prisma from "#prisma/client"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

// Next.js App Router에서 nodejs runtime 사용 (edge에선 cloudinary lib 호환성 이슈가 있음)
export const runtime = 'nodejs';

/**
 * GET /api/media/delete/[publicId]
 * 요청 예: /api/media/delete/editorjs/myImage
 * → Cloudinary에서 해당 public_id 리소스 삭제
 */
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const secureId : string | undefined = searchParams.get('img') ?? undefined;
        
        const res = await prisma.imageDB.delete({
            where : {
                url : secureId ?? undefined
            }
        })

        const publicId = res.publicID;

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'not found') {
            return NextResponse.json(
                { error: `No such file: ${publicId}` },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Deleted ${publicId} from Cloudinary`,
            result,
        });
    } catch (error) {
        console.error('Cloudinary delete failed:', error);
        return NextResponse.json(
            { error: error, message : 'Cloudinary delete failed' },
            { status: 500 }
        );
    }
}
