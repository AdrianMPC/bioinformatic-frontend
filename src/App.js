import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [nombre, setNombre] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [files, setFiles] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("institucion", institucion);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const response = await axios.post("http://localhost:8000/upload", formData);
      const { files: filePaths, task_id } = response.data;
      setTaskId(task_id);

      await axios.post("http://localhost:8000/analyze", {
        file_paths: filePaths,
        task_id: task_id,
        nombre: nombre,
        institucion: institucion
      });

      setMensaje("Análisis iniciado correctamente.");
    } catch (error) {
      console.error("Error al subir o analizar archivos:", error);
      setMensaje("Error en el análisis.");
    }
  };

  const handleDownload = () => {
    if (taskId) {
      window.open(`http://localhost:8000/report/${taskId}`, "_blank");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>PPC Tracker - Subida de Archivos</h2>
      <form onSubmit={handleUpload}>
        <div>
          <label>Nombre: </label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Institución: </label>
          <input type="text" value={institucion} onChange={(e) => setInstitucion(e.target.value)} required />
        </div>
        <div>
          <label>Archivos GenBank: </label>
          <input type="file" multiple onChange={(e) => setFiles(e.target.files)} required />
        </div>
        <button type="submit">Subir y Analizar</button>
      </form>

      <div style={{ marginTop: "20px" }}>
        <p>{mensaje}</p>
        {taskId && <button onClick={handleDownload}>Descargar Reporte</button>}
      </div>
    </div>
  );
}

export default App;
