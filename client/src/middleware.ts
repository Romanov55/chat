import { auth } from "@/auth"

export default auth((req) => {
    const isAuth = !!req.auth; 
    const isHomePage = req.nextUrl.pathname === "/";
    const isLoginPage = req.nextUrl.pathname === "/login";

    if (isAuth && isLoginPage) {
        return Response.redirect(new URL("/", req.nextUrl.origin));
    }

    if (!isAuth && isHomePage) {
        return Response.redirect(new URL("/login", req.nextUrl.origin));
    }
});
