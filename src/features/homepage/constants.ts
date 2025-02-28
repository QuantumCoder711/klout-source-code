export const navLinks = [
    // {
    //     to: "/",
    //     name: "home"
    // },
    // {
    //     to: "/features",
    //     name: "features"
    // },
    // {
    //     to: "/events",
    //     name: "events"
    // },
    // {
    //     to: "/download",
    //     name: "download"
    // },
    {
        to: "/login",
        name: "login"
    },
];


export const domain: string = import.meta.env.VITE_API_BASE_URL;

export const token: string | null = localStorage.getItem("token");