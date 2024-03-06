import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import logoffIcon from './logoff-icon.png'; // Asegúrate de que la ruta es correcta

export const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();

    const logout = () => {
        setCookies("access_token", "", { path: "/" });
        window.localStorage.removeItem("userID");
        navigate("/auth");
    };

    return (
        <>
            <div className="header">
                <img src="/pizzagram.png" alt="Logo" />
            </div>
            <div className="navbar">
                <Link to="/">Inicio</Link>
                <Link to="/create-recipe">Crear Receta</Link>
                <Link to="/saved-recipes">Recetas Guardadas</Link>
                {!cookies.access_token ? (
                    <Link to="/auth">Login/Registro</Link>
                ) : (
                    // Usa directamente el elemento img para el icono de logoff
                <img 
                src={logoffIcon} 
                alt="Logoff" 
                onClick={logout} 
                style={{ cursor: 'pointer', width: '50px', height: '50px', marginTop: '15px' }} // Ajusta el tamaño aquí
                />
                )}
            </div>
        </>
    );
};



