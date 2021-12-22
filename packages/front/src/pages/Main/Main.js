import { Alert, AppBar, Box, Button, ButtonGroup, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Dialog, FormControlLabel, FormGroup, Grid, IconButton, ImageList, ImageListItem, Paper, Radio, Slide, Switch, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useSearchParams } from 'react-router-dom'
import localApi from '../../utils/api'
import { TimedPractice } from '../../components/TimedPractice';
import { PracticeSummary } from '../../components/PracticeSummary';

const CLIENT_ID = '1474805'
const REDIRECT_URI = `${process.env.REACT_APP_REDIRECT_URL || 'http://localhost:3000'}/auth`

function useOnScreen(ref) {

    const [isIntersecting, setIntersecting] = useState(false)
  
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting)
    )
  
    useEffect(() => {
      observer.observe(ref.current)
      // Remove the observer as soon as the component is unmounted
      return () => { observer.disconnect() }
    }, [])
  
    return isIntersecting
  }

const Board = ({id, name, description, onSelect, selected }) => {
    const [pins, setPins] = useState([])
    const ref = useRef()
    const isVisible = useOnScreen(ref)

    useEffect(() => {
        if (!isVisible || pins.length > 0) return
    const fetchPins = async () => {
        try {
                const { data } = await localApi.getBoardPins(id, { page_size: 6 })
                setPins(data.items)
            }
        catch (e) {
            // console.log(e)
            // alert('Request failed!')
        }
    }
    fetchPins()
    }, [id, isVisible, pins])

    return   <Card ref={ref} sx={{ maxWidth: 345 }} onClick={() => onSelect(id)}>
      <CardHeader
        action={
          <Radio checked={selected}
          onChange={() => onSelect(id)} />
        }
        title={name}
        subheader={description}
      />
    {pins.length === 0 && <CardMedia
      component="img"
      height="160"
      image={`https://via.placeholder.com/368x150?text=${name}`}
      alt={name}
    />}
    {pins.length > 0 && 
    <CardContent>
    <ImageList variant="masonry" cols={3} gap={8}>
  {pins.map((item, index) => (
    <ImageListItem key={item.id}>
      <img
        src={item.media.images['150x150'].url}
        alt={item.title}
        loading="lazy"
      />
    </ImageListItem>
  ))}
  </ImageList>
    </CardContent>}
  </Card>
}

const Login = () => {
    const handleLoginClick = () => {
        const securityHash = Date.now()
        localStorage.setItem('hash', securityHash)
        window.location.href = `https://www.pinterest.com/oauth/?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=user_accounts:read,boards:read,pins:read&state=${securityHash}`
    }

    return  <Box sx={{ width: '100%', maxWidth: 500 }}>
    <Typography variant="h1" component="div" gutterBottom>
      You're not logged in.
    </Typography>
    <Typography variant="subtitle1" gutterBottom component="div">
        You need to log in your Pinterest account to allow us to list your boards and allow you to practice.
      </Typography>
      <Button variant="contained" onClick={handleLoginClick}>Login</Button>
    </Box>
}

const CheckGroup = ({ value, onChange, options }) => {
    const handleChange = (index) => {
        onChange(options[index].value)
    }

    return <ButtonGroup variant="outlined" aria-label="outlined button group">
    {options.map((option, index) => {
        const readOnly = option.value === value
        return <Button key={option.value} readOnly={readOnly} variant={readOnly ? "contained" : "outlined"} onClick={() => handleChange(index)} >{option.label || option.value}</Button>
    })}
</ButtonGroup>
}

