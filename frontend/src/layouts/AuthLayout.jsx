import { Outlet } from "react-router-dom";
import Background from "../components/common/Base/Background";
import CardConta from "../components/common/Cards/CardConta";
import "./AuthLayout.css";

const AuthLayout = () => {
    return (
        <Background>
            <div className="auth-layout">
                <CardConta>
                    <Outlet />
                </CardConta>
            </div>
        </Background>
    );
};

export default AuthLayout;