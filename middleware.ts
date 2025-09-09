import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// cấu hình các tuyến đường được truy cập public
const isPublicRoute = createRouteMatcher([
    "/",
    "/login(.*)",
    "/register(.*)",
    "/book(.*)",
])

// nếu req không thuộc tuyến đg public -> chuyển đến trang đăng nhập
export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};