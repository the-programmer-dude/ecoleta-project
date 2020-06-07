import React, { useEffect, useState } from 'react';
import { FiLogIn, FiCheckCircle } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import './style.css'
import logo from '../../assets/logo.svg'

const Home = (props: any) => {
    const [ success, setSuccess ] = useState(false);

    useEffect(() => {
        if(props.history.location.state && sessionStorage.getItem('success')){
            sessionStorage.setItem('success', 'true')
            setSuccess(true)
        }
    }, [])

    useEffect(() => {
        if(sessionStorage.getItem('success')){
            setTimeout(() => {
                sessionStorage.removeItem('success')
                setSuccess(false)
            }, 2000);
        }
    }, [])

    return (
        <>
        {success ? (
            <div className="success-page">
                <FiCheckCircle />
                <h1>Cadastro completo</h1>
            </div>
        ): null}

        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt=""/>
                </header>

                <main>
                    <h1>Seu marketplace de coleta de resíduos.</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

                    <Link to="/register">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
        </>
    )
}

export default Home