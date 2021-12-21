import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'



function pickIndex(array, currentIndex, random) {
    if (!random) {
        return currentIndex === array.length - 1 ? 0 : currentIndex+1
    }
    let randomIndex =  Math.floor(Math.random() * array.length);
  
    while (randomIndex === currentIndex) {
      randomIndex = Math.floor(Math.random() * array.length);
    }
  
    return randomIndex;
  } 

const Timed = () => {
    const { state: { pins, interval, random, images } } = useLocation();
    const [remainingItems, setRemainingItems] = useState(pins)
    const [completedItems, setCompletedItems] = useState([])
    const [timeElapsed, setTimeElapsed] = useState(0)
    const [viewIndex, setViewIndex] = useState(0)
    
    let navigate = useNavigate();

    const totalItems = Math.min(images, pins.length)
    const currentPin = remainingItems[viewIndex]

    const handleSkipClick = () => {
        setViewIndex(c => pickIndex(remainingItems, c, random))
        setTimeElapsed(0)
    }

    useEffect(() => {
        if (completedItems.length === totalItems || remainingItems.length === 0) {
            navigate('/summary', { state: { pins: completedItems } })
            return
        }
        const timer = setInterval(() => {
            setTimeElapsed(time => time + 1000)
        }, 1000)
        return () => clearTimeout(timer)
    }, [totalItems, completedItems, remainingItems, navigate])


    useEffect(() => {
        if (timeElapsed >= interval) {
            setTimeElapsed(0)
            const current = remainingItems.splice(viewIndex, 1)[0]
            setRemainingItems([...remainingItems])
            setCompletedItems(items => [...items, current])
            setViewIndex(c => pickIndex(remainingItems, -1, random))
        }
    }, [timeElapsed, interval, random, remainingItems, viewIndex])

    return <div>
        <h2>Timed practive</h2>
        <button disabled={remainingItems.length === 1} onClick={handleSkipClick}>Skip</button>
        <span>{completedItems.length + 1} / {totalItems}</span> |
        <span>{timeElapsed / 1000}s / {interval / 1000}s</span>
        <div>
        <img src={currentPin.media.images.originals.url} />
        </div>
    </div>
}

export default Timed