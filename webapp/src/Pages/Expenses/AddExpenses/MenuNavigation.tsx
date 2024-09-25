import { useState, useEffect } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate, useLocation } from 'react-router-dom';
import { AccountSettings } from './AccountSettings';
import { Box, Stack } from '@mui/material';

interface LinkTabProps {
  label?: string;
}

function LinkTab(props: LinkTabProps) {
  return <Tab {...props} />;
}

export default function MenuNavigation() {
  const [value, setValue] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // Sync the tab index with the current route
  useEffect(() => {
    if (location.pathname === '/add-expenses') {
      setValue(0);
    } else if (location.pathname === '/expenses-dashboard') {
      setValue(1);
    }
  }, [location.pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log('Selected tab index:', newValue);

    // Update the selected tab index:
    setValue(newValue);

    switch (newValue) {
      case 0:
        navigate('/add-expenses');
        break;
      case 1:
        navigate('/expenses-dashboard');
        break;
      default:
        break;
    }
  };

  return (
    <Stack
      sx={{
        width: '100%',
        marginTop: '70px',
        marginBottom: '5px',
        zIndex: '3',
      }}
      boxShadow="3"
      direction="row"
      justifyContent="space-between"
    >
      <Box>
        <Tabs value={value} onChange={handleChange} role="navigation">
          <LinkTab label="Add Expenses" />
          <LinkTab label="Dashboard" />
        </Tabs>
      </Box>
      <AccountSettings />
    </Stack>
  );
}
