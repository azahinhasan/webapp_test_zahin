import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const NavBar: React.FC = () => {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleLogout = () => {
    Cookies.remove('access-token')
    Cookies.remove('csrf-token')
    window.location.reload()
  }

  const menuItems = [
    { text: 'Timeline', path: '/' },
    { text: 'My Profile', path: '/me' },
  ]

  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open)

  const navigateTo = (path: string) => {
    navigate(path)
    setDrawerOpen(false)
  }

  return (
    <AppBar position="fixed" sx={{ top: 0 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Murmur App
        </Typography>

        <IconButton
          color="inherit"
          onClick={toggleDrawer(true)}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {menuItems.map(({ text, path }) => (
            <Button key={text} color="inherit" onClick={() => navigateTo(path)}>
              {text}
            </Button>
          ))}
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: 200 }}>
          {menuItems.map(({ text, path }) => (
            <ListItem
              component="div"
              key={text}
              onClick={() => navigateTo(path)}
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}
          <ListItem onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  )
}

export default NavBar
