import socket from "../socket";

export default function Logout() {

    const handleClearData = () => {
        // Remove specific items from localStorage
        localStorage.removeItem('player');
        localStorage.removeItem('jwt_token');

        // Clear all cookies
        document.cookie.split(";").forEach((c) => {
			document.cookie = c
			  .replace(/^ +/, "")
			  .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
		  });

        // Redirect to the desired URL
        window.location.href = 'http://localhost:5173';
    };

    const emitEvent = () => {
        console.log("EMIT HELLO WORLD");
        socket.emit('helloworld', 'test event hello');
    }

    return (
        <>
        <button className='fixed bg-black/70 text-white mx-5 my-5 w-20 h-20' onClick={handleClearData}>Logout</button>
        <button className='fixed bg-black/70 text-white mx-44 my-5 w-20 h-20' onClick={emitEvent}>Emit event</button>
        </>
    );
}