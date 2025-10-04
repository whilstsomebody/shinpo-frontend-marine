import React, { useEffect, useState } from "react";
import {
  Select,
  Menu,
  Button,
  MenuItem,
  IconButton,
  Box,
  Autocomplete,
  TextField,
  Checkbox,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { IoFilter } from "react-icons/io5";
import { PiFileCsv } from "react-icons/pi";
import { getEngineers } from "@/utils/getEngineers";
import getServices from "@/utils/getServices";
import dayjs from "dayjs";

interface TableHeaderProps {
  onCSVDownload: () => void;
  onFilterChange: (filterState: FilterState) => void;
}

type FilterState = {
  assignedTo: number;
  services: number[];
  queriedFrom: Date | null;
  queriedUpto: Date | null;
};

const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col w-64 p-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
};

const TableHeader = ({ onCSVDownload, onFilterChange }: TableHeaderProps) => {
  const [serviceCoordinators, setServiceCoordinators] = useState<
    {
      id: number;
      fullname: string;
    }[]
  >([]);
  const [services, setServices] = useState<
    {
      id: number;
      title: string;
    }[]
  >([]);
  const [servicesLoading, setServicesLoading] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    assignedTo: 0,
    services: [],
    queriedFrom: null,
    queriedUpto: null,
  });

  useEffect(() => {
    const fetchEngineers = async () => {
      const engineers = await getEngineers();
      setServiceCoordinators(
        engineers.map((engineer) => {
          return { id: engineer.id, fullname: engineer.fullname };
        })
      );
    };
    fetchEngineers();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      const services = await getServices();
      setServices(
        services.map((service: any) => ({
          id: service.id,
          title: service.title,
        }))
      );
      setServicesLoading(false);
    };
    fetchServices();
  }, []);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleApplyFilters = () => {
    onFilterChange(filterState);
    handleClose();
  };
  const handleClearFilters = () => {
    setFilterState({
      assignedTo: 0,
      services: [],
      queriedFrom: null,
      queriedUpto: null,
    });
    onFilterChange({
      assignedTo: 0,
      services: [],
      queriedFrom: null,
      queriedUpto: null,
    });
  };

  return (
    <div className="flex justify-between my-4">
      <Button
        variant="outlined"
        onClick={handleClick}
        sx={{
          color: "black",
          borderColor: "black",
          borderRadius: "5px",
          padding: "5px 10px",
          fontSize: "14px",
          fontWeight: "bold",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "black",
            color: "white",
          },
        }}
      >
        <IoFilter size={20} />
        Filter
      </Button>
      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={open}
        sx={{
          width: "100%",
          "& .MuiMenu-paper": {
            padding: "1rem",
          },
        }}
        onClose={handleClose}
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <FilterSection title="Service Coordinator">
            <Select
              value={filterState.assignedTo}
              onChange={(e) =>
                setFilterState({
                  ...filterState,
                  assignedTo: e.target.value as number,
                })
              }
              defaultValue={0}
              variant="outlined"
              sx={{ width: "100%" }}
              size="small"
            >
              <MenuItem value={0}>All</MenuItem>
              {serviceCoordinators.map((engineer) => (
                <MenuItem key={engineer.id} value={engineer.id}>
                  {engineer.fullname}
                </MenuItem>
              ))}
            </Select>
          </FilterSection>
          <FilterSection title="Services">
            <Autocomplete
              options={services}
              multiple
              disableCloseOnSelect
              getOptionLabel={(option) => option.title}
              size="small"
              value={services.filter((service) =>
                filterState.services.includes(service.id)
              )}
              loading={servicesLoading}
              renderInput={(params) => <TextField {...params} />}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  {option.title}
                </li>
              )}
              onChange={(_, value) => {
                setFilterState({
                  ...filterState,
                  services: value.map((service) => service.id),
                });
              }}
            />
          </FilterSection>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <FilterSection title="Queried From">
            <DatePicker
              format="DD/MM/YYYY"
              value={filterState.queriedFrom}
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
              {...(filterState.queriedFrom && {
                value: dayjs(filterState.queriedFrom as Date),
              })}
              onChange={(value: any) => {
                if (!value)
                  return setFilterState({ ...filterState, queriedFrom: null });
                const os = value.$d.getTimezoneOffset() * 60 * 1000;
                const date = new Date(value.$d.getTime() - os);
                setFilterState({ ...filterState, queriedFrom: date });
              }}
            />
          </FilterSection>
          <FilterSection title="Queried Upto">
            <DatePicker
              format="DD/MM/YYYY"
              value={filterState.queriedUpto}
              {...(filterState.queriedUpto && {
                value: dayjs(filterState.queriedUpto as Date),
              })}
              onChange={(value: any) => {
                if (!value)
                  return setFilterState({ ...filterState, queriedUpto: null });
                const os = value.$d.getTimezoneOffset() * 60 * 1000;
                const date = new Date(value.$d.getTime() - os);
                setFilterState({ ...filterState, queriedUpto: date });
              }}
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
            />
          </FilterSection>
        </Box>
        <div className="flex justify-center items-center gap-5 mt-4">
          <Button
            variant="outlined"
            sx={{
              color: "black",
              borderColor: "black",
              borderRadius: "5px",
              padding: "5px 10px",
              fontSize: "14px",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "black",
                color: "white",
              },
            }}
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "black",
              borderColor: "black",
              borderRadius: "5px",
              padding: "5px 10px",
              fontSize: "14px",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "black",
                color: "white",
              },
            }}
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </Menu>
      <IconButton
        onClick={onCSVDownload}
        sx={{
          color: "black",
          borderColor: "black",
          borderRadius: "5px",
          padding: "5px 10px",
          fontSize: "14px",
          fontWeight: "bold",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "black",
            color: "white",
          },
        }}
      >
        <PiFileCsv size={25} />
      </IconButton>
    </div>
  );
};

export default TableHeader;
