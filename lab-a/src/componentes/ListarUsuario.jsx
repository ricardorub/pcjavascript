import CargarUsuarios from "./CargarUsuarios";

const ListarUsuarios = () => {
  // Obtención de los estados del hook personalizado CargarUsuarios
  const { usuarios, loading, error } = CargarUsuarios();

  // Manejo del estado de carga
  if (loading) return <p>Cargando usuarios...</p>;

  // Manejo de errores
  if (error) return <p>Error: {error}</p>;

  // Renderización de la lista de usuarios
  return (
    <ul className="lista-usuarios">
      {usuarios.map((usuario) => (
        <li key={usuario.id}>{usuario.name}</li>
      ))}
    </ul>
  );
};

export default ListarUsuarios;
