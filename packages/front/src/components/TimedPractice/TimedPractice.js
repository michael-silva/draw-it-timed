import { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useLocation, useNavigate } from 'react-router-dom'
import { AppBar, Button, IconButton, LinearProgress, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';



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

const TimedPractice = ({ pins, interval, random, images, onClose, onFinish }) => {
    const [remainingItems, setRemainingItems] = useState(pins)
    const [completedItems, setCompletedItems] = useState([])
    const [timeElapsed, setTimeElapsed] = useState(0)
    const [viewIndex, setViewIndex] = useState(0)
    const hasRemaining = remainingItems.length > 1
    

    const totalItems = Math.min(images, pins.length)
    const currentPin = remainingItems[viewIndex]

    const handleSkipClick = () => {
        setViewIndex(c => pickIndex(remainingItems, c, random))
        setTimeElapsed(0)
    }

    useEffect(() => {
        if (completedItems.length === totalItems || remainingItems.length === 0) {
            onFinish(completedItems)
            return
        }
        const timer = setInterval(() => {
            setTimeElapsed(time => time + 500)
        }, 300)
        return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalItems, completedItems, remainingItems])


    useEffect(() => {
        if (timeElapsed >= interval) {
            setTimeElapsed(0)
            const current = remainingItems.splice(viewIndex, 1)[0]
            setRemainingItems([...remainingItems])
            setCompletedItems(items => [...items, current])
            setViewIndex(c => pickIndex(remainingItems, -1, random))
        }
    }, [timeElapsed, interval, random, remainingItems, viewIndex])

    return <>
    <AppBar sx={{ position: 'relative' }}>
    <Toolbar>
      <IconButton
        edge="start"
        color="inherit"
        onClick={onClose}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
      <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
        Timed Practice (<span>{completedItems.length} / {totalItems}</span>)
      </Typography>
      {hasRemaining && <Button autoFocus color="inherit" onClick={handleSkipClick}>
        Skip
      </Button>}
    </Toolbar>
  </AppBar>
        <Box sx={{ height: '90%', width: '100%', display: 'flex' }}>
        <img src={currentPin.media.images.originals.url} style={{ maxWidth: '100%', maxHeight: '100%', margin: 'auto', display: 'flex'}} />
        </Box>
        <AppBar position="fixed" color="default" sx={{ top: 'auto', bottom: 0 }}>
        <Typography sx={{ mx: 2, flex: 1 }} variant="h6" component="div">
        <span>{Math.floor(timeElapsed / 1000)}s / {interval / 1000}s</span>
        <LinearProgress variant="determinate" value={100 / interval * timeElapsed} />
        </Typography>
      </AppBar>
    </>
}

export default TimedPractice