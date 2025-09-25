import { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledCriteriaGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  input {
    border-radius: 6px;
    padding: 0px 10px;
    font-size: 16px;
    padding: 5px;
    border: none;
  }
  select {
    border-radius: 6px;
    padding: 0px 10px;
    font-size: 16px;
    padding: 5px;
    border: none;
  }
  button {
    align-self: stretch;
    padding: 0px 10px;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-size: 16px;
    background-color: green;
    &:hover {
      background-color: darkgreen;
    }
  }
`;

function preventRefresh() {}

function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);
    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);

  return (
    <StyledForm onSubmit={() => preventRefresh()}>
      <StyledCriteriaGroup>
        <label>Search todos:</label>
        <input
          type="text"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            setLocalQueryString('');
          }}
        >
          Clear
        </button>
      </StyledCriteriaGroup>
      <StyledCriteriaGroup>
        <StyledCriteriaGroup>
          <label>Sort by</label>
          <select
            value={sortField.value}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
          </select>
        </StyledCriteriaGroup>
        <StyledCriteriaGroup>
          <label>Direction</label>
          <select
            value={sortDirection.value}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </StyledCriteriaGroup>
      </StyledCriteriaGroup>
    </StyledForm>
  );
}

export default TodosViewForm;
