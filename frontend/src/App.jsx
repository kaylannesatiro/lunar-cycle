import Calendario from "./components/features/Calendario/Calendario";
import Background from "./components/common/Base/Background";
import "./App.css";

function App() {
    const diasMenstruacao = [
        "2026-05-30",
        "2026-05-29",
        "2026-05-28",
        "2026-06-01",
        "2026-06-02",
        "2026-06-03",
        "2026-06-04",
        "2026-06-05",
    ];

    const diasPrevistos = [
        "2026-06-18",
        "2026-06-19",
        "2026-06-20",
        "2026-06-21",
    ];

    const fasesLunares = {
        "2026-06-01": "Nova",
        "2026-06-02": "Crescente",
        "2026-06-03": "Quarto Crescente",
        "2026-06-04": "Gibosa Crescente",
        "2026-06-05": "Cheia",
        "2026-06-06": "Gibosa Minguante",
        "2026-06-07": "Quarto Minguante",
        "2026-06-08": "Minguante",

        "2026-06-09": "Nova",
        "2026-06-10": "Crescente",
        "2026-06-11": "Quarto Crescente",
        "2026-06-12": "Gibosa Crescente",
        "2026-06-13": "Cheia",
        "2026-06-14": "Gibosa Minguante",
        "2026-06-15": "Quarto Minguante",
        "2026-06-16": "Minguante",

        "2026-06-17": "Nova",
        "2026-06-18": "Cheia",
        "2026-06-19": "Minguante",
        "2026-06-20": "Crescente",
        "2026-06-21": "Quarto Crescente",
    };

    const handleDayClick = (data) => {
        alert(`Você clicou em ${data}`);
    };

    return (
        <Background>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "40px",
                }}
            >
                <Calendario
                    diasMenstruacao={diasMenstruacao}
                    diasPrevistos={diasPrevistos}
                    fasesLunares={fasesLunares}
                    onDayClick={handleDayClick}
                />
            </div>
        </Background>
    );
}

export default App;