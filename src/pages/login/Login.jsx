import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import IconLoader from "@/icons/IconLoader";
import { loginRequest } from "@/api/api";
import { useAuthStore } from "@/store/AuthStore";
import { Button } from "@/components/ui/button";
import IconSubmit from "@/icons/IconSubmit";

export default function Login() {
  const setToken = useAuthStore.getState().setToken;
  const setProfile = useAuthStore.getState().setProfile;

  const [loading, setLoading] = useState(false);
  const [codes, setCodes] = useState(Array(8).fill(""));
  const [showError, setShowError] = useState(false);
  const inputReferences = useRef([]);
  const navigate = useNavigate();

  const areAllCodesEntered = () => {
    return codes.every((code) => code !== "");
  };

  const handleInputChange = (index, event) => {
    const value = event.target.value;
    const isNumeric = /^\d*$/.test(value);
    if (isNumeric) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      if (value && inputReferences.current[index + 1]) {
        inputReferences.current[index + 1].focus();
      }
    }
  };

  const handleInputKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !codes[index] &&
      inputReferences.current[index - 1]
    ) {
      inputReferences.current[index - 1].focus();
    }
  };

  const resetForm = () => {
    inputReferences.current[0].focus();
    setCodes(Array(8).fill(""));
  };

  const handleSubmit = async () => {
    inputReferences.current[codes.length - 1].blur();
    setLoading(true);

    const combinedValue = codes.join("");
    const initialData = { code: combinedValue };
    try {
      const response = await loginRequest(initialData);
     
      const token = response.data.token;
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
      );

      const userLogued = {
        user: {
          _id: decodedPayload.id,
          name: decodedPayload.name,
          rol: decodedPayload.cargo,
        },
        token,
      };
     

      if (!userLogued.user.rol || !["Admin", "SuperAdmin"].includes(userLogued.user.rol)) {
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
        setLoading(false);
        resetForm();
        console.error("Acceso denegado: No tienes permisos.");
        return;
      }
      setToken(userLogued.token);
      setProfile(userLogued.user);
      navigate("/");
    } catch (error) {
      resetForm();
      setLoading(false);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      console.error("Error :", error);      
    }
    
  };

  useEffect(() => {
    if (areAllCodesEntered()) {
      handleSubmit();
    }
  }, [codes]);

  return (
    <>
      <section className="h-dvh flex flex-col justify-center items-center bg-[#000000] relative bg-cover bg-center bg-[url('./backLogin.png')]">
        <form
          className="flex flex-col justify-center items-center gap-2 max-w-[400px]"
          action=""
          onSubmit={handleSubmit}
          style={{
            userSelect: loading ? "none" : "auto",
            pointerEvents: loading ? "none" : "auto",
          }}
        >
          <img className="h-10" src="./logo-white.svg" alt="" />
          <font className="text-zinc-300 text-xs leading-4 text-center mt-3">
            Ingrese su clave de{" "}
            <strong className="text-[##ffffff99]">inicio de sesión</strong> para
            acceder
            <br />
            Recuerde no compartirla con nadie.
          </font>
          <div className="flex flex-col my-3">
            <div className="flex gap-1">
              {codes.map((code, index) => (
                <input
                  key={index}
                  type="password"
                  name="code"
                  value={code}
                  maxLength={1}
                  onChange={(event) => handleInputChange(index, event)}
                  onKeyDown={(event) => handleInputKeyDown(index, event)}
                  ref={(ref) => (inputReferences.current[index] = ref)}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="w-10 md:w-10 h-11 md:h-11 p-0 text-center text-2xl text-zinc-400 rounded-[10px] bg-[#1D1D1D] border border-[#1D1D1D] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/20 focus:shadow-primary  transition ease-in-out duration-300"
                  required
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="bg-[#ffffff10] h-9 text-xs rounded-xl text-[#ffffff66] max-w-[200px] w-full flex justify-center items-center gap-1.5 hover:bg-primary hover:text-zinc-200"
            disabled={loading || codes.join("").length !== 8}
          >
            {loading ? (
              <>
                <IconLoader className="w-4 h-4 text-[#ffffff10] fill-primary animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                Iniciar sesión
                <IconSubmit className="h-5 w-5 transition-colors fill-zinc-500" />
              </>
            )}
          </Button>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary mt-8">
            <font className="vertical-align: inherit;">
              <font className="vertical-align: inherit;">
                Al hacer clic en continuar, usted acepta nuestro{" "}
              </font>
              <a href="#">
                <font className="vertical-align: inherit;">
                  <font className="vertical-align: inherit;">
                    Términos de Servicio
                  </font>
                </font>
              </a>{" "}
              <font className="vertical-align: inherit;">
                <font className="vertical-align: inherit;">y </font>
              </font>
              <a href="#">
                <font className="vertical-align: inherit;">
                  <font className="vertical-align: inherit;">
                    Política de Privacidad
                  </font>
                </font>
              </a>
            </font>
          </div>
        </form>
       
      </section>
    </>
  );
}
