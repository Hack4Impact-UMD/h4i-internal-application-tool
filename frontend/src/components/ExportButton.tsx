import { mkConfig, generateCsv, download } from "export-to-csv";
import { Button } from "./ui/button";
import { throwErrorToast } from "./toasts/ErrorToast";

type Primitive = string | number | boolean | undefined | null;
type FlatRecord = Record<string, Primitive>;

interface CsvButtonProps<FlatRecord> {
  data: FlatRecord[]; // this requires a "flattened" list of objects, i.e. no inner objects or lists
  filename?: string;
  label?: string;
  className?: string;
}

export function ExportButton<T extends FlatRecord>({
  data,
  filename = "h4i",
  label = "Export as CSV",
  className = "self-end",
}: CsvButtonProps<T>) {
  const handleDownload = () => {
    if (!data || data.length === 0) {
      throwErrorToast("No data to export!");
      return;
    }

    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename,
    });

    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  return (
    <Button className={className} onClick={handleDownload}>
      {label}
    </Button>
  );
}
