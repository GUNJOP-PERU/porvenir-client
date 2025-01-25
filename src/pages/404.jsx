// import IconReturn from "@/src/icons/IconReturn";
// import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";

export default function PageError() {
//   const router = useRouter();
  return (
    <>
      <div className="absolute inset-0 m-auto max-w-[240px] flex flex-col items-center justify-center gap-2 text-center">
        <img src="/src/assets/error.svg" alt="illustration" className="w-40" />
        <span className="text-lg font-semibold leading-5">
          Lo sentimos, no se puede encontrar la página
        </span>
        <p className="text-xs text-zinc-500 mb-4">
          La página que estabas buscando parece haber sido movida, eliminada o
          no existe.
        </p>
        <Button
          
        //   onClick={() => router.push("/")}
        >
          {/* <IconReturn className="h-5 w-5 fill-zinc-50" />*/} Regresar al Inicio 
        </Button>
      </div>
    </>
  );
}
