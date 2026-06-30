import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const RotaProtegida = () => {
    const [status, setStatus] = useState('verificando') // 'verificando' | 'autorizada' | 'negada'

    useEffect(() => {
        const validarToken = async () => {
            const token = localStorage.getItem('token')

            if (!token) {
                setStatus('negada')
                return
            }

            try {
                const resposta = await fetch('/api/auth/perfil', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (resposta.ok) {
                    setStatus('autorizada')
                } else {
                    // token inválido, expirado ou forjado — limpa e bloqueia
                    localStorage.removeItem('token')
                    setStatus('negada')
                }
            } catch {
                // erro de rede — nega por segurança
                localStorage.removeItem('token')
                setStatus('negada')
            }
        }

        validarToken()
    }, [])

    if (status === 'verificando') return null // ou um spinner se preferir
    if (status === 'negada') return <Navigate to="/entrar" replace />
    return <Outlet />
}

export default RotaProtegida