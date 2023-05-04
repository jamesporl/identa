import React, { ReactNode, useContext } from 'react';
import {
  Breadcrumb, Button, Col, Pagination, Row, Space,
} from 'antd';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import LIST_LIMIT from 'client/core/utils/constants/LIST_LIMIT';
import SheetContext from 'client/core/mobx/Sheet';

const Wrapper = styled.div`
  background-color: #fff;
  padding: 1rem;

  .ant-row {
    align-items: flex-end;
  }

  .left {
    .ant-breadcrumb {
      font-size: 12px;
    }
    .title {
      font-weight: 500;
      font-size: 1.2rem;
      line-height: 1;
    }
  }
  .pages {
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }
`;

type PageHeaderProps = {
  actions: ReactNode[];
  showFilterBtn: boolean;
  pagination?: {
    onChange?: (newPage: number) => void,
  }
};

function PageHeader({ actions, pagination, showFilterBtn }: PageHeaderProps) {
  const router = useRouter();

  const sheetCtx = useContext(SheetContext);

  const readySheets = sheetCtx.sheets.filter((s) => s.title && s.asPath);

  let breadcrumbs = (
    <Breadcrumb>
      <Breadcrumb.Item>...</Breadcrumb.Item>
    </Breadcrumb>
  );

  if (readySheets?.length) {
    breadcrumbs = (
      <Breadcrumb>
        {readySheets.map(({ title, asPath = '#' }, index) => {
          if (index < sheetCtx.sheets.length - 1) {
            return (
              <Breadcrumb.Item
                key={`${asPath}_${index}`} // eslint-disable-line react/no-array-index-key
                onClick={() => sheetCtx.clickBreadcrumb(index)}
              >
                <Link href={asPath}>
                  {title}
                </Link>
              </Breadcrumb.Item>
            );
          }
          return <Breadcrumb.Item key={(asPath ?? '') + title}>{title}</Breadcrumb.Item>;
        })}
      </Breadcrumb>
    );
  }

  const handleChangeListPage = (page: number) => {
    sheetCtx.setSheetProperty('page', page);
    pagination?.onChange?.(page);
  };

  const handleChangePage = (page: number) => {
    const prevSheet = sheetCtx.sheets[sheetCtx.sheets.length - 2];
    const link = (prevSheet.activeDocLinks || [])[page - 1];
    sheetCtx.setSheetProperty('page', page);
    router.push(link.href);
  };

  let paginationComp = null;
  if (pagination && sheetCtx.sheet?.totalCount) {
    paginationComp = (
      <Pagination
        simple
        current={sheetCtx.sheet?.page}
        total={sheetCtx.sheet?.totalCount}
        pageSize={LIST_LIMIT}
        onChange={handleChangeListPage}
      />
    );
  } else if (sheetCtx.sheets?.length > 1) {
    const prevSheet = (sheetCtx.sheets || [])[sheetCtx.sheets.length - 2];
    if ((prevSheet?.activeDocLinks || []).length > 1 && sheetCtx.sheet?.page) {
      paginationComp = (
        <Pagination
          simple
          current={sheetCtx.sheet.page}
          total={(prevSheet?.activeDocLinks || []).length}
          pageSize={1}
          onChange={handleChangePage}
        />
      );
    }
  }

  let filterBtn = null;
  if (showFilterBtn) {
    filterBtn = (
      <div className="filter-btn">
        <Button onClick={() => sheetCtx.setIsFilterDrawerOpen(true)}>
          <SearchOutlined />
          <FilterOutlined />
        </Button>
      </div>
    );
  }

  return (
    <Wrapper>
      <Row>
        <Col sm={9}>
          <div className="left">
            <div className="breadcrumbs">{breadcrumbs}</div>
            <div className="title">{sheetCtx.sheet?.title || '...'}</div>
          </div>
        </Col>
        <Col sm={6}>
          <div className="pages">{paginationComp}</div>
        </Col>
        <Col sm={9}>
          <div className="actions">
            <Space size={4}>
              {actions}
              {filterBtn}
            </Space>
          </div>
        </Col>
      </Row>
    </Wrapper>
  );
}

PageHeader.propTypes = {
  actions: PropTypes.node,
  pagination: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
  }),
  showFilterBtn: PropTypes.bool,
};

PageHeader.defaultProps = {
  actions: null,
  pagination: null,
  showFilterBtn: false,
};

export default observer(PageHeader);
