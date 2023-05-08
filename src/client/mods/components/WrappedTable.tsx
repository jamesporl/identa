import { Table } from 'antd';
import styled from 'styled-components';

const WrappedTable = styled(Table)`
  .ant-table-small .ant-table-thead > tr > th {
    color: ${(props) => props.theme.primary};
    font-weight: 700;
    text-transform: uppercase;
  }

  .ant-table-thead th.ant-table-column-has-sorters:hover {
    color: #fff;
    border-color: ${(props) => props.theme.primary};
  }
`;

export default WrappedTable;
