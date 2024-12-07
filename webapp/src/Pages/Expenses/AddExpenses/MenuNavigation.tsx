import { useState, useEffect } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate, useLocation } from 'react-router-dom';
import { AccountSettings } from './AccountSettings';
import { Box, Stack } from '@mui/material';
import { useUser } from '../../../contexts/user/user.context';

interface LinkTabProps {
  label?: string;
}

function LinkTab(props: LinkTabProps) {
  return <Tab {...props} />;
}

export default function MenuNavigation() {
  const [value, setValue] = useState(0);
  const { user } = useUser();

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

  const handleTabChange = (...args: [React.SyntheticEvent, unknown]) => {
    const newValue = args[1];

    if (typeof newValue !== 'number') {
      throw new Error('newValue must be a number');
    }

    setValue(newValue);

    switch (newValue) {
      case 0:
        navigate('/add-expenses');
        break;
      case 1:
        navigate('/expenses-dashboard');
        break;
      case 2:
        navigate('/expense-labels');
        break;
      default:
        break;
    }
  };

  if (!user) {
    return null;
  }

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
        <Tabs value={value} onChange={handleTabChange} role="navigation">
          <LinkTab label="Add Expenses" />
          <LinkTab label="Dashboard" />
          <LinkTab label="Labels" />
        </Tabs>
      </Box>
      <AccountSettings />
    </Stack>
  );
}
