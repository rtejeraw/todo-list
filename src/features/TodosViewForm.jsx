function preventRefresh() {}

function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  return (
    <form onSubmit={() => preventRefresh()}>
      <div>
        <label>Search todos:</label>
        <input
          type="text"
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            setQueryString('');
          }}
        >
          Clear
        </button>
      </div>
      <div>
        <label>Sort by</label>
        <select
          value={sortField.value}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>
        <label>Direction</label>
        <select
          value={sortDirection.value}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </form>
  );
}

export default TodosViewForm;
