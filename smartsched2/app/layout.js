import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
    title: "SmartSched - Efficient Timetable Management",
    description: "Powerful timetable management for students",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap" rel="stylesheet" />
            </head>
            <body>
                <Navbar />
                {children}
            </body>
        </html>
    );
}
