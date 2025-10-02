import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import CatCard from "./CatCard";
import Header from "./Header";
import Buttons from "./Buttons";
import api from "./api";

export default function App() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialCats, setInitialCats] = useState([]);

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/profiles");
      const catsData = res.data.cats;
      await preloadImages(catsData);
      console.log(catsData);
      setCats(catsData);
      setInitialCats(catsData); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const preloadImages = (catsArray) =>
    Promise.all(
      catsArray.map(
        (cat) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = cat.img;
            img.onload = resolve;
            img.onerror = resolve;
          })
      )
    );

  const handleSwipe = async (direction, catId) => {
    console.log(`Swiped ${direction} on cat ${catId}`);

    setCats((prev) => {
      const remaining = prev.filter((cat) => cat.id !== catId);

      if (remaining.length === 0) {
        reloadCats();
      }

      return remaining;
    });
  };

  const reloadCats = async () => {
    try {
      setLoading(true);
      await api.post("/api/profiles/refresh");
      const res = await api.get("/api/profiles");
      const newCats = res.data.cats;
      await preloadImages(newCats);

      setCats((prev) => [...prev, ...newCats]);
      setInitialCats((prev) => [...prev, ...newCats]);
    } catch (err) {
      console.error("Error recargando el mazo:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-300 to-pink-300">

      <Header />

      <div className="relative w-[90vw] max-w-md h-[70vh] flex items-center justify-center">
        {loading && (
          <div className="border-4 border-purple-300 border-t-purple-700 rounded-full w-16 h-16 animate-spin"></div>
        )}

        {!loading && (
          <AnimatePresence initial={false}>
            {cats.map((cat, i) => (
              <CatCard
                key={cat.id}
                cat={cat}
                onSwipe={handleSwipe}
                style={{ zIndex: cats.length - i }}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      <Buttons cats={cats} handleSwipe={handleSwipe} />
    </div>
  );
}
