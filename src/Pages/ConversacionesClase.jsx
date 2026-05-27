import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import conversacionService from '../services/conversacionService';

const ConversacionesClase = () => {
    const { codigo } = useParams();
    const location = useLocation();
    const claseState = location.state?.clase;
    const [conversaciones, setConversaciones] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const handleEnviarMensaje = (e) => {
        e.preventDefault();
        setMensaje('');
    };

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
                    <h2 className="fw-bold" style={{ color: '#3c4043' }}>Conversación general</h2>
                    <p className="text-muted mb-0">
                        {claseState?.NombreC
                            ? `Clase: ${claseState.NombreC} · Código ${claseState.Codigo_PK}`
                            : `Clase: ${codigo}`}
                    </p>
                </div>
            </div>

            <div className="card border-0 shadow-sm d-flex flex-column" style={{ borderRadius: '15px', backgroundColor: '#ffffff', minHeight: 'calc(100vh - 160px)' }}>
                <div className="card-body p-4 flex-grow-1">
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
                        <div>
                            {conversaciones.map((conv, index) => (
                                <div className="card shadow-sm border-0 mb-3" key={conv.id || index} style={{ borderRadius: '12px' }}>
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div>
                                                <h6 className="fw-bold mb-1">{conv.titulo || 'Conversación general de la clase'}</h6>
                                                <small className="text-secondary">Administrador: {conv.administrador || 'Docente asignado'}</small>
                                            </div>
                                            <span className="badge bg-primary py-2 px-3" style={{ fontSize: '0.82rem' }}>
                                                {conv.mensajes ?? conv.cantidadMensajes ?? 0} mensajes
                                            </span>
                                        </div>
                                        <div className="border rounded p-3" style={{ minHeight: '220px', backgroundColor: '#f8f9fa' }}>
                                            <p className="text-secondary mb-0">{conv.ultimoMensaje || 'Aquí se mostraría el último intercambio de mensajes.'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card-footer bg-light border-top p-4">
                    <form className="d-flex gap-3" onSubmit={handleEnviarMensaje}>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Escribe tu mensaje..."
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary px-4" style={{ borderRadius: '10px' }}>
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ConversacionesClase;
