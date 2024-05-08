import React, { ElementType } from 'react';
import * as yup from 'yup';
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

type ListWrapper<T> = {
  title: string;
  registrationRoute?: string;
  ButtonAction?: ElementType;
  filters?: Option<T>[];
  FilterElement?: ElementType;
  addButtonText?: string;
  List?: ElementType | null;
  searchField?: string;
  tabListTitle?: string[];
  tabList?: string[];
  tabComponents?: React.JSX.Element[];
  containerProps?: FlexProps;
};

function ListWrapper<T>({
  registrationRoute,
  title,
  addButtonText,
  filters = [],
  tabListTitle = [],
  searchField = 'name', // TODO: Turn this prop required
  List = null,
  ButtonAction,
  FilterElement,
  tabList = [],
  tabComponents = [],
  containerProps,
}: ListWrapper<T>) {
  const navigate = useNavigate();
  const { currentTab, addFilter, changeTab, removeFilter } = useFilters();
  const { control, handleSubmit, reset } = useForm<FormType>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

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
        mb={tabList.length ? 0 : '16px'}
        alignItems="center"
      >
        <Heading color="gray.800" fontSize="1.25rem">
          {tabListTitle.length ? tabListTitle[currentTab] : title}
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

      {tabList.length ? (
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
            {tabList.map((item) => (
              <Tab key={item} fontSize="0.75rem">
                {item}
              </Tab>
            ))}
          </TabList>

          <TabPanels flexGrow={1} display="flex">
            {tabComponents.map((component, idx: number) => (
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
