import { Link } from 'react-router-dom'

function NavBar() {
    return (
        <div className='nav'>
            <div className="logo">
                <Link className='nav-link' to="/"> Transcendance</Link>
            </div>
            <div className="nav-links">
                <div className="nav-item">
                    <Link className='nav-link' to="/">
                        Home
                    </Link>
                </div>
                <div className="nav-item">
                    <Link className='nav-link' to="/game">
                        Game
                    </Link>
                </div>
                <div className="nav-item">
                    <Link className='nav-link' to="/chatbox">
                        ChatBox
                    </Link>
                </div>
                <div className="nav-item">
                    <Link className='nav-link' to="/about">
                        About
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NavBar