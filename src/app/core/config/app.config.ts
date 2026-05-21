import { authGuard } from '../guards/auth.guard';
import { guestGuard } from '../guards/guest.guard';
import { roleGuard } from '../guards/role.guard';
import { Shell } from '../../layout/shell/shell';
import { PlaceholderPage } from '../../shared/ui/placeholder-page/placeholder-page';

export { authGuard, guestGuard, roleGuard, Shell, PlaceholderPage };
