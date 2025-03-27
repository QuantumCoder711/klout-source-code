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
    {
        to: "/explore-events/all",
        name: "Explore Events"
    },
    {
        to: "/login",
        name: "login"
    },
];


export const domain: string = import.meta.env.VITE_API_BASE_URL;

export const token: string | null = localStorage.getItem("token");

export const apiKey: string = import.meta.env.VITE_API_KEY;

export const options = {
    types: ['establishment'], // Adjust types based on your needs
    componentRestrictions: { country: 'in' }, // Optional: Restrict by country code
    async: true,
    defer: true,
};