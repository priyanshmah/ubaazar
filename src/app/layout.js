'use client'
import "@/styles/globals.css";
import Navbar from "@/components/ui/navbar";
import { Provider } from "react-redux";
import store from "@/redux/store";
import localFont from '@next/font/local'
import { Overlock, Josefin_Sans } from "next/font/google"
import BottomBar from "@/components/ui/bottom-bar";
import AuthContext, { AuthProvider } from "@/context/authContext";
import { Analytics } from '@vercel/analytics/react'
import NextNProgress from 'nextjs-progressbar';
import Head from "next/head";
import Link from "next/link";
import UB from '@/public/UB.png'
import NextTopLoader from "nextjs-toploader";
import FacebookPixel from "@/helpers/pixel/pixelComponent";
import { PostHogProvider } from "@/helpers/postHog/postHagComponent";
import HeadContent from "@/components/header/HeadComponent";
import Options from "@/components/footer/Options";


const overlock = Josefin_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['100', '200', '300', '400', '500', '600', '700']
});

const monaSans = localFont({
  src: [{
    path: '../public/fonts/MonaSans-Regular.woff2',
    weight: "400"
  }],
  variable: "--font-mona"
})

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <HeadContent />
      <body className={`${monaSans.variable} ${overlock.className}`}>
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
              <footer>
                <Options />
              </footer>
              <Analytics />
            </Provider>
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}

