import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { doLogin } from "./Web3Service.ts";

function Login() {

  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const redirectAfterLogin = useCallback(
    (isAdmin: boolean) => {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/app");
      }
    },
    [navigate]
  );

  /*function redirectAfterLogin(isAdmin: boolean) {
    if(isAdmin)
      navigate("/admin");
    else
      navigate("/app");
  }*/

  useEffect(() => {
    if (localStorage.getItem("account") != null)
      redirectAfterLogin(localStorage.getItem("isAdmin") === "true");
  }, [redirectAfterLogin])

  function onBtnClick() {
    setMessage("Logging in...");
    doLogin()
      .then(result => redirectAfterLogin(result.isAdmin))
      .catch(err => setMessage(err.message))
  }

  return (
    <>
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header className="mb-auto">
          <div>
            <h3 className="float-md-start mb-0">Dapp JoKenPo</h3>
            <nav className="nav nav-masthead justify-content-center float-md-end">
              <a className="nav-link fw-bold py-1 px-0 active" aria-current="page" href="#">Home</a>
              <a className="nav-link fw-bold py-1 px-0" href="#">About</a>
            </nav>
          </div>
        </header>

        <main className="px-3">
          <h1>Log in and play with us</h1>
          <p className="lead">Play Rock-Paper-Scissors and earn prizes.</p>
          <p className="lead">
            <a href="#" onClick={onBtnClick} className="btn btn-lg btn-light fw-bold border-white bg-white">
              <img src="/assets/metamask.svg" alt="MetaMask logo" width={48} />
              Log in with MetaMask
            </a>
          </p>

          <p className="lead">
            {message}
          </p>
        </main>

        <footer className="mt-auto text-white-50">
          <p>Built by <a href="https://www.linkedin.com/in/fernando-savio-gomes-6273b350/" className="text-white">FernandoDev</a>.</p>
        </footer>
      </div>
    </>
  )
}

export default Login;