import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import logo from "@/assets/image/logo.jpg";
import Image from "next/image";
import instance from "@/config/axios.config";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { NotificationContext } from "@/context/NotificationContext";
import FormInputText from "@/components/atoms/input/text";
import AuthContext from "@/context/AuthContext";

const LoginForm = () => {
  const { handleSubmit, control } = useForm();
  const router = useRouter();
  const { setAuthData } = useContext(AuthContext);

  const onSubmit = (data: any) => {
    instance
      .post("/auth/local", data)
      .then((res) => {
        setAuthData(res.data.user);
        localStorage.setItem("token", res.data.jwt);
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.error.message);
      });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex bg-white w-1/2 p-8 rounded-md flex-col gap-4 justify-center items-center text-black"
    >
      <Image src={logo} width={200} height={200} alt="logo" className="" />
      <h1 className="text-left font-bold text-lg uppercase">Login</h1>
      <div className="flex w-full flex-col gap-3">
        <FormInputText
          label="Username or Email"
          control={control}
          name="identifier"
        />
        <FormInputText
          label="Password"
          type="password"
          control={control}
          name="password"
        />
      </div>
      <Button
        type="submit"
        className="bg-primary-bright-blue w-full"
        variant="contained"
        color="primary"
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
