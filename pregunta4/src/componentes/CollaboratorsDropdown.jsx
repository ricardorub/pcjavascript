// src/componentes/CollaboratorsDropdown.jsx
import React, { useState, useEffect } from 'react'; // Keep this line

function CollaboratorsDropdown() {
    const [collaborators, setCollaborators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/collaborators');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCollaborators(data);
            } catch (error) {
                console.error("Error fetching collaborators:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollaborators();
    }, []);

    if (loading) {
        return <div>Cargando colaboradores...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <label htmlFor="collaborator-select">Selecciona un colaborador:</label>
            <select id="collaborator-select">
                <option value="">-- Por favor, selecciona --</option>
                {collaborators.map((collaborator) => (
                    <option key={collaborator.id} value={collaborator.id}>
                        {collaborator.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default CollaboratorsDropdown;