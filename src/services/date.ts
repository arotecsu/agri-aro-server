function getDateExtensive(date) {
  let extensive = "";
  extensive += date.getDate() + " de ";

  switch (date.getMonth() + 1) {
    case 1:
      extensive += "Janeiro";
      break;
    case 2:
      extensive += "Fevereiro";
      break;
    case 3:
      extensive += "Março";
      break;
    case 4:
      extensive += "Abril";
      break;
    case 5:
      extensive += "Maio";
      break;
    case 6:
      extensive += "Junho";
      break;
    case 7:
      extensive += "Julho";
      break;
    case 8:
      extensive += "Agosto";
      break;
    case 9:
      extensive += "Setembro";
      break;
    case 10:
      extensive += "Outubro";
      break;
    case 11:
      extensive += "Novembro";
      break;
    case 12:
      extensive += "Dezembro";
      break;
  }

  extensive += " de " + date.getFullYear();

  return extensive;
}

function dateToString(date, type = "") {
  if (date == null) return "";
  let year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  //verificar digitos
  month = month.length == 1 ? `0${month}` : month;
  day = day.length == 1 ? `0${day}` : day;

  if (type == "") {
    return `${year}-${month}-${day}`;
  } else if (type == "pt") {
    return `${day}/${month}/${year}`;
  }
}

function inInterval(value, interval) {
  if (interval == undefined) {
    return true;
  }

  if (value <= interval.max && value >= interval.min) {
    return true;
  }
  return false;
}

export { getDateExtensive, dateToString, inInterval };
