/* eslint-disable operator-linebreak */
import {
  observable, action, toJS, makeObservable,
} from 'mobx';
import { uniqueId, set } from 'lodash';
import { createContext } from 'react';

interface SheetProps {
  key?: string;
  pathname?: string;
  asPath?: string;
  activeDocLinks?: {
    _id: string;
    href: string;
  }[];
  filter?: any;
  defaultFilter?: any;
  title?: string;
  page?: number;
  totalCount?: number;
}

/*
  Sheets API

  Patients / Patient / Encounters / Encounter / Clinic

  Sheet Props
  - pageTitle
  - totalCount
  - asPath
  - url
  - currentPage
  - pageUrls
  - search sort and filter state

  - Menu
    - resets all sheets to []
  - Breadcrumbs
    - resets sheets to the clicked breadcrumb
  - AppLayout?
    - Can detect asPath and url changes
  - PageComponent
    - Sets the pageTitle, totalCount, pageUrls, search, sort, and filter state

  Sequence of events

  - User browses to the page
    - AppLayout adds new sheet with asPath and url property

  - A breadcrumb is clicked
    - Deletes sheets

  - Menu is clicked
    - Deletes sheets
*/

class Sheet {
  constructor() {
    makeObservable(this);
  }

  @observable sheets: SheetProps[] = [];

  @observable sheet: SheetProps | null = null;

  @observable isFilterDrawerOpen = false;

  @action setIsFilterDrawerOpen = (value: boolean) => {
    this.isFilterDrawerOpen = value;
  };

  // pathname is like /accounts/[accountId]
  // asPath is like /accounts/5ca761658f6824c2d071702e
  @action addSheet = (pathname: string) => {
    const newSheet = { pathname, page: 1, key: uniqueId('sheet_') };
    if (!this.sheet || (this.sheet && this.sheet.pathname !== pathname)) {
      this.sheets = [...this.sheets, newSheet];
      this.sheet = newSheet;
    }
  };

  @action setSheetProperty = (property: string, value: any) => {
    // lodash set does not seem to work correctly with mobx objects so we transform
    // them first to a JS object
    let updatedSheet = { ...toJS(this.sheet) };

    set(updatedSheet, property, value);

    if (
      property === 'asPath' &&
      this.sheets.length > 1 &&
      this.sheets[this.sheets.length - 2].activeDocLinks?.length
    ) {
      const docIndex = (this.sheets[this.sheets.length - 2]?.activeDocLinks || []).findIndex(
        (l) => l.href === value,
      );
      const page = docIndex + 1;
      updatedSheet = { ...updatedSheet, page };
    }
    if (property === 'defaultFilter' && !this.sheet?.filter) {
      updatedSheet = { ...updatedSheet, filter: value };
    }
    this.sheets = [...(this.sheets.slice(0, this.sheets.length - 1) || []), updatedSheet];
    this.sheet = updatedSheet;
  };

  // trigger reset sheets when a sidebar menu is clicked
  @action resetSheets = (asPath: string) => {
    // say breadcrumbs are orgs / org view and patients menu is clicked
    // we should use the existing sheet for patients
    if (this.sheet?.asPath === asPath) {
      this.sheets = [this.sheet];
    } else {
      this.sheets = [];
      this.sheet = null;
    }
  };

  @action clickBreadcrumb = (index: number) => {
    this.sheet = this.sheets[index];
    this.sheets = this.sheets.slice(0, index + 1);
  };
}

const SheetContext = createContext<Sheet>(new Sheet());

export default SheetContext;
