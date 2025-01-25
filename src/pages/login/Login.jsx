import { useEffect, useRef, useState } from "react";


import { useNavigate } from "react-router-dom";
import IconLoader from "@/icons/IconLoader";
import { loginRequest } from "@/lib/api";
import { useAuthStore } from "@/store/AuthStore";
import { Button } from "@/components/ui/button";

export default function PageLogin() {
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
    const initialData = { dni: combinedValue };
    try {
      const success = await loginRequest(initialData);
    
      if (success.data.status === true) {
        setToken(success.data.token);
        // Cookies.set("userData", JSON.stringify(success.data.user));
        setProfile(success.data.user);
        navigate('/');
      } else {
        resetForm();
        setLoading(false);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error :", error);
      resetForm();
      setLoading(false);
    } finally {
    }
  };

  useEffect(() => {
    if (areAllCodesEntered()) {
      handleSubmit();
    }
  }, [codes]);

  return (
    <>
      <section className="h-dvh flex flex-col justify-center items-center bg-[#121316]">
        <form
          className="flex flex-col justify-center items-center gap-2 max-w-[400px]"
          action=""
          onSubmit={handleSubmit}
          style={{
            userSelect: loading ? "none" : "auto",
            pointerEvents: loading ? "none" : "auto",
          }}
        >
          <img className="w-24 h-24" src="/src/assets/logo-white.svg" alt="" />
          <font className="text-[#ffffff66] text-xs text-center font-normal mt-2">
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
                  className="w-9 md:w-10 h-10 md:h-11 p-0 text-center text-lg text-zinc-400 rounded-md bg-zinc-800 border border-zinc-800 focus:border-primary"
                  required
                />
              ))}
            </div>
          </div>
          <div></div>
          <Button
            type="submit"
            // className="bg-[#ffffff10] h-9 text-xs rounded-xl text-[#ffffff66] max-w-[200px] w-full flex justify-center items-center gap-1.5 hover:bg-primary hover:text-zinc-200"
            disabled={loading || codes.join("").length !== 8}
          >
            {loading ? (
              <>
                <IconLoader className="w-4 h-4 text-[#ffffff10] fill-primary animate-spin" />
                Cargando...
              </>
            ) : (
              "Ingresar"
            )}
          </Button>
        </form>
      </section>
      <div
        className={` absolute top-0 left-0  error-login ${
          showError ? "error-visible" : "error-hidden"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z"
            fill="#FD5B5D"
            fillOpacity="0.18"
          ></path>
          <path
            d="M8 5V9"
            stroke="#FD5B5D"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M8 11H8.01"
            stroke="#FD5B5D"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        <h4>Código inválido, inténtelo de nuevo</h4>
      </div>
    </>
  );
}

