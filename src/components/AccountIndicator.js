import './AccountIndicator.scss';

export default function AccountIndicator(props) {
    return (
        <>
            <p className='account'>{props.account}</p>
        </>
    );
}