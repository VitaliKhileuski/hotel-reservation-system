import { React, useState, useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { makeStyles } from "@material-ui/core/styles";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Chip from "@material-ui/core/chip";
import Button from "@material-ui/core/Button";
import API from "./../../api/";
import ServiceTable from "./ServiceTable";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
  buttons: {
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    marginBottom: 50,
  },
});

export default function ServiceChoice({
  hotelId,
  oldSelectedServices,
  getSelectedServices,
  isEdit,
  checkInDate,
  limitDays,
}) {
  console.log(oldSelectedServices);
  const classes = useStyles();
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(
    JSON.parse(JSON.stringify(oldSelectedServices))
  );
  const [isDisableCU, setIsDisableCU] = useState(
    isEdit ? moment().add(limitDays, "days") > checkInDate : false
  );
  const [rerender, setRerender] = useState(true);

  useEffect(() => {
    const tempServices = [];
    const loadServices = async () => {
      await API.get("/hotels/" + hotelId + "/getServices")
        .then((response) => response.data)
        .then((data) => {
          if (!!data) {
            data.map((item) => {
              let itemWithQuantity = {
                Serviceid: item.id,
                name: item.name,
                payment: item.payment,
                quantity: 1,
              };
              tempServices.push(itemWithQuantity);
            });
            setServices(tempServices);
          }
        })
        .catch((error) => console.log(error));
    };
    loadServices();
  }, [rerender]);

  useEffect(() => {
    if (selectedServices.length !== 0 && !isEdit) {
      getSelectedServices(selectedServices);
    }
  }, [selectedServices]);

  function ccyFormat(num) {
    return `${num.toFixed(2)}`;
  }
  function resetNewData() {
    setSelectedServices(JSON.parse(JSON.stringify(oldSelectedServices)));
    setRerender(true);
  }

  return (
    <>
      <div className={classes.root}>
        <Autocomplete
          multiple
          disabled={isDisableCU}
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
              <Checkbox
                icon={icon}
                color="primary"
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.name} ({ccyFormat(option.payment)})
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
        <ServiceTable
          serviceList={selectedServices}
          isDisableCU={isDisableCU}
          rerender={rerender}
        ></ServiceTable>
      </div>
      {isEdit ? (
        <Grid className={classes.buttons} container spacing={2} direction="row">
          <Grid item>
            <Button
              onClick={resetNewData}
              style={{ minWidth: 100 }}
              variant="contained"
              color="primary"
            >
              Reset
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{ minWidth: 100 }}
              onClick={() => getSelectedServices(selectedServices)}
              color="primary"
              variant="contained"
            >
              Save
            </Button>
          </Grid>
        </Grid>
      ) : (
        ""
      )}
    </>
  );
}
