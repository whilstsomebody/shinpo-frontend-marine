import React, { ElementType } from "react";
import { Step, StepLabel, Stepper, Typography } from "@mui/material";
import clsx from "clsx";

interface StepsProperties {
  steps: Array<{ label: string; icon: ElementType }>;
  activeStep: number;
}

const Steps: React.FC<StepsProperties> = ({ steps, activeStep }) => {
  return (
    <div className="w-full mb-6">
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel
              StepIconComponent={({ active, completed }) => (
                <div
                  className={clsx(
                    active
                      ? "bg-primary-bright-blue text-white"
                      : "text-gray-400",
                    "flex flex-col items-center justify-center text-center rounded-full w-20 h-20"
                  )}
                >
                  {active ? (
                    <step.icon className="text-white" />
                  ) : (
                    <step.icon className="text-gray-400" />
                  )}
                  <Typography
                    variant="caption"
                    className={`${active ? "text-primary" : "text-gray-400"}`}
                  >
                    {step.label}
                  </Typography>
                </div>
              )}
            />
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default Steps;
