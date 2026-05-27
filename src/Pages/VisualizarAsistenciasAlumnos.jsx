import { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import asistenciaService from '../services/asistenciaService';

const VisualizarAsistenciasAlumnos = () => {
    const { codigo } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const claseState = location.state?.clase;
    
    const [asistencias, setAsistencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [filtroAlumno, setFiltroAlumno] = useState('');

    // Verificar que el usuario sea docente
    useEffect(() => {
        if (auth && auth.rol !== 3) {
            navigate('/dashboard');
        }
    }, [auth, navigate]);

    useEffect(() => {
        const cargarAsistenciasAlumnos = async () => {
            try {
                setCargando(true);
                const data = await asistenciaService.obtenerAsistenciasAlumnos(claseState?.Codigo_PK || codigo);
                setAsistencias(data || []);
            } catch (err) {
                console.error('Error al cargar asistencias de alumnos:', err);
                setError('No se pudieron cargar las asistencias. Intenta de nuevo más tarde.');
            } finally {
                setCargando(false);
            }
        };

        if (auth?.rol === 3) {
            cargarAsistenciasAlumnos();
        }
    }, [codigo, claseState, auth]);

    // Agrupar asistencias por alumno
    const asistenciasPorAlumno = asistencias.reduce((acc, asistencia) => {
        const nombreAlumno = asistencia.NombreAlumno || asistencia.nombreAlumno || 'Alumno desconocido';
        if (!acc[nombreAlumno]) {
            acc[nombreAlumno] = {
                nombreAlumno,
                idAlumno: asistencia.idAlumno || asistencia.id_alumno,
                registros: []
            };
        }
        acc[nombreAlumno].registros.push(asistencia);
        return acc;
    }, {});

    const alumnosFiltrados = Object.values(asistenciasPorAlumno).filter(alumno =>
        alumno.nombreAlumno.toLowerCase().includes(filtroAlumno.toLowerCase())
    );

    // Calcular estadísticas por alumno
    const calcularEstadisticas = (registros) => {
        const total = registros.length;
        const presentes = registros.filter(r => 
            r.estado === 'Presente' || r.asistio === 'Presente' || r.asistio === true
        ).length;
        const ausentes = registros.filter(r => 
            r.estado === 'Ausente' || r.asistio === 'Ausente' || r.asistio === false
        ).length;
        const justificados = registros.filter(r => 
            r.estado === 'Justificado' || r.asistio === 'Justificado'
        ).length;

        return {
            total,
            presentes,
            ausentes,
            justificados,
            porcentajeAsistencia: total > 0 ? Math.round((presentes / total) * 100) : 0
        };
    };

    return (
        <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f0f2f5' }}>
            {/* Cabecera */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold" style={{ color: '#3c4043' }}>Asistencias de Alumnos</h2>
                    <p className="text-muted mb-0">
                        {claseState?.NombreC
                            ? `Clase: ${claseState.NombreC} · Código ${claseState.Codigo_PK}`
                            : `Clase: ${codigo}`}
                    </p>
                </div>
            </div>

            {/* Buscador */}
            {!cargando && asistencias.length > 0 && (
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="🔍 Buscar alumno por nombre..."
                        value={filtroAlumno}
                        onChange={(e) => setFiltroAlumno(e.target.value)}
                        style={{ borderRadius: '10px', borderColor: '#e0e0e0' }}
                    />
                </div>
            )}

            {/* Contenedor principal */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', backgroundColor: '#ffffff' }}>
                <div className="card-body p-4">
                    {cargando ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-warning mb-0" role="alert">
                            {error}
                        </div>
                    ) : asistencias.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-calendar-check display-4 text-muted"></i>
                            <p className="mt-4 mb-1 fs-5 text-muted">No hay registros de asistencia aún.</p>
                            <p className="text-secondary">Cuando haya asistencias registradas, las verás listadas aquí.</p>
                        </div>
                    ) : alumnosFiltrados.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-search display-4 text-muted"></i>
                            <p className="mt-4 mb-1 fs-5 text-muted">No se encontraron resultados.</p>
                            <p className="text-secondary">Intenta con otro nombre de alumno.</p>
                        </div>
                    ) : (
                        <div className="row">
                            {alumnosFiltrados.map((alumno) => {
                                const stats = calcularEstadisticas(alumno.registros);
                                return (
                                    <div key={alumno.idAlumno} className="col-lg-6 mb-4">
                                        <div className="card border-0 h-100" style={{ borderRadius: '12px', backgroundColor: '#f8f9fa' }}>
                                            <div className="card-body">
                                                {/* Nombre del alumno */}
                                                <div className="d-flex align-items-center mb-3">
                                                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                                         style={{ width: '50px', height: '50px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                                        {alumno.nombreAlumno.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h5 className="mb-0 fw-bold text-dark">{alumno.nombreAlumno}</h5>
                                                        <small className="text-muted">ID: {alumno.idAlumno || 'N/A'}</small>
                                                    </div>
                                                </div>

                                                {/* Estadísticas */}
                                                <div className="row text-center mb-3">
                                                    <div className="col-6 col-md-3">
                                                        <div className="p-2">
                                                            <div className="text-success fw-bold" style={{ fontSize: '1.3rem' }}>
                                                                {stats.presentes}
                                                            </div>
                                                            <small className="text-muted">Presentes</small>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-3">
                                                        <div className="p-2">
                                                            <div className="text-danger fw-bold" style={{ fontSize: '1.3rem' }}>
                                                                {stats.ausentes}
                                                            </div>
                                                            <small className="text-muted">Ausentes</small>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-3">
                                                        <div className="p-2">
                                                            <div className="text-warning fw-bold" style={{ fontSize: '1.3rem' }}>
                                                                {stats.justificados}
                                                            </div>
                                                            <small className="text-muted">Justificados</small>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-3">
                                                        <div className="p-2">
                                                            <div className="text-primary fw-bold" style={{ fontSize: '1.3rem' }}>
                                                                {stats.porcentajeAsistencia}%
                                                            </div>
                                                            <small className="text-muted">Asistencia</small>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Barra de progreso */}
                                                <div className="mb-3">
                                                    <div className="progress" style={{ height: '25px', borderRadius: '8px' }}>
                                                        <div className="progress-bar bg-success" role="progressbar"
                                                             style={{ width: `${(stats.presentes / stats.total) * 100}%` }}
                                                             aria-valuenow={stats.presentes} aria-valuemin="0" aria-valuemax={stats.total}>
                                                            <small className="fw-bold">Presentes</small>
                                                        </div>
                                                        <div className="progress-bar bg-danger" role="progressbar"
                                                             style={{ width: `${(stats.ausentes / stats.total) * 100}%` }}
                                                             aria-valuenow={stats.ausentes} aria-valuemin="0" aria-valuemax={stats.total}>
                                                            <small className="fw-bold">Ausentes</small>
                                                        </div>
                                                        <div className="progress-bar bg-warning" role="progressbar"
                                                             style={{ width: `${(stats.justificados / stats.total) * 100}%` }}
                                                             aria-valuenow={stats.justificados} aria-valuemin="0" aria-valuemax={stats.total}>
                                                            <small className="fw-bold">Justif.</small>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Tabla de registros */}
                                                <div className="table-responsive">
                                                    <table className="table table-sm table-borderless mb-0">
                                                        <thead>
                                                            <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                                                                <th style={{ fontSize: '0.85rem' }}>Fecha</th>
                                                                <th style={{ fontSize: '0.85rem' }}>Estado</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {alumno.registros.slice(-5).map((registro, idx) => (
                                                                <tr key={idx} style={{ borderBottom: '1px solid #dee2e6' }}>
                                                                    <td style={{ fontSize: '0.85rem' }}>
                                                                        {registro.fecha || registro.fechaRegistro || 'Sin fecha'}
                                                                    </td>
                                                                    <td style={{ fontSize: '0.85rem' }}>
                                                                        <span className={`badge ${
                                                                            registro.estado === 'Presente' || registro.asistio === 'Presente' || registro.asistio === true
                                                                                ? 'bg-success'
                                                                                : registro.estado === 'Ausente' || registro.asistio === 'Ausente' || registro.asistio === false
                                                                                ? 'bg-danger'
                                                                                : 'bg-warning'
                                                                        }`}>
                                                                            {registro.estado || registro.asistio || 'Desconocido'}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisualizarAsistenciasAlumnos;
