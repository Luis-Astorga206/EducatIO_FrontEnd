import { useEffect, useState } from 'react';
import conversacionService from '../services/conversacionService';

const ConversacionesClase = ({ clase, alCerrar }) => {
    const [conversaciones, setConversaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarConversaciones = async () => {
            try {
                setCargando(true);
                const data = await conversacionService.obtenerPorClase(clase.Codigo_PK);
                setConversaciones(data || []);
            } catch (err) {
                console.error('Error al cargar conversaciones:', err);
                setError('No se pudieron cargar las conversaciones. Intenta de nuevo más tarde.');
            } finally {
                setCargando(false);
            }
        };

        cargarConversaciones();
    }, [clase]);

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered" style={{ maxWidth: '760px' }}>
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>

                    <div className="modal-header text-white" style={{ backgroundColor: '#1a73e8', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                        <div>
                            <h5 className="modal-title fw-bold">Conversaciones disponibles</h5>
                            <p className="mb-0 small text-white-75">Clase: {clase.NombreC} · Código {clase.Codigo_PK}</p>
                        </div>
                        <button type="button" className="btn-close btn-close-white" onClick={alCerrar}></button>
                    </div>

                    <div className="modal-body p-4" style={{ backgroundColor: '#f8f9fa' }}>
                        {cargando ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '180px' }}>
                                <div className="spinner-border text-primary" role="status"></div>
                            </div>
                        ) : error ? (
                            <div className="alert alert-warning mb-0" role="alert">
                                {error}
                            </div>
                        ) : conversaciones.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="bi bi-chat-left-text fs-1 text-secondary"></i>
                                <p className="mt-3 mb-0 text-secondary">No hay conversaciones disponibles para esta clase.</p>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {conversaciones.map((conv, index) => (
                                    <div className="col-12" key={conv.id || index}>
                                        <div className="card shadow-sm border-0">
                                            <div className="card-body d-flex align-items-start justify-content-between gap-3">
                                                <div>
                                                    <h6 className="fw-bold mb-1">{conv.titulo || `Conversación ${index + 1}`}</h6>
                                                    <p className="mb-1 text-muted" style={{ fontSize: '0.92rem' }}>
                                                        {conv.ultimoMensaje || 'Sin mensajes recientes'}
                                                    </p>
                                                    <small className="text-secondary">
                                                        {conv.fechaUltimoMensaje || conv.fecha || 'Sin actividad reciente'}
                                                    </small>
                                                </div>

                                                <div className="text-end">
                                                    <span className="badge bg-primary py-2 px-3" style={{ fontSize: '0.8rem' }}>
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

                    <div className="modal-footer border-0 p-3 justify-content-center" style={{ backgroundColor: '#f8f9fa', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }}>
                        <button type="button" className="btn btn-outline-secondary px-4" onClick={alCerrar} style={{ borderRadius: '8px' }}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversacionesClase;
