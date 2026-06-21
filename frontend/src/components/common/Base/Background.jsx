import './Background.css'

const Background = ({ children }) => {
    return (
        <>
            <div className="background-container">
                <div className="background-mistico"></div>
                <main className="conteudo-app">
                    {children}
                </main>
            </div>
        </>
    )
}

export default Background;