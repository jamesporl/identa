import React, { useContext } from 'react';
import { Breadcrumb } from 'antd';
import { observer } from 'mobx-react';
import Link from 'next/link';
import SheetContext from 'client/core/mobx/Sheet';

function Breadcrumbs() {
  const sheetCtx = useContext(SheetContext);

  const readySheets = sheetCtx.sheets.filter((s) => s.title && s.asPath);

  const items = (readySheets || []).map(({ title, asPath = '#' }, index) => ({
    title: <Link href={asPath}>{title}</Link>,
    onClick: () => sheetCtx.clickBreadcrumb(index),
  }));

  return <Breadcrumb items={items} separator="&bull;" />;
}

export default observer(Breadcrumbs);
