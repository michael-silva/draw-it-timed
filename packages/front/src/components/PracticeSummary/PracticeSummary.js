import { AppBar, Box, Button, IconButton, ImageList, ImageListItem, Paper, Toolbar, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CheckGroup } from '../CheckGroup';


const Summary = ({ pins, interval, onIntervalChange, onClose, onRedoClick }) => {
    const [viewIndex, setViewIndex] = useState(-1)
    const currentPin = viewIndex === -1 ? null : pins[viewIndex]
    const intervalValue = interval / 1000
    
    const handleImageClick = (index) => {
        setViewIndex(index)
    }

    const handleCloseClick = (index) => {
        setViewIndex(-1)
    }

    const handleIntervalChange = (interval) => {
      onIntervalChange(interval * 1000)
    }

    return <>
    <AppBar sx={{ position: 'relative' }}>
    <Toolbar>
    {!currentPin && <><IconButton
        edge="start"
        color="inherit"
        onClick={onClose}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
      <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
      Practice resume (<span>{pins.length}</span>)
      </Typography>
      </>
      }
      {currentPin && <>
        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
      Image {viewIndex + 1}
      </Typography>
      <Button autoFocus color="inherit" onClick={handleCloseClick}  startIcon={<ArrowBackIcon />}>
        Back
      </Button>
      </>}
    </Toolbar>
  </AppBar>
        {currentPin && <Box sx={{ height: '90%', width: '100%', display: 'flex' }}>
        <img src={currentPin.media.images.originals.url} style={{ maxWidth: '100%', maxHeight: '100%', margin: 'auto', display: 'flex'}} />
        </Box>}
      <ImageList variant="masonry" cols={3} gap={8}>
  {!currentPin && pins.map((item, index) => (
    <ImageListItem key={item.id}>
      <img
        src={item.media.images['150x150'].url}
        alt={item.title}
        onClick={() => handleImageClick(index)}
        loading="lazy"
      />
    </ImageListItem>
  ))}
  </ImageList>

    <Box sx={{ width: '90%', maxWidth: 500, margin: 2 }}>
  <Paper elevation={3} style={{ padding: 24 }} >
            <Typography>Select the Interval</Typography>
            <CheckGroup options={[{ value: 30, label: '30s'}, { value: 60, label: '1m'}, { value: 120, label: '2m'} , { value: 180, label: '3m'}, { value: 300, label: '5m'} ]} value={intervalValue} onChange={handleIntervalChange} />
      <Box mt={2}>
      <Button variant="contained" color="success" onClick={onRedoClick} >
        Re-Do Session
      </Button>
      </Box>
      </Paper>
      </Box>
    </>
}

export default Summary