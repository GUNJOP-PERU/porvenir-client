

const initialStepsData = [
    {
      title: "Datos Iniciales",
      description:
        "Por favor, especifique la zona e ingrese el horómetro y kilometraje inicial",
      type: "counter", // Indica que este paso es un contador (horómetro, kilometraje)
      content: [
        { title: "Horómetro", unit: "hs", value: 153 },
        { title: "Kilometraje", unit: "km", value: 1052 },
      ],
    },
    {
      title: "1. Seguridad y Medio Ambiente.",
      description: "Especifique las condiciones según corresponda",
      type: "items", // Este paso es para preguntas de items
      content: [
        {
          text: "¿Se encuentran operativas las luces delanteras?",
          state: CheckListState.ANY,
          isCritical: true,
        },
        {
          text: "¿Las luces de retroceso se encuentran operativas?",
          state: CheckListState.ANY,
          isCritical: true,
        },
        {
          text: "¿La alarma de retroceso se encuentra operativa?",
          state: CheckListState.ANY,
          isCritical: true,
        },
        {
          text: "¿La Bocina (claxon) se encuentra operativa?",
          state: CheckListState.ANY,
          isCritical: true,
        },
        {
          text: "¿El estado del cinturón de seguridad está en buenas condiciones (operativo)?",
          state: CheckListState.ANY,
          isCritical: true,
        },
        {
          text: "¿Las cámaras del equipo se encuentran operativas?",
          state: CheckListState.ANY,
          isCritical: true,
        },
        {
          text: "¿Se encuentra operativa la traba de dirección?",
          state: CheckListState.ANY,
          isCritical: true,
        },
        {
          text: "¿El extintor se encuentra operativo?",
          state: CheckListState.ANY,
          isCritical: true,
        },
        {
          text: "¿Se encuentra operativo el ANSUL?",
          state: CheckListState.ANY,
          isCritical: true,
        },
        {
          text: "¿Se encuentra operativo el sistema anticolisión CAS (display)?",
          state: CheckListState.ANY,
          isCritical: true,
        },
        {
          text: "¿La batería y bornes se encuentran en buen estado?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentran materiales inflamables en el equipo?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra en buen estado la cuchara?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Presenta grietas o rajaduras en la parte estructural del equipo?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Las articulaciones están en correcto estado?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra en buen estado el asiento?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentran en buen estado los disyuntores o fusibles térmicos activos?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Existen fugas en todas las mangueras y conexiones?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿El nivel de combustible está por encima de 1/4 de tanque?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra el nivel de aceite hidráulico por encima del mínimo?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra el nivel de aceite del motor por encima del mínimo?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra el nivel de refrigerante del motor por encima del mínimo?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra el nivel de aceite de transmisión por encima del mínimo?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿El filtro de combustibles y separadores de agua presentan fugas?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra en buen estado el filtro de aire e indicador?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentran en buen estado el radiador o enfriador y nivel de refrigerante?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra en buen estado el interruptor de la batería?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿El asiento del operador se encuentra en buen estado?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿La temperatura del motor son las normales?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra en buen estado el tablero de instrumentos en condiciones de funcionamiento?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentran en buen estado las paradas de emergencia?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra en buen estado la cabina, puerta de cabina, parabrisas?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra en buen estado la cadena de línea a tierra?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentran en buen estado los peldaños?",
          state: CheckListState.ANY,
          isCritical: false,
        },
      ],
    },
    {
      title: "2. Motor Operativo",
      description: "Por favor, especifique las condiciones del motor.",
      type: "items", // Este paso es para preguntas de items
      content: [
        {
          text: "¿El freno servicio y de parqueo se encuentran en buen estado?",
          state: CheckListState.ANY,
          isCritical: true,
        },
        {
          text: "¿Se visualiza fuga de aceite del motor?",
          state: CheckListState.ANY,
          isCritical: true,
        },
        {
          text: "¿Se visualizan fugas de fluidos hidráulicos, grasas y refrigerante?",
          state: CheckListState.ANY,
          isCritical: true,
        },
        {
          text: "¿Se encuentran en buen estado los controles de elevación del implementos?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra en buen estado el control de dirección?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra en buen estado la del jos tick y pedales?",
          state: CheckListState.ANY,
          isCritical: false,
        },
      ],
    },
    {
      title: "3. Componentes",
      description: "Por favor, especifique las condiciones de los componentes.",
      type: "items", // Este paso es para preguntas de items
      content: [
        {
          text: "¿Se encuentra en buen estado el motor de combustión (Diesel)?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra en buen estado el convertidor?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra en buen estado la caja de transmisión?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentran en buen estado los diferenciales delantero y posterior?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra en buen estado los mandos finales delanteros?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentra en buen estado los mandos finales posteriores?",
          state: CheckListState.ANY,
          isCritical: false,
        },
      ],
    },
    {
      title: "4. Neumáticos",
      description: "Por favor, especifique las condiciones de los neumáticos.",
      type: "items", // Este paso es para preguntas de items
      content: [
        {
          text: "¿Las ruedas y neumáticos presentan exceso desgaste?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Tiene cortes profundos en los neumáticos?",
          state: CheckListState.ANY,
          isCritical: true,
        },
        {
          text: "¿La banda de rodamiento de cada neumático se encuentra en buen estado?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Existe fuga de aceite en los ejes de las ruedas?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Cuenta con los espárragos completos?",
          state: CheckListState.ANY,
          isCritical: false,
        },
      ],
    },
    {
      title: "5. Engrase",
      description: "Por favor, especifique las condiciones del engrase.",
      type: "items", // Este paso es para preguntas de items
      content: [
        {
          text: "¿Se encuentran los pines y bocinas de cuchara?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentran los pines y bocinas de boom?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentran los pines y bocinas de articulación central?",
          state: CheckListState.ANY,
          isCritical: false,
        },
        {
          text: "¿Se encuentran los pines y bocinas de dirección?",
          state: CheckListState.ANY,
          isCritical: false,
        },
      ],
    },
  ];
export const CardItems = ({ }) => {
  

  return (
    <div>
        Card
    </div>
  );
};
