import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import conversacionService from '../services/conversacionService';

const ConversacionesDirectas = () => {
    const [conversaciones, setConversaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [correoNuevo, setCorreoNuevo] = useState('');
    const [creacionError, setCreacionError] = useState(null);
    const [creacionExitosa, setCreacionExitosa] = useState(null);
    const navigate = useNavigate();

    const cargarConversaciones = async () => {
        try {
            setLoading(true);
            const lista = await conversacionService.obtenerDirectas();
            setConversaciones(lista || []);
        } catch (err) {
            console.error('Error cargando conversaciones directas', err);
            setError('No se pudieron cargar las conversaciones.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarConversaciones();
    }, []);

    const abrirChat = (conv) => {
        navigate(`/conversacion/${conv._id}`, { state: { conversacion: conv } });
    };

    const crearConversacionPorCorreo = async () => {
        setCreacionError(null);
        setCreacionExitosa(null);

        if (!correoNuevo.trim()) {
            setCreacionError('Ingresa el correo electrónico de la otra persona.');
            return;
        }

        try {
            const respuesta = await conversacionService.crearDirectaPorCorreo(correoNuevo.trim());
            setCreacionExitosa('Conversación creada correctamente.');
            setCorreoNuevo('');
            cargarConversaciones();
            if (respuesta?.conversacion?._id) {
                abrirChat(respuesta.conversacion);
            }
        } catch (err) {
            const mensaje = err?.response?.data?.mensaje || 'No se pudo crear la conversación.';
            setCreacionError(mensaje);
            if (mensaje.includes('Ya existe')) {
                setCreacionError('Ya existe una conversación privada con ese correo. Revisa la lista.');
            }
        }
    };

    return (
        <div className="container py-4">
            <h3>Conversaciones</h3>
            <div className="mb-4">
                <label className="form-label">Crear nueva conversación privada</label>
                <div className="input-group">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Correo electrónico del usuario"
                        value={correoNuevo}
                        onChange={(e) => setCorreoNuevo(e.target.value)}
                    />
                    <button className="btn btn-primary" type="button" onClick={crearConversacionPorCorreo}>
                        Crear
                    </button>
                </div>
                {creacionError && <p className="text-danger mt-2">{creacionError}</p>}
                {creacionExitosa && <p className="text-success mt-2">{creacionExitosa}</p>}
            </div>
            {loading ? (
                <p>Cargando...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <div className="list-group">
                    {conversaciones.length === 0 && <p className="text-secondary">No tienes conversaciones directas aún.</p>}
                    {conversaciones.map((conv) => (
                        <button key={conv._id} onClick={() => abrirChat(conv)} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{conv.esDirect
                                    ? (conv.otroParticipante
                                        ? `${conv.otroParticipante.nombres} ${conv.otroParticipante.apellidos}`
                                        : (conv.nombreConversacion || `Conversación ${conv._id}`)
                                    )
                                    : (conv.nombreConversacion || `Conversación ${conv._id}`)
                                }</strong>
                                <div className="text-muted small">
                                    {conv.esDirect ? 'Privado' : 'Grupo'}
                                    {conv.esDirect && conv.otroParticipante ? ` • ${conv.otroParticipante.correo}` : ''}
                                </div>
                            </div>
                            <div className="text-end small text-secondary">
                                {conv.cantidadMensajes ?? ''}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConversacionesDirectas;
