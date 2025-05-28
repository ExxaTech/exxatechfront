export interface IContract {
  id: number;
  propertyId: string;
  title: string;
  fileUrl: string;               
  bucketPath: string;            
  signedAt?: string;     
  startDate?: string;
  endDate?: string;       
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'signed' | 'canceled';

  landlord: {
    name: string;
    email: string;
    cpfCnpj: string;
  };
  tenant: {
    name: string;
    email: string;
    cpfCnpj: string;
    avatarUrl?: string;
  };

  history?: {
    date: string;
    action: string; // ex: "upload", "signed", "replaced"
    by: string;
  }[];
}
