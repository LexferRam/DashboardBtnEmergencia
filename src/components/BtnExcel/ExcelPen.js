import React, { useState, useEffect } from "react";
import ExportExcel from "react-export-excel";
import ArchiveOutlinedIcon from "@material-ui/icons/ArchiveOutlined";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import Button from "@material-ui/core/Button";

const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelSheet;
const ExcelColumn = ExportExcel.ExcelColumn;

function Exportarexcel({ rowsPend }) {
  const [jsonSoliPend, setJsonSoliPend] = useState([]);
  useEffect(() => {
    setJsonSoliPend(rowsPend);
    //  alert('Array btnExcel' + JSON.stringify(rowsPend));
  }, [rowsPend]);

  return (
    <div className="btnExportarExcel">
      <ExcelFile
        element={
            <Button
            variant="outlined"
            id="filtro"
            color="primary"
            style={{
                height: "30px !important",
                borderRadius: 50,
                margin: "20px 0px 0px 20px",
                fontSize: 10
              }}
            size="small"
            startIcon={<ArrowDownwardIcon />}
          >
            Excel
        </Button>
        }
        filename="Solicitudes Pendientes"
      >
        <ExcelSheet data={jsonSoliPend} name="solicitudes_pendientes">
          <ExcelColumn label="Nro Solicitud" value="id" />
          <ExcelColumn label="Nro Identificación" value="NUMID" />
          <ExcelColumn label="Nombre" value="NOMBRE" />
          <ExcelColumn label="Estado" value="DESCESTADO" />
          <ExcelColumn label="Ciudad" value="DESCCIUDAD" />

          <ExcelColumn label="Dirección" value="DIRECCION" />
          <ExcelColumn label="Punto de Referencia" value="PUNTOREFERENCIA" />
          <ExcelColumn label="Celular" value="CELULAR" />
          <ExcelColumn label="Telefono Habitación" value="TELEFHAB" />
          <ExcelColumn label="Estatus Solicitud" value="STSSOLI" />

          <ExcelColumn label="Fecha Creación" value="FECSTS" />
          <ExcelColumn label="Nro Cotización" value="CODUSR" />
          <ExcelColumn label="Nombre " value="NOMUSR" />
          <ExcelColumn label="Fecha estatus" value="FECSTS" />

          <ExcelColumn label="Fecha Regstro" value="FECREG" />
          <ExcelColumn label="Empresa" value="EMPRESA" />

          <ExcelColumn label="Servicio Prestado" value="DESCRIPATENCION" />
          <ExcelColumn label="Contactar Asesor" value="INDCONTASESOR" />
        </ExcelSheet>
      </ExcelFile>
    </div>
  );
}

export default Exportarexcel;