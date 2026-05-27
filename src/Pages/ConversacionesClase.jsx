import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import conversacionService from '../services/conversacionService';

const ConversacionesClase = () => {
    const { codigo } = useParams();
    const location = useLocation();
    const claseState = location.state?.clase;
    const [conversaciones, setConversaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarConversaciones = async () => {
            try {
                setCargando(true);
                const data = await conversacionService.obtenerPorClase(claseState?.Codigo_PK || codigo);
                setConversaciones(data || []);
            } catch (err) {
                console.error('Error al cargar conversaciones:', err);
                setError('No se pudieron cargar las conversaciones. Intenta de nuevo más tarde.');
            } finally {
                setCargando(false);
            }
        };

        cargarConversaciones();
    }, [codigo, claseState]);

    return (
        <div style={{ minHeight: '100vh', padding: '20px' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold" style={{ color: '#3c4043' }}>Conversaciones</h2>
                    <p className="text-muted mb-0">
                        {claseState?.NombreC
                            ? `Clase: ${claseState.NombreC} · Código ${claseState.Codigo_PK}`
                            : `Clase: ${codigo}`}
                    </p>
                </div>
                <button className="btn btn-primary shadow-sm px-4" style={{ borderRadius: '10px' }}>
                    <i className="bi bi-plus-lg me-2"></i>Crear conversación
                </button>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', backgroundColor: '#ffffff' }}>
                <div className="card-body p-4">
                    {cargando ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '220px' }}>
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-warning mb-0" role="alert">
                            {error}
                        </div>
                    ) : conversaciones.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-chat-left-text display-4 text-muted"></i>
                            <p className="mt-4 mb-1 fs-5 text-muted">Actualmente no perteneces a ninguna conversación.</p>
                            <p className="text-secondary">Cuando tengas conversaciones disponibles, las verás aquí.</p>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {conversaciones.map((conv, index) => (
                                <div className="col-12" key={conv.id || index}>
                                    <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                                        <div className="card-body d-flex flex-column flex-md-row align-items-start justify-content-between gap-3">
                                            <div>
                                                <h6 className="fw-bold mb-2">{conv.titulo || `Conversación ${index + 1}`}</h6>
                                                <p className="mb-2 text-secondary">{conv.ultimoMensaje || 'Sin mensajes recientes'}</p>
                                                <small className="text-muted">{conv.fechaUltimoMensaje || conv.fecha || 'Sin actividad reciente'}</small>
                                            </div>
                                            <div className="text-md-end">
                                                <span className="badge bg-primary py-2 px-3" style={{ fontSize: '0.82rem' }}>
                                                    {conv.mensajes ?? conv.cantidadMensajes ?? 0} mensajes
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConversacionesClase;
