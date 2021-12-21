import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'


const Summary = () => {
    const { state: { pins } } = useLocation();
    console.log(pins)
    const [viewIndex, setViewIndex] = useState(-1)
    const currentPin = viewIndex === -1 ? null : pins[viewIndex]
    
    const handleImageClick = (index) => {
        setViewIndex(index)
    }

    const handleCloseClick = (index) => {
        setViewIndex(-1)
    }
    return <div>
        <h2>Practice resume</h2>
        <div>
        {currentPin && <div>
        <button onClick={handleCloseClick}>Close</button>
        <img src={currentPin.media.images.originals.url} />
        </div>}
        {!currentPin && pins.map((pin, index) => <img src={pin.media.images['150x150'].url} onClick={() => handleImageClick(index)} width={150} height={150} />)}
        </div>
    </div>
}

export default Summary