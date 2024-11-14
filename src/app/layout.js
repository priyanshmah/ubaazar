'use client'
import "@/styles/globals.css";
import Navbar from "@/components/ui/navbar";
import { Provider } from "react-redux";
import store from "@/redux/store";
import localFont from '@next/font/local'
import { ABeeZee, Arima, Baskervville, Crimson_Text, Lora, Merriweather, Montserrat, Nunito, Overlock, Pacifico, Poppins, Raleway, Roboto, Roboto_Serif, Roboto_Slab } from "@next/font/google"
import BottomBar from "@/components/ui/bottom-bar";
import { AuthProvider } from "@/context/authContext";
import { Analytics } from '@vercel/analytics/react'
import Head from "next/head";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";

const overlock = Overlock({
  subsets: ['latin', 'latin-ext'],
  // weight: ['400', '500', '600', '700']
  weight: ['400', '700', '900']
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
      <body className={`${monaSans.variable} ${overlock.className}`}>
        <AuthProvider>
          <Provider store={store}>
            <header>
              <Navbar />
            </header>
            <Suspense fallback={<Loading />}>

              {children}
            </Suspense>
            <footer>
              <BottomBar />
            </footer>
            <Analytics />
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}