const BoardList = ({ onStartPractice }) => {
    const [boards, setBoards] = useState([])
    const [boardId, setBoardId] = useState(null)
    const [intervalValue, setIntervalValue] = useState(60)
    const [imagesValue, setImagesValue] = useState(20)
    const [checkedRandom, setCheckedRandom] = useState(false)
    const [hasError, setError] = useState(false)

    const handleSelect = (id) => {
      setBoardId(id)
    }
    
    const handleChangeValue = (value) => {
        setIntervalValue(value)
    }

    
    const handleImagesValue = (value) => {
        setImagesValue(value)
    }

    
    const handleChangeCheckedRandom = () => {
        setCheckedRandom(checked => !checked)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!boardId) {
          setError(true)
          return
        }
        onStartPractice({ boardId, interval: intervalValue * 1000, images: imagesValue, random: checkedRandom })
        setError(false)
    }

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const { data } = await localApi.getBoards()
                setBoards(data.items)
            }
            catch (e) {
                console.log(e)
                alert('Request failed!')
            }
        }
        fetchBoards()
    }, [])

    return  <Box sx={{ width: '100%', maxWidth: 2500 }}>
    <Typography variant="h1" component="div" gutterBottom>
      Select your board
    </Typography>
    <Paper elevation={3} >
    <Box sx={{ width: '100%', maxWidth: 1500, padding: 4 }}>
    <form onSubmit={handleSubmit}>
        <FormGroup>
            <Typography>Interval</Typography>
            <CheckGroup options={[{ value: 30, label: '30s'}, { value: 60, label: '1m'}, { value: 120, label: '2m'} , { value: 180, label: '3m'}, { value: 300, label: '5m'} ]} value={intervalValue} onChange={handleChangeValue} />
        </FormGroup>
        <FormGroup>
            <Typography>Images</Typography>
            <CheckGroup options={[{ value: 10} , { value: 20} , { value: 30},  { value: 40},  { value: 50} ]} value={imagesValue} onChange={handleImagesValue} />
        </FormGroup>
        <FormGroup>
            <FormControlLabel control={<Switch checked={checkedRandom} onChange={handleChangeCheckedRandom} />} label="Random" />
        </FormGroup>
        <FormGroup>
        <Button type="submit" variant="contained" >Start</Button>
        </FormGroup>
        {hasError && <Alert severity="error">You need to select a board for practice!</Alert>}
    </form>
    </Box>
    </Paper>
    <Box mt={2} >
    <Grid container spacing={2}>
    {boards.map(board => <Grid  key={board.id} item><Board {...board} onSelect={handleSelect} selected={board.id === boardId} /></Grid>)}
    </Grid>
    </Box>
    </Box>
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const PracticeDialog = ({ boardId, interval, images, random, open, onClose }) => {
  const [loading, setLoading] = useState(true)
  const [completedPins, setCompletedPins] = useState([])
  const [pins, setPins] = useState([])
  const hasFinished = completedPins.length > 0

    useEffect(() => {
      if (!boardId) return
      setLoading(true)
      const fetchPins = async () => {
          try {
                  const { data } = await localApi.getBoardPins(boardId)
                  setPins(data.items)
                  setLoading(false)
          }
          catch (e) {
              // console.log(e)
              // alert('Request failed!')
          }
      }
    fetchPins()
    }, [boardId])


    const handleFinished = (pins) => {
      setCompletedPins(pins)
    }

    const handleClose = () => {
      setCompletedPins([])
      onClose()
    }
  return <Dialog
  fullScreen
  open={open}
  onClose={onClose}
  TransitionComponent={Transition}
>
  {loading && <CircularProgress />}
  {!loading && !hasFinished && <TimedPractice pins={pins} interval={interval} images={images} random={random} onClose={onClose} onFinish={handleFinished} />}
  {!loading && hasFinished && <PracticeSummary pins={completedPins} onClose={handleClose} /> }
  </Dialog>
}

const Main = () => {
    const [isLogged, setLogged] = useState(false)
    const [isOpenDialog, setOpenDialog] = useState(false)
    const [practiceConfig, setPracticeConfig] = useState(false)

    const handleStartPractice = ({ boardId, interval, images, random }) => {
      setPracticeConfig({ boardId, interval, images, random })
      setOpenDialog(true)
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setLogged(true)
        }
    }, [])

    return  <>
    {isLogged ? <BoardList onStartPractice={handleStartPractice} /> : <Login />}
    <PracticeDialog {...practiceConfig} open={isOpenDialog} onClose={() => setOpenDialog(false)} />
    </>
}

export default Main