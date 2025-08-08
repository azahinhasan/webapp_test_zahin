import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const NavBar: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const menuItems = [
    { text: 'Timeline', path: '/' },
    { text: 'People', path: '/users' },
    { text: 'My Profile', path: '/my-profile' },
  ]

  const handleLogout = () => {
    Cookies.remove('access-token')
    Cookies.remove('csrf-token')
    window.location.reload()
  }

  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open)

  const navigateTo = (path: string) => {
    navigate(path)
    if (isMobile) setDrawerOpen(false)
  }

  return (
    <>
      <AppBar position="fixed" sx={{ top: 0 }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigateTo('/')}
            aria-label="Go to Timeline"
          >
            Murmur App
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={toggleDrawer(true)}
                aria-label="Open navigation menu"
                aria-haspopup="true"
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {menuItems.map(({ text, path }) => {
                const isActive = location.pathname === path
                return (
                  <Button
                    key={text}
                    color={'inherit'}
                    variant={'text'}
                    onClick={() => navigateTo(path)}
                    sx={{
                      mx: 0.5,
                      fontWeight: isActive ? 'bold' : '',
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {text}
                  </Button>
                )
              })}
              <Tooltip title="Logout">
                <IconButton
                  color="inherit"
                  onClick={handleLogout}
                  aria-label="Logout"
                  sx={{ ml: 1 }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{
          keepMounted: true,
        }}
        aria-label="Navigation drawer"
      >
        <Box
          sx={{ width: 240 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={(e) => {
            if (e.key === 'Tab' || e.key === 'Shift') return
            setDrawerOpen(false)
          }}
        >
          <List>
            {menuItems.map(({ text, path }) => {
              const isActive = location.pathname === path
              return (
                <ListItemButton
                  key={text}
                  selected={isActive}
                  onClick={() => navigateTo(path)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <ListItemText primary={text} />
                </ListItemButton>
              )
            })}
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default NavBar
