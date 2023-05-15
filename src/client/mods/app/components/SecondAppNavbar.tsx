import { PlusOutlined } from '@ant-design/icons';
import { Menu, Button, Space } from 'antd';
import { observer } from 'mobx-react';
import Link from 'next/link';
import ModalContext from 'client/core/mobx/Modal';
import React, { useContext } from 'react';
import styled from 'styled-components';
import UIContext from 'client/core/mobx/UI';
import SheetContext from 'client/core/mobx/Sheet';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #efefef;
  background-color: #fff;
  z-index: 999;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px -2px;
  height: 40px;
  top: 0;
  padding: 0 3rem;

  .secondappnavbar-left {
    display: flex;
    align-items: center;
    width: 100%;
    flex-grow: 1;

    .app-menu {
      flex-grow: 1;
      padding-left: 1rem;

      .ant-menu {
        line-height: 40px;
      }
    }
  }
`;

const MENU_ITEMS = [
  {
    label: 'Patients',
    key: 'patients',
    href: '/app/patients',
  },
  {
    label: 'Calendar',
    key: 'calendar',
    href: '/app/calendar',
  },
];

function SecondAppNavbar() {
  const uiCtx = useContext(UIContext);

  const modalCtx = useContext(ModalContext);

  const sheetCtx = useContext(SheetContext);

  const handleClickAddPatientBtn = () => {
    modalCtx.openModal('addPatientForm', 'Add Patient', {}, { width: 500, footer: false });
  };

  const handleClickAddVisitsBtn = () => {
    modalCtx.openModal('addVisitsForm', 'Add Visit', {}, { width: 700, footer: false });
  };

  const handleClickMenu = (ev: { key: string }) => {
    const menu = MENU_ITEMS.find((m) => m.key === ev.key);
    if (menu) {
      sheetCtx.resetSheets(menu.href);
    }
  };

  return (
    <Wrapper>
      <div className="secondappnavbar-left">
        <div className="app-menu">
          <Menu
            onClick={handleClickMenu}
            mode="horizontal"
            selectedKeys={[uiCtx.selectedMenuKey]}
          >
            {MENU_ITEMS.map((m) => (
              <Menu.Item key={m.key}>
                <Link href={m.href}>{m.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </div>
      <div className="secondappnavbar-right">
        <Space size={8}>
          <Button
            icon={<PlusOutlined />}
            size="small"
            onClick={handleClickAddVisitsBtn}
            type="text"
          >
            Add Visit
          </Button>
          <Button
            icon={<PlusOutlined />}
            size="small"
            onClick={handleClickAddPatientBtn}
            type="text"
          >
            Add Patient
          </Button>
        </Space>
      </div>
    </Wrapper>
  );
}

export default observer(SecondAppNavbar);
