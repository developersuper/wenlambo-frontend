import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { orderBy } from "lodash";

import { tokens } from "queries/history";

const SymbolFinder = ({
  currency,
  setCurrency,
  title = "Search Symbol",
  base = "",
  quote = "",
  groupBy,
}) => {
  const [symbol, setSymbol] = useState("");
  const [currencies, setCurrencies] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(async () => {
    if (symbol && symbol.length > 1) {
      setLoading(true);
      console.log(',.,.,.,.,.,.,.,.', symbol, base, quote);
      const allTokens = await tokens({ search: symbol, base, quote });
      console.log('.,.,.,..,.,', allTokens)
      setLoading(false);
      setCurrencies(allTokens);
    }
  }, [symbol]);
  const options = orderBy(
    currencies?.length ? currencies : currency ? [currency] : [],
    [(o) => o.count > 0],
    ["desc"]
  );
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) =>
        `${option.name} - ${option.symbol} (${option.address})`
      }
      groupBy={groupBy}
      style={{ width: "100%" }}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={({ target: { value } }) => setSymbol(value)}
          label={title}
          variant="outlined"
        />
      )}
      value={currency}
      onChange={(event, newValue) => {
        if (newValue)
          setCurrency({
            ...newValue,
            id: newValue?.address,
          });
      }}
    />
  );
};

export default SymbolFinder;
