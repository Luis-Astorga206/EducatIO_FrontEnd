import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import claseService from '../services/claseService';
import NuevaClase from '../components/NuevaClase';

const Dashboard = () => {
    const [clases, setClases] = useState([]);
    const { auth } = useContext(AuthContext);
    const [cargando, setCargando] = useState(true);
    const [verModal, setVerModal] = useState(false);
    const navigate = useNavigate();

    // Función para cargar las clases desde el backend
    const cargarClases = async () => {
        try {
            setCargando(true);
            const data = await claseService.obtenerMisClases();
            setClases(data);
        } catch (error) {
            console.error("Error al cargar clases:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarClases();
    }, []);

    const colores = ['#1a73e8', '#d93025', '#1e8e3e', '#f29900', '#9c27b0'];


    // Función que se dispara cuando el modal envía los datos
    const handleGuardarClase = async (datos) => {
        try {
            await claseService.crear(datos);
            setVerModal(false); // Cerrar modal tras éxito
            cargarClases(); // Refrescar la lista
        } catch (error) {
            alert("Error al crear la clase");
        }
    };

    const abrirConversaciones = (clase) => {
        navigate(`/dashboard/clase/${clase.Codigo_PK}/conversaciones`, { state: { clase } });
    };

    const abrirAsistencias = (clase) => {
        // Si el usuario es docente (rol 3), ver asistencias de los alumnos
        if (auth?.rol === 3) {
            navigate(`/dashboard/clase/${clase.Codigo_PK}/asistencias-alumnos`, { state: { clase } });
        } else {
            // Si es estudiante, ver sus propias asistencias
            navigate(`/dashboard/clase/${clase.Codigo_PK}/mis-asistencias`, { state: { clase } });
        }
    };

    if (cargando) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
            
            {/* Cabecera del Panel */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#3c4043' }}>Panel de Clases</h2>
                
                {/* Botón para abrir el Modal (Solo Admin o Docente) */}
                {(auth?.rol === 1 || auth?.rol === 3) && (
                    <button 
                        className="btn btn-primary shadow-sm px-4"
                        onClick={() => setVerModal(true)}
                    >
                        <i className="bi bi-plus-lg me-2"></i>Nueva Clase
                    </button>
                )}
            </div>

            {/* Renderizado del Modal */}
            {verModal && (
                <NuevaClase 
                    auth={auth} 
                    alCerrar={() => setVerModal(false)} 
                    alGuardar={handleGuardarClase} 
                />
            )}

            {/* Listado de Tarjetas (El MAP) */}
            <div className="row">
                {clases.length > 0 ? (
                    clases.map((clase, index) => (
                        <div className="col-md-4 col-lg-3 mb-4" key={clase.Codigo_PK}>
                            <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                
                                {/* Banner de Color */}
                                <div style={{ 
                                    backgroundColor: colores[index % colores.length], 
                                    height: '110px', 
                                    padding: '20px',
                                    color: 'white'
                                }}>
                                    <h4 className="mb-1 text-truncate" style={{ fontWeight: '600' }}>
                                        {clase.NombreC}
                                    </h4>
                                    <p className="small mb-0" style={{ color: '#ffffff', opacity: '0.9', fontWeight: '500' }}>
                                        Código: {clase.Codigo_PK}
                                    </p>
                                </div>
                                
                                {/* Cuerpo de la tarjeta */}
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center">
                                            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center border me-2" 
                                                 style={{ width: '40px', height: '40px', fontWeight: 'bold', color: '#5f6368' }}>
                                                {clase.NombreCompletoDocente ? clase.NombreCompletoDocente.charAt(0) : '?'}
                                            </div>
                                            <div className="d-flex flex-column">
                                                <span className="text-dark fw-bold" style={{ fontSize: '0.9rem' }}>
                                                    {clase.NombreCompletoDocente || 'Sin docente asignado'}
                                                </span>
                                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Profesor Titular</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Botones de acción */}
                                    <div className="mt-auto pt-3 border-top d-flex justify-content-between">
                                        <button className="btn btn-light btn-sm text-primary fw-bold border-0" onClick={() => abrirAsistencias(clase)}>
                                            <i className="bi bi-calendar2-check me-1"></i> Asistencias
                                        </button>
                                        <button className="btn btn-primary btn-sm px-3 shadow-sm" onClick={() => abrirConversaciones(clase)}>
                                            Abrir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center w-100 py-5">
                        <div className="bg-white p-5 rounded shadow-sm border">
                            <i className="bi bi-journal-x display-4 text-muted"></i>
                            <p className="text-muted mt-3 fs-5">No hay clases vinculadas a tu cuenta.</p>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Dashboard;