import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IconButton } from "@mui/material";
import Modal from "@mui/material/Modal";
import CompanyForm from "./form/company";

interface Props {
  callback: () => void;
}

const AddCompany = ({ callback }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton
        aria-label="add"
        size="medium"
        className="hover:bg-transparent"
        onClick={() => setOpen(true)}
      >
        <IoIosAddCircleOutline />
      </IconButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <CompanyForm callback={callback} onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
};

export default AddCompany;
