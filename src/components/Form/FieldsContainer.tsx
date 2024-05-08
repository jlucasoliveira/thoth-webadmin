import { ReactNode, useMemo, CSSProperties, PropsWithChildren } from 'react';
import { Flex, Grid, GridItem, GridProps, Text, TextProps } from '@chakra-ui/react';

type FieldsContainer = {
  templateColumn?: number | string;
  columnGap?: number;
  columnsByRow?: number;
  style?: CSSProperties;
  title?: string;
  titleProps?: TextProps;
  rightButton?: ReactNode;
  gridProps?: GridProps;
};

function FieldsContainer({
  children,
  title,
  columnGap = 5,
  templateColumn = 4,
  columnsByRow = typeof templateColumn === 'number' ? templateColumn : 4,
  style,
  gridProps,
  rightButton,
  titleProps,
}: PropsWithChildren<FieldsContainer>) {
  const groupedFields = useMemo<ReactNode[][]>(() => {
    if (!Array.isArray(children)) return [[children]];
    let step = columnsByRow;
    const batches: ReactNode[][] = [];
    const cleanedChildren = children.filter((child) => !!child).flatMap((child) => child);
    for (let i = 0; i < cleanedChildren.length; i += columnsByRow) {
      batches.push(cleanedChildren.slice(i, step));
      step += columnsByRow;
    }
    return batches;
  }, [children, columnsByRow]);

  return (
    <div style={style}>
      {title ? (
        <Flex direction="row" justifyContent="space-between">
          <Text color="gray.800" fontWeight={600} fontSize="14px" mb="16px" {...titleProps}>
            {title}
          </Text>
          {rightButton || null}
        </Flex>
      ) : null}
      {groupedFields.map((group, idx) => (
        <Grid
          key={idx.toString()}
          templateColumns={
            typeof templateColumn === 'number' ? `repeat(${templateColumn}, 1fr)` : templateColumn
          }
          columnGap={columnGap}
          alignItems="flex-end"
          {...gridProps}
        >
          {group.map((field, index) => (
            <GridItem key={idx.toString() + index.toString()}>{field}</GridItem>
          ))}
        </Grid>
      ))}
    </div>
  );
}

export { FieldsContainer };
