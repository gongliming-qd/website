import * as XLSX from 'xlsx'

export const getExcel = (data: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(data)
    reader.onload = async (ev:any) => {
      let data = ev.target.result
      const workbook = XLSX.read(data, { type: 'binary', cellDates: true })
      const wsname = workbook.SheetNames[0]
      const getData = XLSX.utils.sheet_to_json(workbook.Sheets[wsname])
      // console.log(getData, '899')
      resolve(getData)
    }
    reader.onerror = ()=>{
      reject('上传失败')
    }
  })
}

export const exportByExcel = (jsonData:any, header:any) => {
  let arrAll:any = [];
  jsonData.forEach((item:any) => {
    let arr:any = [];
    header.forEach((item1:any) => {
      let singleData = ''
      for (let i in item) {
        if (item1 === i) {
        }else{
          singleData = item[item1]
        }
      }
      arr.push(singleData);
    });
    arrAll.push(arr);
  });
  const workbook = XLSX.utils.book_new();

  const worksheetName = "SheetJS";
  const worksheetData = [header, ...arrAll];
  // Converts an array of arrays of JS data to a worksheet.
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);

  // At this point, out.xls will have been downloaded.
  // Output format determined by filename
  XLSX.writeFile(workbook, "out.xls");
}