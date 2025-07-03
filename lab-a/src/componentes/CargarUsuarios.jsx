import { useEffect, useState } from "react";

function CargarUsuarios() {
  // Definición de estados:
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para cargar usuarios desde una API
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users ")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener datos");
        return res.json();
      })
      .then((data) => setUsuarios(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Retorno de los estados
  return { usuarios, loading, error };
}

export default CargarUsuarios;
