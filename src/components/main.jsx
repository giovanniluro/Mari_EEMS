import { useState, useMemo, useRef, useEffect } from "react";
import { parse, unparse } from "papaparse";
import { v4 } from "uuid";
import * as S from "./styles";

const createTable = (tableData) => {
  return (
    <>
      <h4>Tabela:</h4>
      <S.TableWrapper>
        <table>
          <tbody>
            {tableData &&
              tableData.map((row, rowIndex) => {
                return (
                  <tr key={v4()}>
                    {row.map((col, colIndex) => (
                      <td
                        style={{
                          fontWeight:
                            colIndex === 0 || rowIndex === 0 ? "bold" : "",
                        }}
                        key={v4()}
                      >
                        {col}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </S.TableWrapper>
    </>
  );
};

const CSVUploader = () => {
  const [firstTable, setFirstTable] = useState(undefined);
  const [fileName1, setFileName1] = useState("");
  const [secondTable, setSecondTable] = useState(undefined);
  const [fileName2, setFileName2] = useState("");
  const [resultTable, setResultTable] = useState(undefined);
  const [headerFiles, setHeaderFiles] = useState(undefined);

  const FirstRenderedTable = useMemo(
    () => createTable(firstTable),
    [firstTable]
  );

  const SecondRenderedTable = useMemo(
    () => createTable(secondTable),
    [secondTable]
  );

  const ResultRenderedTable = useMemo(
    () => createTable(resultTable),
    [resultTable]
  );

  const handleClearApp = () => {
    setFirstTable(undefined);
    setFileName1("");
    setSecondTable(undefined);
    setFileName2("");
    setResultTable(undefined);
    setHeaderFiles(undefined);
  };

  const calculateResultTable = (firstTable, secondTable) => {
    const newResultTable = firstTable.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        if (rowIndex === 0) return col;

        if (colIndex === 0) return col;

        try {
          const firstTableValue = col;
          const secondTableValue = secondTable[rowIndex][colIndex];

          if (firstTableValue && secondTableValue) {
            return Number(firstTableValue) - Number(secondTableValue);
          }

          return "";
        } catch {
          return "";
        }
      });
    });
    setResultTable(newResultTable);
  };

  useEffect(() => {
    if (firstTable && secondTable) {
      try {
        calculateResultTable(firstTable, secondTable);
      } catch (err) {
        console.error("error trying to subtract values", err.message);
        setResultTable(undefined);
      }
    }
  }, [firstTable, secondTable]);

  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null);

  const handleUploadClick = (inputRef) => {
    inputRef.current.click();
  };

  const handleFileChange = (
    event,
    setTableDataFunction,
    setFileNameFunction,
    changeHeaders
  ) => {
    try {
      const file = event.target.files[0];
      setFileNameFunction(file.name);

      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;

        const [headers, waves] = content.split(`"EX Wavelength/EM Wavelength"`);

        if (changeHeaders) {
          setHeaderFiles(headers);
        }

        parse(waves, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => setTableDataFunction(results.data),
        });
      };

      reader.readAsText(file);
    } catch {
      setTableDataFunction(undefined);
    }
  };

  const downloadCSV = (data, filename) => {
    const waves = unparse(data);
    const fileContent = headerFiles + `"EX Wavelength/EM Wavelength"` + waves;

    const file = new Blob([fileContent], { type: "text" });

    if (window.navigator.msSaveOrOpenBlob) {
      // For IE
      window.navigator.msSaveBlob(file, filename);
    } else {
      // For other browsers
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <S.Container>
      <button style={{ width: "100%" }} onClick={handleClearApp}>
        Limpar tudo
      </button>
      <S.InputGroup>
        <S.InputContainer>
          <label>
            <span>Insira o primeiro arquivo EEMs:</span>

            <div>
              <input
                type="file"
                ref={firstInputRef}
                style={{ display: "none" }}
                onChange={(e) =>
                  handleFileChange(e, setFirstTable, setFileName1, true)
                }
              />
              <button onClick={() => handleUploadClick(firstInputRef)}>
                Upload
              </button>
              <span>{fileName1}</span>
            </div>
          </label>

          {firstTable && <>{FirstRenderedTable}</>}
        </S.InputContainer>
      </S.InputGroup>

      <S.InputGroup>
        <S.InputContainer>
          <label>
            <span>Insira o segundo arquivo EEMs:</span>

            <div>
              <input
                type="file"
                ref={secondInputRef}
                style={{ display: "none" }}
                onChange={(e) =>
                  handleFileChange(e, setSecondTable, setFileName2)
                }
              />
              <button onClick={() => handleUploadClick(secondInputRef)}>
                Upload
              </button>
              <span>{fileName2}</span>
            </div>
          </label>

          {secondTable && <>{SecondRenderedTable}</>}
        </S.InputContainer>
      </S.InputGroup>

      {firstTable && secondTable && (
        <S.InputGroup>
          <S.InputContainer>
            <h4>
              Resultado: (Valores da primeira trabela subtraídos dos valores da
              segunda tabela)
            </h4>

            {resultTable && <>{ResultRenderedTable}</>}

            <button
              style={{ marginTop: "1rem" }}
              onClick={() => downloadCSV(resultTable, "resultado.txt")}
            >
              Gerar EEM a partir do resultado
            </button>
          </S.InputContainer>
        </S.InputGroup>
      )}
    </S.Container>
  );
};

export default CSVUploader;
