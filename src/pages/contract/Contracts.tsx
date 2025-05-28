import { Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ListTools } from "../../shared/components";
import { BasePageLayout } from "../../shared/layouts";
import { IContract } from "../../shared/types/Contract";
import { ContractsList } from "./component/ContractList";
import { ContractDetailViewer } from "./component/ContractDetail";

export const Contracts: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState<IContract | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  const handleContractClick = (contract: IContract) => {
    setSelectedContract(contract);
    setViewerOpen(true);
  };

  return (
    <BasePageLayout
      navigation={[
        { description: "Início", path: "/" },
        { description: "Contratos", path: "/contract" },
      ]}
      toolBar={
        <ListTools
          showSearchInput
          searchText={busca}
          whenChangeSearchText={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
        />
      }
    >
      <Grid
        container
        direction="row"
        flexWrap="nowrap"
        justifyContent="flex-start"
        alignItems="stretch"
        height="100%"
      >
        <ContractsList onContractClick={handleContractClick} />
        {selectedContract && (
          <ContractDetailViewer
            open={viewerOpen}
            onClose={() => setViewerOpen(false)}
            pdfUrl={selectedContract?.fileUrl || ""}
          />
        )}
      </Grid>
    </BasePageLayout>
  );
};
