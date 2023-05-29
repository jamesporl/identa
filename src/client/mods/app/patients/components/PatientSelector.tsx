import React, { useState } from 'react';
import debounce from 'lodash/debounce';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import trpc from 'utils/trpc';
import SelectValue from 'client/core/utils/_types/SelectValue';

interface PatientSelectorProps {
  onChange?: (value?: SelectValue) => void;
  value?: SelectValue;
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

PatientSelector.propTypes = {
  onChange: PropTypes.func,
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
};

PatientSelector.defaultProps = {
  onChange: () => undefined,
};

export default PatientSelector;
