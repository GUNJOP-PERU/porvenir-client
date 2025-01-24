import { useGlobalStore } from "@/store/GlobalStore";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Delete, Edit } from "lucide-react";

function CardItems({ items }) {
  const handleDelete = (id) => {
    // Aquí puedes llamar a una función del store o API para eliminar el ítem
    console.log(`Eliminar ítem con ID: ${id}`);
    // Ejemplo de integración con un store:
    // useGlobalStore.getState().deleteItem(id);
  };

  return (
    <div className="flex-1 overflow-auto w-full">
      <div className="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-zinc-100 shadow-sm rounded-lg p-6 hover:border-primary"
          >
            <h1>{item.title}</h1>
            <h5>{item.description}</h5>
            <h3>Total: {item.total}</h3>
            <h3>Labor: {item.numberRows} utilizados</h3>

            <div className="flex gap-2">
              <Button
                className="w-fit"
                variant="destructive"
                onClick={() => handleDelete(item.id)}
              >
                <Delete className="w-5 h-5 text-white" />
              </Button>
              <Link to={`/edit/${item.id}`}>
                <Button className="w-fit" variant="secondary">
                  <Edit className="w-5 h-5 text-zinc-400" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardItems;
