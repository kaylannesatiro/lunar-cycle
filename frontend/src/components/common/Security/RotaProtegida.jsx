import { Navigate, Outlet } from 'react-router-dom'

const RotaProtegida = () => {
    const token = localStorage.getItem('token')

    if (!token) {
        return <Navigate to="/entrar" replace />
    }

    return <Outlet />
}

export default RotaProtegida