import { useEffect, useState } from "react";

export default function LastModified({ file }) {
  const [lastModified, setLastModified] = useState("");

  useEffect(() => {
    async function fetchLastModified() {
      const res = await fetch(`/api/last-modified?file=${file}`);
      const data = await res.json();
      setLastModified(data.lastModified || "");
    }
    fetchLastModified();
  }, [file]);

  return (
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
      Última actualización:{" "}
      {lastModified
        ? new Date(lastModified).toLocaleDateString("es-ES")
        : "N/A"}
    </p>
  );
}
