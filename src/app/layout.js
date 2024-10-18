'use client'
import "@/styles/globals.css";
import Navbar from "@/components/ui/navbar";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { ABeeZee, Pacifico, Roboto } from "@next/font/google"
import BottomBar from "@/components/ui/bottom-bar";
import { AuthProvider } from "@/context/authContext";

const aBeeZee = Roboto({
  subsets: ['latin'],
  weight: ['400']
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${aBeeZee.className}`}>
        <AuthProvider>
          <Provider store={store}>
            <Navbar />
            {children}
            <BottomBar />
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}

