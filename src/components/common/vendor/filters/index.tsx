import Button from "@/components/atoms/button";
import FormInputAutoComplete from "@/components/atoms/input/auto-complete";
import instance from "@/config/axios.config";
import parseAttributes from "@/utils/parse-data";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoFilter } from "react-icons/io5";

export type VendorFilterType = {
  categories: VendorType["services"];
};

const VendorFilters = ({
  setFilters,
}: {
  setFilters: (filters: VendorFilterType) => void;
}) => {
  const [filters, showFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const { control, watch } = useForm<VendorFilterType>({
    defaultValues: {
      categories: [],
    },
  });

  const selectedCategories = watch("categories") as ServiceType[];

  useEffect(() => {
    setFilters({
      categories: selectedCategories,
    });
  }, [selectedCategories]);

  useEffect(() => {
    instance
      .get("/services?pagination[page]=1&pagination[pageSize]=1000")
      .then((res) => {
        setCategories(parseAttributes(res.data.data));
      });
  }, []);

  return (
    <>
      <button
        className="flex mb-3 border gap-1 items-center px-2 py-1 hover:bg-gray-200 rounded-md w-max"
        onClick={() => showFilters(!filters)}
      >
        <IoFilter />
        Filters
      </button>
      {filters && (
        <FormInputAutoComplete
          label="Categories"
          options={categories}
          control={control}
          title="categories"
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      )}
    </>
  );
};

export default VendorFilters;
