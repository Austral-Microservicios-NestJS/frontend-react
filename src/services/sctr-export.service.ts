import ExcelJS from "exceljs";

interface Trabajador {
  tipoDoc?: string;
  nroDoc?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  nombres?: string;
  fechaNacimiento?: string;
  sexo?: string;
  sueldo?: number;
}

interface DetalleSCTR {
  rucEmpresa?: string;
  razonSocial?: string;
  numeroTrabajadores?: number;
  actividadEconomica?: string;
  planillaMensual?: number;
  tipoRiesgo?: string;
  trabajadores?: Trabajador[];
}

const COLOR_PRIMARY = "FF003D5C";
const COLOR_SECONDARY = "FF0066A3";
const COLOR_LIGHT = "FFE8F1F5";
const COLOR_WHITE = "FFFFFFFF";
const COLOR_TEXT = "FF1F2937";
const COLOR_BORDER = "FFD1D5DB";

const fmtDate = (d?: string) => {
  if (!d) return "";
  const [y, m, dd] = d.split("-");
  return y && m && dd ? `${dd}/${m}/${y}` : d;
};

const tipoDocPacificoMap: Record<string, string> = { DNI: "1", CE: "2", PAS: "6" };
const riesgoPacificoMap: Record<string, string> = { BAJO: "003", MEDIO: "002", ALTO: "001" };

/**
 * Aplica estilos al header de una hoja
 */
function styleHeader(row: ExcelJS.Row, color = COLOR_PRIMARY) {
  row.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: COLOR_WHITE } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: COLOR_BORDER } },
      left: { style: "thin", color: { argb: COLOR_BORDER } },
      bottom: { style: "thin", color: { argb: COLOR_BORDER } },
      right: { style: "thin", color: { argb: COLOR_BORDER } },
    };
  });
  row.height = 32;
}

/**
 * Aplica zebra striping y bordes a las filas de datos
 */
function styleDataRows(ws: ExcelJS.Worksheet, startRow: number, endRow: number) {
  for (let r = startRow; r <= endRow; r++) {
    const row = ws.getRow(r);
    const isOdd = (r - startRow) % 2 === 1;
    row.eachCell((cell) => {
      cell.font = { name: "Calibri", size: 10, color: { argb: COLOR_TEXT } };
      cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
      cell.border = {
        top: { style: "thin", color: { argb: COLOR_BORDER } },
        left: { style: "thin", color: { argb: COLOR_BORDER } },
        bottom: { style: "thin", color: { argb: COLOR_BORDER } },
        right: { style: "thin", color: { argb: COLOR_BORDER } },
      };
      if (isOdd) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_LIGHT } };
      }
    });
    row.height = 22;
  }
}

/**
 * Agrega cabecera con titulo y datos de empresa
 */
function addCabeceraEmpresa(ws: ExcelJS.Worksheet, sctr: DetalleSCTR, totalCols: number, titulo: string) {
  // Titulo principal
  ws.mergeCells(1, 1, 1, totalCols);
  const titleCell = ws.getCell(1, 1);
  titleCell.value = titulo;
  titleCell.font = { name: "Calibri", size: 16, bold: true, color: { argb: COLOR_WHITE } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_PRIMARY } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  ws.getRow(1).height = 36;

  // Subtítulo empresa
  ws.mergeCells(2, 1, 2, totalCols);
  const empresaCell = ws.getCell(2, 1);
  empresaCell.value = `${sctr.razonSocial || ""}  |  RUC: ${sctr.rucEmpresa || ""}  |  Riesgo: ${sctr.tipoRiesgo || "—"}`;
  empresaCell.font = { name: "Calibri", size: 11, italic: true, color: { argb: COLOR_PRIMARY } };
  empresaCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_LIGHT } };
  empresaCell.alignment = { vertical: "middle", horizontal: "center" };
  ws.getRow(2).height = 24;

  // Fecha generación
  ws.mergeCells(3, 1, 3, totalCols);
  const fechaCell = ws.getCell(3, 1);
  fechaCell.value = `Generado: ${new Date().toLocaleString("es-PE")}  •  Trabajadores: ${(sctr.trabajadores || []).length}`;
  fechaCell.font = { name: "Calibri", size: 9, color: { argb: "FF6B7280" } };
  fechaCell.alignment = { vertical: "middle", horizontal: "right" };
  ws.getRow(3).height = 18;

  // Fila vacía separadora
  ws.getRow(4).height = 8;
}

