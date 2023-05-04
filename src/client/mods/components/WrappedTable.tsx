import { Table } from 'antd';
import styled from 'styled-components';

const WrappedTable = styled(Table)`
  .ant-table-thead .ant-table-cell {
    background-color: ${(props) => props.theme.primary};
    color: #fff;
  }

  .ant-table-small .ant-table-thead > tr > th {
    background-color: ${(props) => props.theme.primary};
  }

  .ant-table-thead th.ant-table-column-has-sorters:hover {
    color: #fff;
    background: ${(props) => props.theme.primary};
    border-color: ${(props) => props.theme.primary};
  }
`;

export default WrappedTable;
