import React from "react";
import { SubmitHandler, set, useForm } from "react-hook-form";
import instance from "@/config/axios.config";
import { TiTick } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import FormInputDate from "@/components/atoms/input/date";
import FormInputSelect from "@/components/atoms/input/select";
import { FormControl, IconButton } from "@mui/material";

interface Props {
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
}

const FilterForm: React.FC<Props> = ({ setFilters }) => {
  const { handleSubmit, control, reset } = useForm<FilterType>({
    defaultValues: {
      queriedFrom: null,
      queriedUpto: null,
      quotedFrom: null,
      quotedUpto: null,
      type: null,
      assignedTo: null,
    },
  });

  const [engineers, setEngineers] = React.useState([]);

  React.useEffect(() => {
    instance.get("/users").then((res) => {
      setEngineers(
        res.data.map((user: any) => ({
          id: user.id,
          name: user.fullname,
        }))
      );
    });
  }, []);

  const onSubmit: SubmitHandler<FilterType> = (data) => {
    setFilters((filters) => ({ ...filters, ...data }));
  };

  return (
    <FormControl className="grid grid-cols-[1fr,1fr,1fr,auto] gap-4 place-items-center">
      <div className="flex flex-col gap-2">
        <FormInputDate
          name="queriedFrom"
          label="Queried From"
          control={control}
        />
        <FormInputDate
          name="queriedUpto"
          label="Queried Upto"
          control={control}
        />
      </div>
      <div className="flex flex-col gap-2">
        <FormInputDate
          name="quotedFrom"
          label="Quoted From"
          control={control}
        />
        <FormInputDate
          name="quotedUpto"
          label="Quoted Upto"
          control={control}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <FormInputSelect
          name="type"
          id="type"
          label="Job Type"
          control={control}
          options={[
            { id: "SERVICES", name: "Services" },
            { id: "SPARES SUPPLY", name: "Spare Supply" },
          ]}
        />
        <FormInputSelect
          name="assignedTo"
          label="Service Cordinator"
          control={control}
          options={engineers}
          id="engineer"
        />
      </div>

      <div className="flex flex-col gap-2">
        <IconButton
          aria-label="apply"
          size="medium"
          className="hover:bg-transparent"
          onClick={handleSubmit(onSubmit)}
        >
          <TiTick className="text-2xl text-green-700" />
        </IconButton>
        <IconButton
          aria-label="delete"
          size="medium"
          className="hover:bg-transparent"
          onClick={() => {
            reset();
          }}
        >
          <MdDelete className="text-2xl text-red-700" />
        </IconButton>
      </div>
    </FormControl>
  );
};

export default FilterForm;
