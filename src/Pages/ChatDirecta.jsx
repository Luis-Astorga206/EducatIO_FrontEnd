import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import conversacionService from '../services/conversacionService';
import mensajeService from '../services/mensajeService';

const ChatDirecta = () => {
    const { id } = useParams();
    const location = useLocation();
    const conversacionState = location.state?.conversacion;

    const [conversacion, setConversacion] = useState(conversacionState || null);
    const [mensajes, setMensajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [error, setError] = useState(null);

    const cargarConversacion = async () => {
        try {
            const data = await conversacionService.obtenerPorId(id);
            setConversacion(data);
        } catch (err) {
            console.error('Error cargando conversación', err);
            setError('No se pudo cargar la conversación.');
        }
    };

    const cargarMensajes = async () => {
        try {
            setLoading(true);
            const data = await mensajeService.obtenerPorConversacion(id);
            const lista = Array.isArray(data) ? data : data.data ?? data;
            setMensajes(lista || []);
        } catch (err) {
            console.error('Error cargando mensajes', err);
            setError('No se pudieron cargar los mensajes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarConversacion();
        cargarMensajes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const enviar = async () => {
        if (!nuevoMensaje.trim()) return;
        try {
            await mensajeService.enviarMensaje(id, nuevoMensaje.trim());
            setNuevoMensaje('');
            await cargarMensajes();
        } catch (err) {
            console.error('Error enviando mensaje', err);
            setError('No se pudo enviar el mensaje.');
        }
    };

    return (
        <div className="container py-4 d-flex flex-column" style={{height: '80vh'}}>
            <div className="mb-3">
                <h5>{conversacion?.esDirect
                    ? (conversacion.otroParticipante
                        ? `${conversacion.otroParticipante.nombres} ${conversacion.otroParticipante.apellidos}`
                        : conversacion?.nombreConversacion || `Conversación ${id}`)
                    : (conversacion?.nombreConversacion || `Conversación ${id}`)
                }</h5>
                {conversacion?.esDirect && conversacion.otroParticipante && (
                    <p className="text-muted mb-0">{conversacion.otroParticipante.correo}</p>
                )}
            </div>
            <div className="border rounded p-3 flex-grow-1 overflow-auto mb-3 bg-white">
                {loading ? (
                    <p>Cargando mensajes...</p>
                ) : mensajes.length === 0 ? (
                    <p className="text-secondary">No hay mensajes aún. Envía el primero.</p>
                ) : (
                    mensajes.map((m) => (
                        <div key={m._id} className={`mb-2 ${m.emisorId === Number(localStorage.getItem('userId')) ? 'text-end' : 'text-start'}`}>
                            <div className={`d-inline-block p-2 rounded ${m.emisorId === Number(localStorage.getItem('userId')) ? 'bg-primary text-white' : 'bg-light text-dark'}`}>
                                <div className="small text-muted">{m.emisorId}</div>
                                <div>{m.contenido}</div>
                                <div className="small text-muted mt-1">{new Date(m.fechaCreacion).toLocaleString()}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="input-group">
                <input value={nuevoMensaje} onChange={e => setNuevoMensaje(e.target.value)} type="text" className="form-control" placeholder="Escribe un mensaje..." />
                <button className="btn btn-primary" onClick={enviar}>Enviar</button>
            </div>

            {error && <p className="text-danger mt-2">{error}</p>}
        </div>
    );
};

export default ChatDirecta;