/**
 * Agrega fila de totales al final
 */
function addFooterTotales(ws: ExcelJS.Worksheet, trab: Trabajador[], colSueldo: number, totalCols: number) {
  const lastRow = ws.lastRow!.number + 1;
  const totalSueldo = trab.reduce((s, t) => s + (Number(t.sueldo) || 0), 0);

  // Total de planilla
  ws.mergeCells(lastRow, 1, lastRow, colSueldo - 1);
  const labelCell = ws.getCell(lastRow, 1);
  labelCell.value = "TOTAL PLANILLA MENSUAL:";
  labelCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: COLOR_WHITE } };
  labelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_SECONDARY } };
  labelCell.alignment = { vertical: "middle", horizontal: "right" };

  const totalCell = ws.getCell(lastRow, colSueldo);
  totalCell.value = totalSueldo;
  totalCell.numFmt = '"S/" #,##0.00';
  totalCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: COLOR_WHITE } };
  totalCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_SECONDARY } };
  totalCell.alignment = { vertical: "middle", horizontal: "right" };

  // Si hay columnas después del sueldo, rellenar
  if (colSueldo < totalCols) {
    ws.mergeCells(lastRow, colSueldo + 1, lastRow, totalCols);
    const fillCell = ws.getCell(lastRow, colSueldo + 1);
    fillCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_SECONDARY } };
  }

  ws.getRow(lastRow).height = 28;
}

/**
 * Descarga un workbook como archivo
 */
