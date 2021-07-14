import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "60%",
    position: "absolute",
    bottom: 0,
    marginBottom: 50,
  },
  button: {
    marginRight: theme.spacing(2),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 45,
  },
}));

function getSteps() {
  return ["Room details", "Choose services", "Payment"];
}

export default function BaseStepper({ changeStep, isValidInfo }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  console.log(activeStep);

  const handleNext = () => {
    let step = activeStep + 1;
    setActiveStep(activeStep + 1);
    changeStep(step);
  };

  const handleBack = () => {
    let step = activeStep - 1;
    setActiveStep(activeStep - 1);
    changeStep(step);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        <div>
          <div className={classes.buttons}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              color="primary"
              variant="contained"
              className={classes.button}
            >
              Back
            </Button>

            {activeStep !== steps.length - 1 ? (
              <Button
                disabled={isValidInfo === false}
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                Next
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
