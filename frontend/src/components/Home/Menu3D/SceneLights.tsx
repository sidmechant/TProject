const Lights = () => {
    return (
        //changer la couleur du pointLight selon le theme?
        <>
            <directionalLight position={[9, 9, 4]} intensity={4.5} color={"#f2d5d3"} />
            <ambientLight intensity={1} />
            <pointLight position={[2, 2, 2]} intensity={4} color={"white"} /> 
        </>
    )
}

export default Lights