import React, { useEffect } from "react";
import DashboardLayout from "@/components/layout";
import VendorDetailForm from "@/components/common/vendor/forms/vendor-detail";
import instance from "@/config/axios.config";
import { useRouter } from "next/router";
import parseAttributes from "@/utils/parse-data";
import Loading from "@/components/atoms/loading";
import Button from "@/components/atoms/button";

const VendorDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = React.useState<VendorType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);

  useEffect(() => {
    id &&
      instance
        .get(`/vendors/${id}?populate=*`)
        .then((res) => {
          setData(parseAttributes(res.data.data));
        })
        .catch((err) => {
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DashboardLayout header sidebar>
      {isError ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-semibold">Vendor not found</h1>
          <Button
            onClick={() => router.push("/vendor")}
            className="mt-4 bg-red-500 hover:bg-red-600"
          >
            Go back
          </Button>
        </div>
      ) : (
        <>
          <h1 className="text-center font-bold text-2xl py-2 bg-[#fb5913] rounded-full text-white">
            VIEW VENDOR DETAILS
          </h1>
          <VendorDetailForm
            mode="view"
            data={{
              ...data,
              salesName: data?.salescontact?.name,
              salesEmail: data?.salescontact?.mail,
              salesMobile: data?.salescontact?.mobile,
              accountsName: data?.accountscontact?.name,
              accountsEmail: data?.accountscontact?.mail,
              accountsMobile: data?.accountscontact?.mobile,
              emergencyName: data?.emergencycontact?.name,
              emergencyEmail: data?.emergencycontact?.mail,
              emergencyMobile: data?.emergencycontact?.mobile,
            }}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default VendorDetailsPage;
