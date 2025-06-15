'use client'
import "@/styles/globals.css";
import Navbar from "@/components/ui/navbar";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { Be_Vietnam_Pro, Josefin_Sans, Montserrat, Overlock, Poppins, Solway } from "next/font/google"
import AuthContext, { AuthProvider } from "@/context/authContext";
import { Analytics } from '@vercel/analytics/react'
import NextTopLoader from "nextjs-toploader";
import FacebookPixel from "@/helpers/pixel/pixelComponent";
import { PostHogProvider } from "@/helpers/postHog/postHagComponent";
import HeadContent from "@/components/header/HeadComponent";
import Options from "@/components/footer/Options";


const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],

});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900']
})

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900']
})


export default function RootLayout({ children }) {

  return (
    <html lang="en" className={`${josefinSans.className}`}>
      <HeadContent />
      <body className={`${poppins.className}`}>
        <NextTopLoader
          showSpinner={false}
          color="#ff6341"
          height={4}
        />
        <FacebookPixel />
        <PostHogProvider>
          <AuthProvider>
            <Provider store={store}>
              <header className="sticky top-0 left-0 z-50 bg-white">
                <Navbar />
              </header>
              {children}
              <Analytics />
            </Provider>
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}