async function downloadWorkbook(wb: ExcelJS.Workbook, filename: string) {
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const sctrExportService = {
  async exportar(formato: string, sctr: DetalleSCTR) {
    const wb = new ExcelJS.Workbook();
    wb.creator = "Austral AI Corredores de Seguros";
    wb.lastModifiedBy = "Austral CRM";
    wb.created = new Date();
    wb.modified = new Date();

    const trab = sctr.trabajadores || [];
    const nombre = (sctr.razonSocial || sctr.rucEmpresa || "sctr").replace(/[^a-zA-Z0-9]/g, "_").substring(0, 25);

    const formatos: Record<string, () => Promise<void>> = {
      rimac: async () => {
        const ws = wb.addWorksheet("Registro de Trabajadores", { properties: { tabColor: { argb: "FFE60012" } } });
        const headers = ["PRODUCTO", "SEDE", "TIPO DOCUMENTO", "NRO DOCUMENTO", "APELLIDO PATERNO", "APELLIDO MATERNO", "PRIMER NOMBRE", "SEGUNDO NOMBRE", "FECHA NACIMIENTO", "SEXO", "IMPORTE SUELDO BRUTO"];
        addCabeceraEmpresa(ws, sctr, headers.length, "TRAMA SCTR - RIMAC SEGUROS");
        ws.columns = [
          { width: 12 }, { width: 12 }, { width: 16 }, { width: 16 }, { width: 22 }, { width: 22 },
          { width: 18 }, { width: 18 }, { width: 16 }, { width: 8 }, { width: 18 },
        ];
        const headerRow = ws.addRow(headers);
        styleHeader(headerRow);
        const startRow = headerRow.number + 1;
        trab.forEach((t) => {
          const nombres = (t.nombres || "").split(" ");
          ws.addRow(["SCTR", "PRINCIPAL", t.tipoDoc || "DNI", t.nroDoc || "", t.apellidoPaterno || "", t.apellidoMaterno || "", nombres[0] || "", nombres.slice(1).join(" ") || "", fmtDate(t.fechaNacimiento), t.sexo === "F" ? "F" : "M", Number(t.sueldo) || 0]);
        });
        const lastDataRow = ws.lastRow!.number;
        styleDataRows(ws, startRow, lastDataRow);
        // Format sueldo column
        for (let r = startRow; r <= lastDataRow; r++) ws.getCell(r, 11).numFmt = '"S/" #,##0.00';
        addFooterTotales(ws, trab, 11, headers.length);
        await downloadWorkbook(wb, `SCTR_RIMAC_${nombre}.xlsx`);
      },

      mapfre: async () => {
        const ws = wb.addWorksheet("Trabajadores", { properties: { tabColor: { argb: "FFE30613" } } });
        const headers = ["TipDoc", "NumDoc", "ApePaterno", "ApeMaterno", "Nombres", "Nombre Completo", "Nacimiento", "Sueldo"];
        addCabeceraEmpresa(ws, sctr, headers.length, "TRAMA SCTR - MAPFRE PERU");
        ws.columns = [{ width: 10 }, { width: 16 }, { width: 22 }, { width: 22 }, { width: 24 }, { width: 38 }, { width: 14 }, { width: 16 }];
        const headerRow = ws.addRow(headers);
        styleHeader(headerRow);
        const startRow = headerRow.number + 1;
        trab.forEach((t) => {
          ws.addRow([t.tipoDoc || "DNI", t.nroDoc || "", t.apellidoPaterno || "", t.apellidoMaterno || "", t.nombres || "", `${t.apellidoPaterno || ""} ${t.apellidoMaterno || ""} ${t.nombres || ""}`.trim(), fmtDate(t.fechaNacimiento), Number(t.sueldo) || 0]);
        });
        const lastDataRow = ws.lastRow!.number;
        styleDataRows(ws, startRow, lastDataRow);
        for (let r = startRow; r <= lastDataRow; r++) ws.getCell(r, 8).numFmt = '"S/" #,##0.00';
        addFooterTotales(ws, trab, 8, headers.length);
        await downloadWorkbook(wb, `SCTR_MAPFRE_${nombre}.xlsx`);
      },

      pacifico: async () => {
        const ws = wb.addWorksheet("Modelo de Trama", { properties: { tabColor: { argb: "FF00549F" } } });
        const headers = ["Tipo Doc", "Documento", "Ap. Paterno", "Ap. Materno", "Primer Nombre", "Segundo Nombre", "Fecha Nac.", "Sexo", "Nacionalidad", "Ocupacion", "Dpto", "Prov", "Distrito", "Direccion", "RUC", "Nivel Riesgo", "Mes Planilla", "Moneda Sueldo", "Sueldo", "Condicion", "Proy/Obra", "Tipo Producto", "Tipo Mov", "Inicio Vigencia", "Moneda Prima", "Cod Asegurado"];
        addCabeceraEmpresa(ws, sctr, headers.length, "TRAMA SCTR - PACIFICO SEGUROS");
        ws.columns = headers.map(() => ({ width: 14 }));
        const headerRow = ws.addRow(headers);
        styleHeader(headerRow);
        const startRow = headerRow.number + 1;
        const now = new Date();
        const mesPlanilla = String(now.getMonth() + 1).padStart(2, "0") + now.getFullYear();
        const inicioVig = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
        trab.forEach((t) => {
          const nombres = (t.nombres || "").split(" ");
          ws.addRow([
            tipoDocPacificoMap[t.tipoDoc || "DNI"] || "1", t.nroDoc || "", t.apellidoPaterno || "", t.apellidoMaterno || "",
            nombres[0] || "", nombres.slice(1).join(" ") || "", fmtDate(t.fechaNacimiento), t.sexo === "F" ? "F" : "M",
            "PERU", "", "", "", "", "", sctr.rucEmpresa || "", riesgoPacificoMap[sctr.tipoRiesgo || "ALTO"] || "001",
            mesPlanilla, "1", Number(t.sueldo) || 0, "P", "", "SP", "N", inicioVig, "1", "",
          ]);
        });
        const lastDataRow = ws.lastRow!.number;
        styleDataRows(ws, startRow, lastDataRow);
        for (let r = startRow; r <= lastDataRow; r++) ws.getCell(r, 19).numFmt = '"S/" #,##0.00';
        addFooterTotales(ws, trab, 19, headers.length);
        await downloadWorkbook(wb, `SCTR_PACIFICO_${nombre}.xlsx`);
      },

      positiva: async () => {
        const ws = wb.addWorksheet("Planilla", { properties: { tabColor: { argb: "FF003366" } } });
        const headers = ["Nombres", "Paterno", "Materno", "TipoTrab", "TipoDoc", "NroDoc", "Sexo", "EstadoCivil", "Direccion", "Telefono", "FechaNac", "Correo", "Moneda", "Remuneracion"];
        addCabeceraEmpresa(ws, sctr, headers.length, "TRAMA SCTR - LA POSITIVA");
        ws.columns = [{ width: 24 }, { width: 22 }, { width: 22 }, { width: 12 }, { width: 10 }, { width: 14 }, { width: 8 }, { width: 12 }, { width: 24 }, { width: 14 }, { width: 14 }, { width: 24 }, { width: 10 }, { width: 16 }];
        const headerRow = ws.addRow(headers);
        styleHeader(headerRow);
        const startRow = headerRow.number + 1;
        trab.forEach((t) => {
          ws.addRow([t.nombres || "", t.apellidoPaterno || "", t.apellidoMaterno || "", "EMPLEADO", t.tipoDoc || "DNI", t.nroDoc || "", t.sexo || "M", "", "", "", fmtDate(t.fechaNacimiento), "", "PEN", Number(t.sueldo) || 0]);
        });
        const lastDataRow = ws.lastRow!.number;
        styleDataRows(ws, startRow, lastDataRow);
        for (let r = startRow; r <= lastDataRow; r++) ws.getCell(r, 14).numFmt = '"S/" #,##0.00';
        addFooterTotales(ws, trab, 14, headers.length);
        await downloadWorkbook(wb, `SCTR_POSITIVA_${nombre}.xlsx`);
      },

      sanitas: async () => {
        const ws = wb.addWorksheet("Afiliados", { properties: { tabColor: { argb: "FF008542" } } });
        const headers = ["Nombres*", "ApPaterno*", "ApMaterno", "TipoTrabajador*", "PaisNacimiento", "TipoIdent*", "NumIdent*", "Sexo*", "FecNacimiento*", "Moneda*", "Remuneracion*", "EstadoCivil*", "Ocupacion"];
        addCabeceraEmpresa(ws, sctr, headers.length, "TRAMA SCTR - SANITAS / CRECER");
        ws.columns = headers.map(() => ({ width: 16 }));
        const headerRow = ws.addRow(headers);
        styleHeader(headerRow);
        const startRow = headerRow.number + 1;
        trab.forEach((t) => {
          ws.addRow([t.nombres || "", t.apellidoPaterno || "", t.apellidoMaterno || "", "EMPLEADO", "PERU", t.tipoDoc || "DNI", t.nroDoc || "", t.sexo || "M", fmtDate(t.fechaNacimiento), "PEN", Number(t.sueldo) || 0, "", ""]);
        });
        const lastDataRow = ws.lastRow!.number;
        styleDataRows(ws, startRow, lastDataRow);
        for (let r = startRow; r <= lastDataRow; r++) ws.getCell(r, 11).numFmt = '"S/" #,##0.00';
        addFooterTotales(ws, trab, 11, headers.length);
        await downloadWorkbook(wb, `SCTR_SANITAS_${nombre}.xlsx`);
      },

      estandar: async () => {
        // 2 hojas: Empresa + Trabajadores con diseño completo
        const wsEmp = wb.addWorksheet("Empresa", { properties: { tabColor: { argb: "FF003D5C" } } });
        wsEmp.columns = [{ width: 28 }, { width: 50 }];
        wsEmp.mergeCells("A1:B1");
        wsEmp.getCell("A1").value = "FICHA SCTR - DATOS DE LA EMPRESA";
        wsEmp.getCell("A1").font = { name: "Calibri", size: 16, bold: true, color: { argb: COLOR_WHITE } };
        wsEmp.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_PRIMARY } };
        wsEmp.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };
        wsEmp.getRow(1).height = 36;

        const empData = [
          ["RUC Empresa", sctr.rucEmpresa ?? "—"],
          ["Razon Social", sctr.razonSocial ?? "—"],
          ["N° Trabajadores", String(trab.length || sctr.numeroTrabajadores || 0)],
          ["Planilla Mensual", sctr.planillaMensual ? `S/ ${Number(sctr.planillaMensual).toLocaleString("es-PE", { minimumFractionDigits: 2 })}` : "—"],
          ["Actividad Economica", sctr.actividadEconomica ?? "—"],
          ["Tipo de Riesgo", sctr.tipoRiesgo ?? "—"],
          ["Total Planilla (calculada)", `S/ ${trab.reduce((s, t) => s + (Number(t.sueldo) || 0), 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`],
        ];
        empData.forEach(([k, v], i) => {
          const row = wsEmp.addRow([k, v]);
          const isOdd = i % 2 === 1;
          row.getCell(1).font = { name: "Calibri", size: 11, bold: true, color: { argb: COLOR_PRIMARY } };
          row.getCell(2).font = { name: "Calibri", size: 11, color: { argb: COLOR_TEXT } };
          row.eachCell((cell) => {
            cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
            cell.border = { top: { style: "thin", color: { argb: COLOR_BORDER } }, left: { style: "thin", color: { argb: COLOR_BORDER } }, bottom: { style: "thin", color: { argb: COLOR_BORDER } }, right: { style: "thin", color: { argb: COLOR_BORDER } } };
            if (isOdd) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_LIGHT } };
          });
          row.height = 24;
        });

        // Hoja 2: Trabajadores
        const ws = wb.addWorksheet("Trabajadores", { properties: { tabColor: { argb: "FF0066A3" } } });
        const headers = ["#", "TIPO_DOCUMENTO", "NRO_DOCUMENTO", "APELLIDO_PATERNO", "APELLIDO_MATERNO", "PRIMER_NOMBRE", "FECHA_NACIMIENTO", "SEXO", "IMPORTE_SUELDO_BRUTO"];
        addCabeceraEmpresa(ws, sctr, headers.length, "NOMINA DE TRABAJADORES SCTR");
        ws.columns = [{ width: 6 }, { width: 16 }, { width: 16 }, { width: 22 }, { width: 22 }, { width: 24 }, { width: 16 }, { width: 8 }, { width: 18 }];
        const headerRow = ws.addRow(headers);
        styleHeader(headerRow);
        const startRow = headerRow.number + 1;
        trab.forEach((t, i) => {
          ws.addRow([i + 1, t.tipoDoc || "DNI", t.nroDoc || "", t.apellidoPaterno || "", t.apellidoMaterno || "", t.nombres || "", fmtDate(t.fechaNacimiento), t.sexo || "M", Number(t.sueldo) || 0]);
        });
        const lastDataRow = ws.lastRow!.number;
        styleDataRows(ws, startRow, lastDataRow);
        for (let r = startRow; r <= lastDataRow; r++) {
          ws.getCell(r, 1).alignment = { vertical: "middle", horizontal: "center" };
          ws.getCell(r, 9).numFmt = '"S/" #,##0.00';
        }
        addFooterTotales(ws, trab, 9, headers.length);
        await downloadWorkbook(wb, `SCTR_${nombre}.xlsx`);
      },
    };

    const fn = formatos[formato] || formatos.estandar;
    await fn();
  },
};
