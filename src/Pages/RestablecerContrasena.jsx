import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const RestablecerContrasenia = () => {
    const [correo, setCorreo] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nuevaPassword !== confirmarPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            const data = await authService.restablecerPassword({ 
                correo: correo, 
                nuevaPassword: nuevaPassword 
            });
            
            alert(data.mensaje);
            navigate('/login'); // Lo mandamos al login para que use su nueva clave
        } catch (error) {
            alert(error.response?.data?.mensaje || "Error al restablecer contraseña");
        }
    };

    return (
        <main>
            <section className="hero-section d-flex justify-content-center align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 col-12 mx-auto">
                            <form className="custom-form login-form" onSubmit={handleSubmit}>
                                <h2 className="hero-title text-center mb-4 pb-2">Nueva Contraseña</h2>

                                <div className="form-floating mb-4 p-0">
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        required 
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                    />
                                    <label>Confirma tu correo electrónico</label>
                                </div>

                                <div className="form-floating mb-4 p-0">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        required 
                                        value={nuevaPassword}
                                        onChange={(e) => setNuevaPassword(e.target.value)}
                                    />
                                    <label>Nueva contraseña</label>
                                </div>

                                <div className="form-floating mb-4 p-0">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        required 
                                        value={confirmarPassword}
                                        onChange={(e) => setConfirmarPassword(e.target.value)}
                                    />
                                    <label>Confirmar nueva contraseña</label>
                                </div>

                                <div className="row justify-content-center align-items-center">
                                    <div className="col-lg-12 col-12 mb-3">
                                        <button type="submit" className="form-control btn-primary">
                                            Actualizar Contraseña
                                        </button>
                                    </div>
                                    <div className="col-lg-12 col-12 text-center">
                                        <Link to="/login" style={{ color: 'black', textDecoration: 'none' }}>
                                            Regresar al inicio de sesión
                                        </Link>
                                    </div>
                                </div>
                            </form>    
                        </div>
                    </div>
                </div>
                <div className="video-wrap">
                    <video autoPlay loop muted playsInline className="custom-video">
                        <source src="/videos/video.mp4" type="video/mp4" />
                    </video>
                </div>
            </section>
        </main>
    );
};

export default RestablecerContrasenia;