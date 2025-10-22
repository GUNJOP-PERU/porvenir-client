import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import IconLoader from "@/icons/IconLoader";
import { loginRequest } from "@/api/api";
import { useAuthStore } from "@/store/AuthStore";
import { Button } from "@/components/ui/button";
import IconSubmit from "@/icons/IconSubmit";
// Formik
import { Formik } from 'formik';

export default function Login() {
  const setToken = useAuthStore.getState().setToken;
  const setProfile = useAuthStore.getState().setProfile;

  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (code, password) => {
    setLoading(true);

    const initialData = { code, password };
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
          type: decodedPayload.type,
        },
        token,
      };

      if (!userLogued.user.rol || !["Admin", "SuperAdmin", "Web"].includes(userLogued.user.rol)) {
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
        setLoading(false);
        console.error("Acceso denegado: No tienes permisos.");
        return;
      }
      setToken(userLogued.token);
      setProfile(userLogued.user);
      navigate("/");
    } catch (error) {
      setLoading(false);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      console.error("Error :", error);      
    }
  };

  return (
    <>
      <section className="h-dvh flex flex-col justify-center items-center bg-[#000000] relative bg-cover bg-center bg-[url('./backLogin.png')]">
        <div
          className="flex flex-col justify-center items-center gap-2 max-w-[400px]"
        >
          <div className="flex flex-col">
            <img className="h-10" src="./logo-white.svg" alt="" />
            <font className="text-zinc-300 text-xs leading-4 text-center mt-3">
              Ingrese su clave de{" "}
              <strong className="text-[##ffffff99]">inicio de sesión</strong> para
              acceder
              <br />
              Recuerde no compartirla con nadie.
            </font>
          </div>
          <Formik
            initialValues={{code: "", password: ""}}
            onSubmit={(values) => handleSubmit(values.code, values.password)}
          >
            {({handleSubmit, values, handleChange, handleBlur}) => (
              <form onSubmit={handleSubmit} className="flex flex-col gap-1 mt-4">
                <label className="flex flex-col text-white font-semibold text-[11px] mb-2 gap-1">
                  Usuario :
                  <input
                    type="text"
                    name="code"
                    className="w-250 h-8 py-1 px-3 text-left text-sm text-zinc-400 rounded-[10px] bg-[#1D1D1D] border border-[#1D1D1D] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/20 focus:shadow-primary  transition ease-in-out duration-300"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.code}
                  />
                </label>
                <label className="flex flex-col text-white font-semibold text-[11px] mb-2 gap-1">
                  Contraseña :
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-250 h-8 py-1 px-3 text-left text-sm text-zinc-400 rounded-[10px] bg-[#1D1D1D] border border-[#1D1D1D] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/20 focus:shadow-primary  transition ease-in-out duration-300"
                    value={values.password}
                  />
                </label>
                <Button
                  type="submit"
                  className="bg-[#ffffff10] mx-auto h-9 text-xs rounded-xl text-[#ffffff66] max-w-[200px] w-full flex justify-center items-center gap-1.5 hover:bg-primary hover:text-zinc-200"
                  disabled={loading}
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
              </form>
            )}
          </Formik>
        </div>

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
      </section>
    </>
  );
}
