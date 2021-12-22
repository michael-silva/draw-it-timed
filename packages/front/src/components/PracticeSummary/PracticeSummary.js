import { AppBar, Button, IconButton, ImageList, ImageListItem, Toolbar, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom'


const Summary = ({ pins, onClose }) => {
    const [viewIndex, setViewIndex] = useState(-1)
    const currentPin = viewIndex === -1 ? null : pins[viewIndex]
    
    const handleImageClick = (index) => {
        setViewIndex(index)
    }

    const handleCloseClick = (index) => {
        setViewIndex(-1)
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
        {currentPin && 
        <img src={currentPin.media.images.originals.url} />}
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
    </>
}

export default Summary