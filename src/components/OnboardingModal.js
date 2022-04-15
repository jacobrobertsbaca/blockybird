import React, { useEffect, useRef, useState } from 'react';
import * as LottiePlayer from "@lottiefiles/lottie-player";
import MetaMaskOnboarding from '@metamask/onboarding';
import AccountIndicator from './AccountIndicator';
import './OnboardingModal.scss';

const Status = Object.freeze({
    Install: 1,
    Connect: 2,
    Connecting: 3,
    Connected: 4
})

function OnboardingModal(props) {
    const [status, setStatus] = useState(Status.Install);
    const [accounts, setAccounts] = useState([]);
    const [visible, setVisible] = useState(true);
    const onboarding = useRef();
    const confetti = useRef();

    async function requestAccounts() {
        setStatus(Status.Connecting);
        window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(setAccounts);
    }

    useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    });

    useEffect(() => {
        if (props.handleAccounts) props.handleAccounts(accounts);
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            if (accounts.length > 0) {
                setStatus(Status.Connected);
                onboarding.current.stopOnboarding();
                if (confetti.current) confetti.current.play();
            } else {
                setStatus(Status.Connect);
            }
        }
    }, [props, accounts, confetti]);

    useEffect(() => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            requestAccounts();
        }
    }, []);

    const onClick = () => {
        switch (status) {
            case Status.Install:
                onboarding.current.startOnboarding();
                break;
            case Status.Connect:
                requestAccounts();
                break;
            case Status.Connected:
                setVisible(false);
                break;
            default: break;
        }
    }

    function getContent() {
        switch (status) {
            case Status.Install: return {
                title: "You need to install a wallet",
                desc: "To play, you need an Ethereum wallet. Click below to install MetaMask.",
                button: "Install Metamask"
            };
            case Status.Connect: return {
                title: "Connect your wallet",
                desc: "To play, please connect your Ethereum wallet.",
                button: "Connect Metamask"
            };
            case Status.Connecting: return {
                title: "Connect your wallet",
                desc: "Waiting for you to connect your wallet...",
                button: "Connect Metamask"
            };
            case Status.Connected: return {
                title: "You're connected! Hooray!",
                desc: "Thanks for connecting your wallet.",
                button: "Play Flappy Bird"
            };
            default: return {}
        }
    }

    return (
        <div className={`onboard-container ${visible ? 'visible' : 'hidden'}`}>
            <div className="onboard-modal">
                {status === Status.Connecting &&
                    <div className="loader">
                        <lottie-player src="https://assets2.lottiefiles.com/private_files/lf30_lndg7fhf.json" background="transparent" speed="1" loop autoplay></lottie-player>
                    </div>}
                {(status === Status.Connect || status === Status.Connecting) &&
                    <div className="up">
                        <lottie-player src="https://assets3.lottiefiles.com/packages/lf20_kfzgxkvq.json" background="transparent" speed="1" loop autoplay></lottie-player>
                    </div>}
                <div className="confetti">
                    <lottie-player ref={confetti} className="success-anim" src="https://assets10.lottiefiles.com/packages/lf20_rovf9gzu.json" background="transparent" speed="1"></lottie-player>
                </div>
                <h1>{getContent().title}</h1>
                <p className="desc">{getContent().desc}</p>
                {accounts.map((a, i) => <AccountIndicator key={i} account={a} />)}<br />
                <a href="#" onClick={onClick} className={`onboard ${status === Status.Connecting ? 'disabled' : ''}`}>{getContent().button}</a>
            </div>
        </div>
    );
}

export default OnboardingModal;