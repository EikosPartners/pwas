let jslinq = require("jslinq");

// {date: DateObj, severity: int 1-5, raisedBy: int, project: string}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
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
  let year = getRandomInt(2016, 2018);
  let month = getRandomInt(1, 12);
  let day = getRandomInt(1, 27);
  let hour = getRandomInt(0, 24);
  let minute = getRandomInt(0, 60);
  let seconds = getRandomInt(0, 60);

  return new Date(Date.UTC(year, month, day, hour, minute, seconds));
}

function randomElement(array) {
  let i = getRandomInt(0, array.length);
  return array[i];
}

let uniqueId = 1000;

function generateDataObj() {
  let raisedBy = randomElement(userIds);
  let date = randomDate();
  let project = randomElement(projectNames);
  let severity = getRandomInt(1, 6);

  return {
    date: date,
    raisedBy: raisedBy,
    project: project,
    severity: severity,
    id: uniqueId
  };
}

exports.generateDataSet = length => {
  const dataSet = [];
  for (let i = 0; i < length; i++) {
    dataSet.push(generateDataObj());
    uniqueId += 1;
  }

  let sorted = jslinq(dataSet)
    .orderBy(i => i.date)
    .toList();

  return sorted;
};

exports.updateDataSet = data => {
  data.splice(0, 100);
  let newData = exports.generateDataSet(100);
  data = data.concat(newData);
  return data;
};
