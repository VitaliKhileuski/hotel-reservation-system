import { React, useState, useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Chip from "@material-ui/core/chip";
import API from "./../../api/";
import ServiceTable from "./../Hotel/ServiceTable";
import { makeStyles } from "@material-ui/core/styles";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
});

export default function ServiceChoice({
  oldSelectedServices,
  getSelectedServices,
}) {
  const classes = useStyles();
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(oldSelectedServices);
  useEffect(() => {
    const loadServices = async () => {
      await API.get("/services")
        .then((response) => response.data)
        .then((data) => {
          if (data !== undefined) {
            data.map((item) => {
              var itemWithQuantity = {
                Serviceid: item.id,
                name: item.name,
                payment: item.payment,
                quantity: 1,
              };
              services.push(itemWithQuantity);
            });
            console.log(services);
          }
        })
        .catch((error) => console.log(error));
    };
    loadServices();
  }, []);
  useEffect(() => {
    if (selectedServices.length !== 0) {
      getSelectedServices(selectedServices);
    }
  }, [selectedServices]);

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        limitTags={2}
        id="checkboxes-tags-demo"
        options={services}
        disableCloseOnSelect
        defaultValue={selectedServices}
        getOptionLabel={(option) => option.name}
        getOptionSelected={(option, value) => option.name === value.name}
        onChange={(event, value) => setSelectedServices(value)}
        renderTags={(options, getTagProps) =>
          options
            .slice(0, 2)
            .map((option) => (
              <Chip
                label={option.name}
                color="primary"
                variant="outlined"
                {...getTagProps({})}
              />
            ))
        }
        renderOption={(option, { selected }) => (
          <>
            {option.name} {option.payment}
            <Checkbox
              icon={icon}
              color="primary"
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
          </>
        )}
        style={{ width: "30%", margin: 20 }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Service"
            placeholder="write to find service"
          />
        )}
      />
      <ServiceTable serviceList={selectedServices}></ServiceTable>
    </div>
  );
}
