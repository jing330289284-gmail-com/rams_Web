
/**
 * 勤務->勤務登録 のJS
 * 20201019 謝
 */
export function checkRowData(row){
	for (var i = 0; i < row.cells.length; i++)	{
//		console.log(i);
//		console.log(row.cells[i].classList.remove("dutyRegistration-ErrorData"));
	}
}
export function addRowClass(row, ClassName){
	for (var i = 0; i < row.cells.length; i++)	{
		addCellClass(row.cells[i], ClassName);
	}
}
export function addCellClass(cell, ClassName){
	cell.classList.add(ClassName);
}
export function removeRowAllClass(row){
	var tempClass = "";
	var classCount = 0;
	for (var i = 0; i < row.cells.length; i++)	{
		classCount = row.cells[i].classList.length;
		for (var j = 0; j < classCount; j++)	{
			tempClass = row.cells[i].classList[0];
			row.cells[i].classList.remove(tempClass);
		}
	}
}
