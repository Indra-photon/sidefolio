import { NextRequest, NextResponse } from 'next/server';
import imagekit from '@/lib/imagekit';

export async function GET(request: NextRequest) {
    try {
        const authenticationParameters = imagekit.getAuthenticationParameters();
        
        return NextResponse.json(
            { message: authenticationParameters, success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('ImageKit authentication error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to generate authentication parameters' },
            { status: 500 }
        );
    }
}