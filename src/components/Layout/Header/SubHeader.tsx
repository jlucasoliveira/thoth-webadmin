import { Button, ButtonProps, Flex, Heading, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { ElementType, ReactNode, SyntheticEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { capitalize } from '@/utils/format';
import { SaveDialog } from './SaveDialog';

type SubHeader = {
  onClick: (e?: SyntheticEvent) => void;
  id?: string;
  isEdit?: boolean;
  DeleteButton?: ElementType<{ id: string }>;
  title: string;
  loading?: boolean;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  hideDefaultActions?: boolean;
  SaveButton?: ElementType<ButtonProps>;
  isEditDisabled?: boolean;
  isHiddenSaveButton?: boolean;
  goBack?: () => void;
  mb?: number;
};

function SubHeader({
  onClick,
  id,
  title,
  isEdit,
  loading,
  leftActions,
  rightActions,
  DeleteButton,
  SaveButton,
  isEditDisabled = false,
  hideDefaultActions = false,
  isHiddenSaveButton = false,
  mb = 5,
  goBack,
}: SubHeader) {
  const navigate = useNavigate();
  if (!goBack) goBack = () => navigate(-1);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();

  return (
    <Flex direction="row" justifyContent="space-between" alignItems="center" w="full" mb={mb}>
      <Heading color="gray.800" fontSize="20px" textTransform="capitalize">
        <IconButton aria-label="Voltar" icon={<ArrowBackIcon />} variant="ghost" onClick={goBack} />
        {title}
      </Heading>
      <Helmet>
        <title>{capitalize(title)}</title>
      </Helmet>
      <Flex direction="row" alignItems="center">
        {leftActions}
        {hideDefaultActions ? null : (
          <>
            {id && !isEdit ? (
              DeleteButton ? (
                <DeleteButton id={id} />
              ) : null
            ) : (
              <Button onClick={goBack} variant="link" isDisabled={loading}>
                Cancelar
              </Button>
            )}
            {isEdit || !id ? (
              isHiddenSaveButton ? null : (
                <SaveDialog
                  onClick={onClick}
                  loading={loading}
                  isEdit={isEdit}
                  Button={SaveButton ? (props) => <SaveButton {...props} /> : undefined}
                />
              )
            ) : (
              <Button
                isLoading={loading}
                colorScheme="blue"
                rounded="full"
                isDisabled={isEditDisabled}
                px={10}
                ml={5}
                onClick={() => {
                  setSearchParams((params) => {
                    params.set('edit', '');
                    return params;
                  });
                }}
              >
                Editar
              </Button>
            )}
          </>
        )}
        {rightActions}
      </Flex>
    </Flex>
  );
}

export { SubHeader };
