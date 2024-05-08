import { Theme } from '@chakra-ui/react';

export const paginationStyle = (theme: Theme) => `
  margin: 10px 0px;
  display: flex;
  flex-direction: row;
  list-style-type: none;
  justify-content: center;
  align-items: center;

  li a {
    padding: 5px 10px;
    cursor: pointer;
  }

  li.previous a,
  li.next a,
  li.break a {
    border-color: transparent;
  }

  li.previous,
  li.next {
    margin: 0 10px;
  }

  li.selected a {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-color: ${theme.colors.blue[900]};
    color: ${theme.colors.blue[900]};
    max-width: 25px;
  }

  li.disabled a {
    color: grey;
  }

  li.disable,
  li.disabled a {
    cursor: default;
  }
`;
