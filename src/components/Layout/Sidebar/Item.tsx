import { ReactNode, useMemo } from 'react';
import {
  Link,
  LinkProps,
  ListIcon,
  ListItem,
  Text,
  TextProps,
  useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Children } from './menu-items';
import { ReactComponent as DownIcon } from '@/assets/icons/directions/down.svg';
import { ReactComponent as UpIcon } from '@/assets/icons/directions/up.svg';

type CommonProps = {
  isDisabled?: boolean;
};

type ItemWrapper = CommonProps & {
  isActive?: boolean;
  children: ReactNode;
  hasChild: boolean;
  toggle?: () => void;
  onClose?: () => void;
  to?: string;
};

function ItemWrapper(props: ItemWrapper) {
  const customProps: TextProps & LinkProps = {
    fontWeight: 600,
    fontSize: '0.75rem',
    fontFamily: 'Open Sans',
    color: props.isActive ? 'white' : 'other.semiBlack',
    opacity: props.isDisabled ? 0.7 : 1,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  };

  if (props.hasChild || props.isDisabled)
    return (
      <Text
        onClick={props.onClose ?? props.toggle}
        userSelect="none"
        {...customProps}
        cursor={props.isDisabled ? 'not-allowed' : 'pointer'}
      >
        {props.children}
      </Text>
    );

  return (
    <Link as={RouterLink} {...customProps} to={props.to}>
      {props.children}
    </Link>
  );
}

type ItemProps = CommonProps & {
  child: Children;
  isChild?: boolean;
  isSidebarOpen?: boolean;
  onClose?: () => void;
};

function Item({ child, isChild, isDisabled, onClose, isSidebarOpen = true }: ItemProps) {
  const { pathname } = useLocation();
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: Array.isArray(child.id) ? child.id.some((id) => pathname.includes(id)) : false,
  });

  const isActive = useMemo(() => {
    if (child.to) {
      const cleanCurrentPath = pathname.replaceAll('/', '');
      const cleanLink = child.to.replaceAll('/', '');
      if (!Array.isArray(child.id)) return cleanCurrentPath.includes(child.id);
      return cleanCurrentPath.startsWith(cleanLink);
    }
    return false;
  }, [pathname, child]);

  return (
    <>
      <ItemWrapper
        hasChild={!!child.children}
        to={child.to}
        isActive={isActive}
        isDisabled={isDisabled}
        toggle={() => (isDisabled ? undefined : onToggle())}
        onClose={onClose}
      >
        <ListItem
          ml={isChild && isSidebarOpen ? 3 : 0}
          rounded="2"
          bg={isActive ? 'blue.500' : 'white'}
          p={1}
          mb={2}
          position="relative"
          style={{ display: 'flex' }}
          w={!isSidebarOpen && !child.children ? 'fit-content' : undefined}
        >
          <ListIcon as={child.icon} h={5} w={5} marginInlineEnd={isSidebarOpen ? '2' : 0} />
          {isSidebarOpen ? child.label : null}
          <span style={{ position: 'absolute', right: 5 }}>
            {child.children ? isOpen ? <DownIcon /> : <UpIcon /> : null}
          </span>
        </ListItem>
      </ItemWrapper>

      {isOpen && child.children
        ? child.children?.map((grandchild) => (
            <Item
              isSidebarOpen={isSidebarOpen}
              key={grandchild.label}
              isChild
              child={grandchild}
              isDisabled={isDisabled}
            />
          ))
        : null}
    </>
  );
}

export { Item };
