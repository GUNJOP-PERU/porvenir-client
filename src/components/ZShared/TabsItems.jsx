/* eslint-disable react/prop-types */
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const TabsItems = ({ items, activeTab, onSelect, countByTab = {} }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    // El margen de error de 1px ayuda con disparidades de redondeo en navegadores
    setShowLeftArrow(scrollLeft > 1);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Check inicial
    checkScroll();

    // Resize observer para cuando cambia el tamaño de la ventana o del contenedor
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(el);

    el.addEventListener("scroll", checkScroll);
    return () => {
      resizeObserver.disconnect();
      el.removeEventListener("scroll", checkScroll);
    };
  }, [checkScroll, items]);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = dir === "left" ? -150 : 150;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="w-full grid grid-cols-[auto_1fr_auto] items-center gap-0 overflow-hidden relative group/tabs">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => scroll("left")}
        disabled={!showLeftArrow}
        className={cn(
          "size-7 flex items-center justify-center rounded-md bg-primary/10 text-primary transition-all shrink-0 cursor-pointer border border-primary/5",
          !showLeftArrow
            ? "opacity-0 invisible pointer-events-none"
            : "opacity-100 visible hover:bg-primary/20",
        )}
      >
        <ChevronLeft className="size-4" />
      </button>

      <div
        ref={scrollRef}
        className="min-w-0 flex gap-0.5 overflow-hidden scroll-smooth items-center py-0.5 px-1 no-scrollbar"
      >
        {items.length === 0 ? (
          <span className="text-gray-400 italic text-xs">Sin datos</span>
        ) : (
          items.map((loc) => {
            const isSelected = activeTab === loc;
            const count = countByTab[loc];
            return (
              <button
                key={loc}
                type="button"
                onClick={() => onSelect(loc)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-lg whitespace-nowrap shrink-0 select-none transition-all border text-xs h-7",
                  isSelected
                    ? "bg-primary border-primary text-white shadow-sm font-semibold"
                    : "bg-white border-zinc-100 text-zinc-500 hover:bg-zinc-50 hover:border-zinc-200 hover:text-primary font-semibold",
                )}
              >
                <span className="leading-none capitalize">{loc}</span>
                {count != null && (
                  <span
                    className={cn(
                      "text-[10px] font-bold leading-none px-1.5 py-0.5 rounded-full",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-zinc-100 text-zinc-400",
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => scroll("right")}
        disabled={!showRightArrow}
        className={cn(
          "size-7 flex items-center justify-center rounded-md bg-primary/10 text-primary transition-all shrink-0 cursor-pointer border border-primary/5",
          !showRightArrow
            ? "opacity-0 invisible pointer-events-none"
            : "opacity-100 visible hover:bg-primary/20",
        )}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
};
