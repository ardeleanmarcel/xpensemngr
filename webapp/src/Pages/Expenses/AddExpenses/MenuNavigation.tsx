import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate } from 'react-router-dom';

function samePageLinkNavigation(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 || // ignore everything but left-click
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  ) {
    return false;
  }
  return true;
}

interface LinkTabProps {
  label?: string;
  href?: string;
  selected?: boolean;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      onClick={(event) => {
        // Routing libraries handle this, you can remove the onClick handle when using them.
        if (samePageLinkNavigation(event)) {
          event.preventDefault();
        }
      }}
      aria-current={props.selected && 'page'}
      {...props}
    />
  );
}

LinkTab.propTypes = {
  selected: PropTypes.bool,
};

export default function MenuNavigation() {
  const [value, setValue] = React.useState(0);

  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    // event.type can be equal to focus with selectionFollowsFocus.
    if (
      event.type !== 'click' ||
      (event.type === 'click' && samePageLinkNavigation(event))
    ) {
      setValue(newValue);
    }
    switch (newValue) {
      case 0:
        navigate('/add-expenses'); // Navigate to Add Expenses page
        break;
      case 1:
        navigate('/expenses-dashboard'); // Navigate to Dashboard page
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ width: '100%', marginTop: '70px' }} boxShadow="3">
      <Tabs value={value} onChange={handleChange} role="navigation">
        <LinkTab label="Add Expenses" />
        <LinkTab label="Dashboard" />
      </Tabs>
    </Box>
  );
}
