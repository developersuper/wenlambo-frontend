export const runQuery = async (query, dataField) => {
  const res = await fetch(process.env.REACT_APP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      network: localStorage.getItem("network") || "bsc",
    },
    body: JSON.stringify({ query }),
  });
  const { data } = await res.json();
  return dataField ? data[dataField] : data;
};
