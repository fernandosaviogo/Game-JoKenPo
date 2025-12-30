import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { doLogin, doLogout } from "./Web3Service"

function Header() {

    const navigate = useNavigate();

    const onLogoutClick = useCallback(() => {
        doLogout();
        navigate("/");
    }, [navigate]);


    /*function onLogoutClick() {
        doLogout();
        navigate("/");
    }*/

    useEffect(() => {
        if(localStorage.getItem("account") !== null) {
            if(localStorage.getItem("isAdmin") === "true"){
                doLogin()
                    .then(result => {
                        if(!result.isAdmin) {
                            localStorage.setItem("isAdmin", "false");
                            navigate("/app");
                        } else {
                            navigate("/admin");
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        onLogoutClick()
                    });
            }
            else navigate("/app");
        }
        else
            navigate("/");
    }, [navigate, onLogoutClick])

    return (
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4" > 
            <a href="/app" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-light text-decoration-none"> 
                <span className="fs-4">Dapp JokenPo</span> 
            </a>

            <div className="col-md-3 text-end">
                <button type="button" className="btn btn-outline-danger me-2" onClick={onLogoutClick}>Logout</button>
            </div>

        </header >
    )
}

export default Header