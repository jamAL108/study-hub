import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the URL path is exactly '/home'
  if (request.nextUrl.pathname === '/home') {
    // Redirect to '/home/chat'
    return NextResponse.redirect(new URL('/home/chat', request.url))
  }else if(request.nextUrl.pathname==='/NoteNest'){
    return NextResponse.redirect(new URL('/home/NoteNest', request.url))
  }
}

// Define the routes where the middleware will be applied
export const config = {
  matcher: ['/home','/NoteNest'],
}
