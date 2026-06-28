import './AnimacaoLua.css'

const AnimacaoLua = () => {
    return (
        <div className="animacao-lua-container">
            <div className="animacao-lua-trilha-wrapper">
                <svg 
                    className="animacao-lua-orbita" 
                    width="1502" 
                    height="160" 
                    viewBox="0 0 1502 160" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        d="M 0 159.8 Q 750.7 -160 1501.5 159.8" 
                        stroke="rgba(224, 197, 143, 0.11)" 
                        strokeWidth="4.634" 
                    />
                </svg>

                <div className="animacao-lua-planeta">
                    <div className="animacao-lua-glow animacao-lua-glow--maior">
                        <svg xmlns="http://www.w3.org/2000/svg" width="108" height="108" viewBox="0 0 108 108" fill="none">
                            <path d="M53.7575 107.515C83.447 107.515 107.515 83.447 107.515 53.7575C107.515 24.0681 83.447 0 53.7575 0C24.0681 0 0 24.0681 0 53.7575C0 83.447 24.0681 107.515 53.7575 107.515Z" fill="#E0C58F" fillOpacity="0.04"/>
                        </svg>
                    </div>

                    <div className="animacao-lua-glow animacao-lua-glow--medio">
                        <svg xmlns="http://www.w3.org/2000/svg" width="71" height="71" viewBox="0 0 71 71" fill="none">
                            <path d="M35.2205 70.4409C54.6722 70.4409 70.4409 54.6722 70.4409 35.2205C70.4409 15.7687 54.6722 0 35.2205 0C15.7687 0 0 15.7687 0 35.2205C0 54.6722 15.7687 70.4409 35.2205 70.4409Z" fill="#F5F0E9" fillOpacity="0.067"/>
                        </svg>
                    </div>

                    <div className="animacao-lua-glow animacao-lua-glow--nucleo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none">
                            <path d="M22.2445 44.489C34.5298 44.489 44.489 34.5298 44.489 22.2445C44.489 9.9592 34.5298 0 22.2445 0C9.9592 0 0 9.9592 0 22.2445C0 34.5298 9.9592 44.489 22.2445 44.489Z" fill="url(#paint0_radial_38_20884)"/>
                            <defs>
                                <radialGradient id="paint0_radial_38_20884" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15.1263 14.2365) scale(29.3627)">
                                <stop stopColor="white"/>
                                <stop offset="0.38" stopColor="#F5F0E9"/>
                                <stop offset="1" stopColor="#E0C58F"/>
                                </radialGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnimacaoLua;