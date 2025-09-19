import { useState } from 'react';
import { useEffect } from 'react';
import styles from './TodosViewForm.module.css';

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
    <form onSubmit={() => preventRefresh()} className={styles.form}>
      <div className={styles['criteria-group']}>
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
      </div>
      <div className={styles['criteria-group']}>
        <div className={styles['criteria-group']}>
          <label>Sort by</label>
          <select
            value={sortField.value}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
          </select>
        </div>
        <div className={styles['criteria-group']}>
          <label>Direction</label>
          <select
            value={sortDirection.value}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </form>
  );
}

export default TodosViewForm;
