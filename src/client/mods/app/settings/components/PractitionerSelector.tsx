import React, { useState } from 'react';
import debounce from 'lodash/debounce';
import { Select } from 'antd';
import trpc from 'utils/trpc';
import { AccountsFilter } from 'server/mods/practice/admin/api/_types';
import SelectValue from 'client/core/utils/_types/SelectValue';

interface PractitionerSelectorProps {
  onChange?: (value?: SelectValue) => void;
  value?: SelectValue; // eslint-disable-line react/require-default-props
}

function PractitionerSelector({ onChange, value }: PractitionerSelectorProps) {
  const [searchString, setSearchString] = useState('');

  const accounts = trpc.practiceAdmin.accounts.useQuery({
    page: 1,
    pageSize: 10,
    searchString,
    filters: [AccountsFilter.practitioners],
  });

  const options = (accounts.data?.nodes || []).map((ac) => ({
    value: ac._id, label: ac.name,
  }));

  const handleChange = (selectedValue: SelectValue) => {
    if (onChange) {
      onChange(selectedValue);
    }
  };

  const handleSearch = (newSearchString: string) => {
    setSearchString(newSearchString);
  };

  return (
    <Select
      allowClear
      labelInValue
      onChange={handleChange}
      optionFilterProp="label"
      onSearch={debounce(handleSearch, 800)}
      placeholder="Select patient"
      showSearch
      options={options}
      value={value}
      style={{ width: '100%' }}
    />
  );
}

PractitionerSelector.defaultProps = {
  onChange: () => undefined,
};

export default PractitionerSelector;
