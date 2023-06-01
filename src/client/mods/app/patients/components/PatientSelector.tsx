import React, { useState } from 'react';
import debounce from 'lodash/debounce';
import { Select } from 'antd';
import trpc from 'utils/trpc';
import SelectValue from 'client/core/utils/_types/SelectValue';

interface PatientSelectorProps {
  onChange?: (value?: SelectValue) => void;
  value?: SelectValue; // eslint-disable-line react/require-default-props
}

function PatientSelector({ onChange, value }: PatientSelectorProps) {
  const [searchString, setSearchString] = useState('');

  const patients = trpc.practicePatients.patients.useQuery({ page: 1, pageSize: 10, searchString });

  const options = (patients.data?.nodes || []).map((pt) => ({
    value: pt._id, label: pt.name,
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

PatientSelector.defaultProps = {
  onChange: () => undefined,
};

export default PatientSelector;
