import "../styles/globals.css"
import type { AppProps } from "next/app"
import { AuthProvider } from "../lib/auth"
import GDPRCompliance from "../components/GDPRCompliance"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <GDPRCompliance />
    </AuthProvider>
  )
}
