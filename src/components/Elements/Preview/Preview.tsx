import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

type Props = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
};

function Preview(props: PropsWithChildren<Props>) {
  return (
    <Modal isCentered isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody justifyContent="center" alignItems="center" display="flex">
          {props.children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export { Preview };
