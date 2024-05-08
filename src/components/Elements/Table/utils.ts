import { EditIcon, ViewIcon } from '@chakra-ui/icons';
import type { Action } from './Actions';

export function generateDefaultActions(viewRoute: string, editRoute?: string): Action[] {
  const view = {
    Icon: ViewIcon,
    label: 'Ver',
    route: viewRoute,
  };

  if (!editRoute) {
    return [view];
  }

  const edit = {
    Icon: EditIcon,
    label: 'Editar',
    route: editRoute,
  };

  return [view, edit];
}
