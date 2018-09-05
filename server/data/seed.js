// {date: DateObj, severity: int 1-5, raisedBy: int, project: string}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const projectNames = [
  "Agent",
  "Gloves",
  "Granite",
  "Planner",
  "Markets",
  "Auto",
  "Cotton",
  "Architect",
  "Canterbury",
  "Cambridge"
];

const userIds = [1034, 4532, 5464, 6787, 4575, 2324, 3465, 6756, 7887, 6354];

function randomDate() {
  let year = 2018;
  let month = getRandomInt(11) + 1;
  let day = getRandomInt(27) + 1;
  let hour = getRandomInt(6) + 9;
  let minute = getRandomInt(60);
  let seconds = getRandomInt(60);
  let milli = getRandomInt(100);

  return new Date(Date.UTC(year, month, day, hour, minute, seconds));
}

function randomElement(array) {
  let i = getRandomInt(array.length);
  return array[i];
}

function generateDataObj() {
  let raisedBy = randomElement(userIds);
  let date = randomDate();
  let project = randomElement(projectNames);
  let severity = getRandomInt(4) + 1;

  return {
    date: date,
    raisedBy: raisedBy,
    project: project,
    severity: severity
  };
}

exports.generateDataSet = length => {
  const dataSet = [];
  for (let i = 0; i < length; i++) {
    dataSet.push(generateDataObj());
  }
  return dataSet;
};
