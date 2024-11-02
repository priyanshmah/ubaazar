'use client'
import "@/styles/globals.css";
import Navbar from "@/components/ui/navbar";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { ABeeZee, Arima, Baskervville, Crimson_Text, Lora, Merriweather, Montserrat, Nunito, Overlock, Pacifico, Poppins, Raleway, Roboto, Roboto_Serif, Roboto_Slab } from "@next/font/google"
import BottomBar from "@/components/ui/bottom-bar";
import { AuthProvider } from "@/context/authContext";
import { Analytics } from '@vercel/analytics/react'

const aBeeZee = Overlock({
  subsets: ['latin'],
  // weight: ['400', '500', '600', '700']
  weight: ['400']
});

const roboto = ABeeZee({
  subsets: ['latin'],
  weight: ['400']
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${aBeeZee.className}`}>
        <AuthProvider>
          <Provider store={store}>
            <header>
              <Navbar />
            </header>
            {children}
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

