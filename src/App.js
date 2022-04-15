import { useState } from 'react';
import './App.scss';
import OnboardingModal from './components/OnboardingModal';

function App() {

    const [accounts, setAccounts] = useState([]);

    return (
        <div className='App'>
            <OnboardingModal handleAccounts={setAccounts}/>
            <div className='game-container'>
                <iframe className='game' frameBorder={0} src="https://playcanv.as/e/p/yEW2U6hC/"></iframe>
            </div>
        </div>
    );
}

export default App;
