import { useEffect, useState } from 'react';
import {
  ButtonProps,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  useBoolean,
  useDisclosure,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { AttachmentSigned } from '@/features/attachments/types';
import { useGetAttachment } from '@/features/attachments/api/getAttachment';
import { Loading } from '..';

type Props = {
  title: string;
  isLoading?: boolean;
  file?: File;
  attachment?: AttachmentSigned;
  Button?: React.ElementType<ButtonProps>;
  attachmentId?: string;
  fetch?: boolean;
};

function Preview(props: Props) {
  const [base64, setBase64] = useState<string | undefined>();
  const [imageLoaded, manager] = useBoolean();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const attachment = useGetAttachment({
    id: props.attachmentId,
    config: { enabled: props.fetch && !!props.attachmentId },
  });

  useEffect(() => {
    if (props.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e?.target?.result && e?.total > 0) setBase64(e.target!.result as string);
      };
      reader.readAsDataURL(props.file);
    }
  }, [props.file]);

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody justifyContent="center" alignItems="center" display="flex">
            <Skeleton isLoaded={imageLoaded}>
              <Image
                fit="contain"
                boxSize="400px"
                src={base64 || props.attachment?.url || attachment.data?.url}
                alt={props.title}
                onLoad={manager.on}
              />
            </Skeleton>
          </ModalBody>
        </ModalContent>
      </Modal>
      {props.isLoading || (attachment.isFetching && attachment.isLoading) ? (
        <Loading size="sm" />
      ) : props.attachment?.url || attachment.data?.url || props.file ? (
        props.Button ? (
          <props.Button onClick={onOpen} />
        ) : (
          <IconButton
            aria-label="Ver arquivo"
            variant="ghost"
            icon={<ViewIcon />}
            onClick={onOpen}
          />
        )
      ) : null}
    </>
  );
}

export { Preview };
