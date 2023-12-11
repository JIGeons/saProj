import styled from 'styled-components';
import Pagination from 'react-js-pagination';

const CustomPaginationStyled = styled(Pagination)`
  .pagination {
    list-style: none;
    display: flex;
    padding: 0;
    margin: 0;

    .disabled {
      margin-right: 10px;
    }
  }
`;

export default CustomPaginationStyled;