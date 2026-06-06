import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import GalleryPreview from "../components/GalleryPreview";
import Services from "../components/Services";
import FeaturedProjects from "../components/FeaturedProjects";
import Stats from "../components/Stats";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Stats />
        <Services />
        <FeaturedProjects />
        <GalleryPreview />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default Home;
