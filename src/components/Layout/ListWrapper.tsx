import { ElementType, ReactNode, useMemo } from 'react';
import * as yup from 'yup';
import { Helmet } from 'react-helmet';
import {
  Button,
  Flex,
  FlexProps,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { generatePath, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Search } from '@/components/Form';
import { Filter, Option } from '@/components/Elements';
import { useFilters } from '@/hooks/useFilters';

const schema = yup.object().shape({
  search: yup.string().required('Informe algo a ser buscado'),
});

type FormType = yup.InferType<typeof schema>;

const defaultValues: FormType = {
  search: '',
};

type Tab = {
  title?: string;
  tab: string;
  component: ReactNode;
};

type ListWrapper<T> = {
  title: string;
  registrationRoute?: string;
  ButtonAction?: ElementType;
  filters?: Option<T>[];
  FilterElement?: ElementType;
  addButtonText?: string;
  List?: ElementType | null;
  searchField?: keyof T | string;
  tabs?: Tab[];
  containerProps?: FlexProps;
};

function ListWrapper<T>({
  registrationRoute,
  title,
  addButtonText,
  filters = [],
  searchField = 'name', // TODO: Turn this prop required
  List = null,
  ButtonAction,
  FilterElement,
  containerProps,
  tabs = [],
}: ListWrapper<T>) {
  const navigate = useNavigate();
  const { currentTab, addFilter, changeTab, removeFilter } = useFilters();
  const { control, handleSubmit, reset } = useForm<FormType>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const memoTitle = useMemo(
    () => (tabs.length > 0 ? tabs[currentTab]?.title ?? tabs[currentTab].tab : title),
    [title, currentTab, tabs]
  );

  function onSubmit({ search }: FormType) {
    addFilter(searchField as never, 'ilike', search);
  }

  function onCleanSearchField() {
    reset();
    removeFilter(searchField as never);
  }

  return (
    <Flex direction="column" w="full" m={5} overflowX="hidden" {...containerProps}>
      <Flex
        direction="row"
        justifyContent="space-between"
        w="full"
        mb={tabs.length ? 0 : '16px'}
        alignItems="center"
      >
        <Helmet>
          <title>{memoTitle}</title>
        </Helmet>
        <Heading color="gray.800" fontSize="1.25rem">
          {memoTitle}
        </Heading>
        <Flex direction="row" alignItems="center">
          <Search
            control={control}
            name="search"
            handleSearch={handleSubmit(onSubmit)}
            clearSearch={onCleanSearchField}
          />
          {FilterElement ? (
            <FilterElement />
          ) : filters.length > 0 ? (
            <Filter options={filters} />
          ) : null}

          {ButtonAction ? (
            <ButtonAction />
          ) : registrationRoute ? (
            <Button
              colorScheme="blue"
              rounded="full"
              px={10}
              leftIcon={<AddIcon />}
              onClick={() => {
                navigate(generatePath(registrationRoute));
              }}
            >
              {addButtonText || 'Novo'}
            </Button>
          ) : null}
        </Flex>
      </Flex>

      {tabs.length > 0 ? (
        <Tabs
          flex={1}
          display="flex"
          flexDirection="column"
          colorScheme="blue"
          onChange={changeTab}
          defaultIndex={currentTab}
          isLazy
        >
          <TabList>
            {tabs.map(({ tab }) => (
              <Tab key={tab} fontSize="0.75rem">
                {tab}
              </Tab>
            ))}
          </TabList>

          <TabPanels flexGrow={1} display="flex">
            {tabs.map(({ component }, idx: number) => (
              <TabPanel key={idx} flexGrow={1} px={0} pb={0} display="flex">
                {component}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      ) : (
        List && <List />
      )}
    </Flex>
  );
}

export { ListWrapper };
