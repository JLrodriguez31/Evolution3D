import Spline from "@splinetool/react-spline";
import Navbar from "../../components/navbar/Navbar";
import logo from "/images/logo2.png";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/routes";
import { useAuth } from "@/auth/useAuth";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const ctaLabel = user ? "START EXPLORATION" : "ENTER WITHOUT REGISTERING";

  return (
    <main className="w-full h-screen overflow-hidden relative bg-black">
      <div className="pointer-events-auto relative pb-5 z-30">
        <Navbar
          aStyles="cursor-pointer hidden text-transparent bg-gradient-to-r from-blue-400/80 to-purple-800 bg-clip-text"
          variantButton="primary"
          variantButton2="secondary"
          logo={logo}
          borderColor="border-white/0"
        />
      </div>

      <div
        className={`w-full h-full transition-opacity duration-800 ease-out"
        }`}
        style={{ clipPath: "inset(0 0 60px 0)" }}
      >
        <Spline scene="https://prod.spline.design/Pud25w0I37RAD7Gq/scene.splinecode" />
      </div>
      <div
        className={`absolute xl:left-200 2xl:right-140 top-47 xl:top-52 pointer-events-auto h-1/2 w-90 z-20 transition-opacity duration-800 ease-out"
        } [clip-path:inset(20px_0_57px_0)] sm:[clip-path:inset(60px_0_65px_0)] xl:[clip-path:inset(56px_100px_57px_100px)]`}
      >
        <Spline scene="https://prod.spline.design/LKd9I8zeBvzQ1QK9/scene.splinecode" />
      </div>

      <div className="absolute bottom-6 right-6 z-40">
        <button
          onClick={() => navigate(PATHS.timeline)}
          className="px-5 py-2.5 rounded-full text-[12px] tracking-wide uppercase bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium shadow-lg shadow-purple-900/40 border border-white/10 hover:from-purple-500 hover:to-blue-500 transition"
        >
          {ctaLabel}
        </button>
      </div>
    </main>
  );
}
