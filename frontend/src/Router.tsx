import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import Admin from "./Admin";
import App from "./App";
import Login from "./Login";
import type React from "react";

type Props = {
        children: React.ReactNode;
    }

function PrivateRoute({ children }: Props) {
        const isAuth = localStorage.getItem("account") !== null;
        return isAuth ? children : <Navigate to="/" />
    }


function Router() {
    
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin" element={
                    <PrivateRoute>
                        <Admin />
                    </PrivateRoute>
                } />
                <Route path="/app" element={
                    <PrivateRoute>
                        <App />
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    )

}

export default Router;