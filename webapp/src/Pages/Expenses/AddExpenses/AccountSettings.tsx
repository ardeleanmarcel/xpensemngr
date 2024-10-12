import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { PersonAdd, Settings, Logout } from '@mui/icons-material';
import ContrastIcon from '@mui/icons-material/Contrast';

import { ColorModeContext } from '../../../App';
import { XpmBox } from '../../../components/XpmBox';

export function AccountSettings() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { toggleColorMode } = useContext(ColorModeContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const goToSettingsPage = () => {
    navigate('/settings');
  };
  return (
    <>
      <XpmBox
        sx={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          marginRight: '20px',
        }}
      >
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
          </IconButton>
        </Tooltip>
      </XpmBox>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem disabled onClick={handleClose}>
          <ListItemIcon>{<PersonAdd fontSize="small" />}</ListItemIcon>
          Add another account (coming soon)
        </MenuItem>
        <MenuItem onClick={goToSettingsPage}>
          <ListItemIcon>{<Settings fontSize="small" />}</ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={toggleColorMode}>
          <ListItemIcon>{<ContrastIcon fontSize="small" />}</ListItemIcon>
          Change Theme
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>{<Logout fontSize="small" />}</ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
