const ExcelJS = require('exceljs');

async function comparerFichiersExcel(oldFilePath, newFilePath, outputFilePath) {
    const workbookOld = new ExcelJS.Workbook();
    const workbookNew = new ExcelJS.Workbook();

    await Promise.all([workbookOld.xlsx.readFile(oldFilePath), workbookNew.xlsx.readFile(newFilePath)]);

    const worksheetOld = workbookOld.worksheets[0];
    const worksheetNew = workbookNew.worksheets[0];

    const diffWorkbook = new ExcelJS.Workbook();
    const diffWorksheet = diffWorkbook.addWorksheet('Diff');

    // Parcourir chaque cellule et comparer les valeurs
    worksheetOld.eachRow({ includeEmpty: true }, (row, rowNum) => {
        row.eachCell({ includeEmpty: true }, (cell, colNum) => {
            const oldValue = cell.value;
            const newValue = worksheetNew.getCell(rowNum, colNum).value;

            if (oldValue !== newValue) {
                // Écrire les valeurs dans la feuille de calcul de différences
                const diffCell = diffWorksheet.getCell(rowNum, colNum);
                diffCell.value = `Old: ${oldValue}, New: ${newValue}`;

                // Colorer la cellule en rouge
                diffCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF0000' } // Rouge
                };
            }
        });
    });

    // Enregistrer les modifications dans un nouveau fichier Excel
    await diffWorkbook.xlsx.writeFile(outputFilePath);
    console.log('Comparaison terminée. Les différences ont été enregistrées dans', outputFilePath);
}
