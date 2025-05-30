import { Input } from "@/components/ui/input";

export default function CheckslistData({ data }) {
  console.log("data", data);
  return (
    <div>
      <h1>CheckslistData</h1>
      <input type="text" value={data?.name} />
      <div>
        <label>Kilometraje</label>
        <Input type="number" placeholder="Ej. 10000" />
      </div>
      <div>
        <label>Horometro</label>
        <Input type="number" placeholder="Ej. 10000" />
      </div>
    </div>
  );
}
