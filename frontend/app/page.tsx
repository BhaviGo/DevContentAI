import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Generator from "./components/Generator";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <Navbar />
      <Hero />
      <Generator />
    </div>
  );
}