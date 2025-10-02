import { motion } from "framer-motion";

export default function CatCard({ cat, onSwipe }) {
    return (
        <motion.div
            className="absolute w-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={(e, info) => {
                if (info.offset.x > 100) onSwipe("right", cat.id);
                else if (info.offset.x < -100) onSwipe("left", cat.id);
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            whileTap={{ scale: 1.05 }}
        >
            <div className="card bg-base-100 max-w-md shadow-sm h-[480px] flex flex-col rounded-2xl">
                <figure className="h-64 w-full">
                    <img
                        src={cat.img}
                        alt={cat.name}
                        className="object-cover h-64 w-full"
                        onError={(e) =>
                        (e.target.src =
                            "https://via.placeholder.com/400x300?text=Cat+Image")
                        }
                    />
                </figure>

                <div className="card-body bg-pink-200 flex-1 overflow-hidden rounded-b-2xl">
                    <h2 className="card-title text-purple-900">
                        {cat.name} <div className="badge badge-secondary">{cat.age} años</div>
                    </h2>
                    <p className="line-clamp-3 text-purple-900">{cat.bio}</p>

                    <div className="card-actions justify-start flex-wrap gap-1 mt-auto">
                        <div className="badge badge-outline text-sky-800">{cat.breed}</div>
                        <div className="badge badge-outline text-amber-800">{cat.personality}</div>
                        {cat.hobbies.map((hobby, i) => (
                            <div key={i} className="badge badge-outline text-fuchsia-900">
                                {hobby}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </motion.div>
    );
}
