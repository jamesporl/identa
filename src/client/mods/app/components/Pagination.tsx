import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import SheetContext, { ActiveDocLink } from 'client/core/mobx/Sheet';
import { useRouter } from 'next/router';
import LIST_LIMIT from 'client/core/utils/constants/LIST_LIMIT';
import { toNumber } from 'lodash';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${(props) => props.theme.dark5};

  .pages {
    .input {
      &:focus {
        outline: none;
        border-bottom: 1px solid ${(props) => props.theme.dark5};
      }
    }

    margin-right: 4px;
  }

  button {
    padding: 4px;
    background-color: transparent;
    border: none;
    cursor: pointer;

    &:hover {
      color: ${(props) => props.theme.primary};
    }

    &:disabled {
      cursor: not-allowed;
      color: ${(props) => props.theme.dark2};
    }
  }
`;

interface PaginationProps {
  onChangePage?: (newPage: number) => void;
}

function Pagination({ onChangePage }: PaginationProps) {
  const inputPageRef = useRef<HTMLSpanElement>(null);

  const [inputPage, setInputPage] = useState(0);

  const sheetCtx = useContext(SheetContext);

  const router = useRouter();

  let activeDocLinks: ActiveDocLink[] = [];
  if ((sheetCtx.sheets?.length || 0) >= 2) {
    const prevSheet = sheetCtx.sheets[sheetCtx.sheets.length - 2];
    if (prevSheet?.activeDocLinks?.length) {
      activeDocLinks = prevSheet.activeDocLinks;
    }
  }

  let pages = Math.ceil(((sheetCtx.sheet?.totalCount || 0) / LIST_LIMIT));
  if (activeDocLinks.length) {
    pages = activeDocLinks.length;
  }

  const currentPage = sheetCtx.sheet?.page || 0;

  const handleChangePage = useCallback((newPage: number) => {
    if ((sheetCtx.sheets?.length || 0) >= 2) {
      if (activeDocLinks?.length) {
        const link = activeDocLinks[newPage - 1];
        router.push(link.href);
      }
    }
    sheetCtx.setSheetProperty('page', newPage);
    if (typeof onChangePage !== 'undefined') {
      onChangePage(newPage);
    }
  }, [activeDocLinks, onChangePage]);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (inputPageRef.current) {
      inputPageRef.current.innerHTML = currentPage.toString();
      const onInput = (ev: Event) => {
        const { innerHTML } = ev.target as HTMLSpanElement;
        setInputPage(toNumber(innerHTML) || 0);
      };
      const onKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          inputPageRef.current?.blur();
        }
      };
      inputPageRef.current.addEventListener('input', onInput);
      inputPageRef.current.addEventListener('keydown', onKeyDown);
      return () => {
        inputPageRef.current?.removeEventListener('input', onInput);
        inputPageRef.current?.removeEventListener('keydown', onKeyDown);
      };
    }
    return () => undefined;
  }, [inputPageRef, currentPage]);

  const handleClickPrev = useCallback(() => {
    if (sheetCtx.sheet?.page) {
      handleChangePage(sheetCtx.sheet.page - 1);
    }
  }, [sheetCtx.sheet?.page]);

  const handleClickNext = useCallback(() => {
    if (sheetCtx.sheet?.page) {
      handleChangePage(sheetCtx.sheet.page + 1);
    }
  }, [sheetCtx.sheet?.page]);

  const handleBlurPageInput = useCallback(() => {
    if (inputPage > 0 && inputPage <= pages) {
      handleChangePage(inputPage);
    } else {
      setInputPage(currentPage);
      if (inputPageRef.current) {
        inputPageRef.current.innerHTML = currentPage.toString();
      }
    }
  }, [pages, inputPage, inputPageRef]);

  return (
    <Wrapper>
      <div className="pages">
        <span
          className="input"
          ref={inputPageRef}
          onBlur={handleBlurPageInput}
          role="textbox"
          contentEditable
          aria-label="current-page"
        />
        {` / ${pages}`}
      </div>
      <button type="button" onClick={handleClickPrev} disabled={currentPage <= 1}>
        <LeftOutlined />
      </button>
      <button type="button" onClick={handleClickNext} disabled={currentPage >= pages}>
        <RightOutlined />
      </button>
    </Wrapper>
  );
}

Pagination.propTypes = {
  onChangePage: PropTypes.func,
};

Pagination.defaultProps = {
  onChangePage: () => undefined,
};

export default observer(Pagination);
