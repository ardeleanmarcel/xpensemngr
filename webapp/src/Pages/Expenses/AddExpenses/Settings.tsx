import { XpmCard } from '../../../components/XpmCard';
import { XpmCardContent } from '../../../components/XpmCardContent';

export function Settings() {
  return (
    <XpmCard sx={{ minHeight: '100vh' }}>
      <XpmCardContent>
        <XpmCard sx={{ boxShadow: '4', marginTop: '50px' }}>
          <XpmCardContent>Change Email </XpmCardContent>
        </XpmCard>
        <XpmCard sx={{ boxShadow: '4', marginTop: '50px' }}>
          <XpmCardContent>Change Password</XpmCardContent>
        </XpmCard>
        <XpmCard sx={{ boxShadow: '4', marginTop: '50px' }}>
          <XpmCardContent>Delete Account</XpmCardContent>
        </XpmCard>
      </XpmCardContent>
    </XpmCard>
  );
}
