import Papa from "papaparse";

const EmployeeCsvUpload = ({ onImport }) => {

    const handleFileChange = (event) => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        Papa.parse(file, {

            header: true,

            skipEmptyLines: true,

            complete: (results) => {

                onImport(results.data);

            }

        });

    };

    return (
        <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
        />
    );
};

export default EmployeeCsvUpload;