import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import RestablecerContrasenia from '../pages/RestablecerContrasena';
import ProtectedRoute from '../components/ProtectedRoute'; // Importamos el guardia
import MainLayout from '../components/MainLayout'; // Importamos el Layout
import Usuarios from '../pages/Usuarios';
import GestionClases from '../pages/GestionClases';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas: Cualquiera sin la necesidad de hacer login puede verlas */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<RestablecerContrasenia/>} />
                
                {/*Rutas privadas: Solo se ven cuando se a iniciado sesion(token necesario)*/}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* Agregaremos más aquí: */}
                        <Route path="/usuarios" element={<Usuarios />} />
                        <Route path="/clases" element={<GestionClases />} />
                    </Route>
                </Route>

                {/* Redirecciones automáticas:En caso de error a cual pagina se retornara */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;