interface VendorFormType {
  id: number;
  address: string;
  name: any;
  email: any;
  description: any;
  publishedAt: any;
  bankname: any;
  bankcountry: any;
  accountname: any;
  accountnumber: any;
  swiftcode: any;
  ibannumber: any;
  payterms: any;
  paymethod: any;
  freightterms: any;
  ownership: any;
  declaration: boolean;
  filled: boolean;
  hash: string;
  categories: number[];
}

interface VendorType {
  id: number;
  address: string;
  name: string;
  email: string;
  description: string;
  salescontact: ContactType;
  accountscontact: ContactType;
  emergencycontact: ContactType;
  bankname: string;
  bankcountry: string;
  accountname: string;
  accountnumber: string;
  swiftcode: string;
  ibannumber: string;
  payterms: string;
  paymethod: string;
  freightterms: string;
  ownership: string;
  services: ServiceType[];
}
