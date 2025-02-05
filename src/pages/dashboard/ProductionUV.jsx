import CardItem from "@/components/Dashboard/CardItem";
import CardClock from "@/components/Dashboard/CardClock";

const cardData = [
  {
    value: "4,657",
    title: "Mineral Tajo",
    change: "2.56 - 0.91% esta semana",
    valueColor: "text-blue-500",
  },
  {
    value: "896",
    title: "Mineral Avance",
    change: "1.12 + 0.45% esta semana",
    valueColor: "text-red-500",
  },
  {
    value: "7.3h",
    title: "Horas Productivas",
    change: "- 0.49% debajo",
    valueColor: "text-green-500",
  },
  {
    value: "4.2h",
    title: "Parada Planificada",
    change: "- 0.49% debajo",
    valueColor: "text-yellow-700",
  },
  {
    value: "0.3h",
    title: "Parada no planificada",
    change: "- 0.49% debajo",
    valueColor: "text-purple-700",
  },
  {
    value: "0.5h",
    title: "Parada Improductiva",
    change: "- 0.49% debajo",
    valueColor: "text-pink-700",
  },
  {
    value: "91.6%",
    title: "Disnponibilidad",
    change: "- 0.49% debajo",
    valueColor: "text-black-700",
  },
  {
    value: "85.0%",
    title: "Utilización",
    change: "- 0.49% debajo",
    valueColor: "text-black-700",
  },
];

function ProductionUV() {
  return (
    <>
      <div className="w-full flex flex-wrap justify-between px-6 py-4 bg-zinc-100/50 border border-zinc-100 rounded-xl gap-6">
        <div>CardChart</div>
        <CardClock />
        {cardData.map((card, index) => (
          <CardItem
            key={index}
            value={card.value}
            title={card.title}
            change={card.change}
            valueColor={card.valueColor}
          />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-4 ">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-red-50/50 md:min-h-min" />
      </div>
    </>
  );
}

export default ProductionUV;
