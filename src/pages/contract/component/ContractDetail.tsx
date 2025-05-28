import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState } from "react";

interface IContractDetailViewerProps {
  open: boolean;
  onClose: () => void;
  pdfUrl: string;
}

export const ContractDetailViewer: React.FC<IContractDetailViewerProps> = ({ open, onClose, pdfUrl }) => {
  const [loading, setLoading] = useState(true);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        Visualização do Contrato
        <IconButton
          aria-label="fechar"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading && <p>Carregando documento...</p>}
        <iframe
          src={pdfUrl}
          title="Contrato PDF"
          width="100%"
          height="600px"
          onLoad={() => setLoading(false)}
          style={{ border: 'none' }}
        />
      </DialogContent>
    </Dialog>
  );
};
