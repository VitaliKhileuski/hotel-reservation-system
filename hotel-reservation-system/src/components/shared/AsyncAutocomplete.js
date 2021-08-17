import { React, useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function AsyncAutocomplete({ request, label }) {
  const [items, setItems] = useState([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChangeValue(value) {
    setValue(value);
  }

  function setCurrentLoading(value) {
    setLoading(value);
  }

  function setNewItems(value) {
    setItems(value);
  }

  useEffect(() => {
    const timeoutId = setTimeout(
      () => request(value, setNewItems, setCurrentLoading),
      400
    );
    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <Autocomplete
      freeSolo={true}
      id="items"
      options={items}
      onInputChange={(event, newInputValue) => {
        handleChangeValue(newInputValue);
      }}
      loading={loading}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    ></Autocomplete>
  );
}
