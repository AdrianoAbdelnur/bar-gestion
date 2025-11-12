import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// @ts-ignore
import jwt from 'jsonwebtoken';

const PROTECTED_PATHS = ['/api/dishes', '/api/drinks', '/api/ingredients'];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const needsAuth = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!needsAuth) return NextResponse.next();

  const token = req.headers.get('authorization') || req.headers.get('token');
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (
      ['POST', 'PUT', 'PATCH'].includes(req.method) &&
      decoded.role !== 'admin'
    ) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.next();
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
