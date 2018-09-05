// {date: DateObj, severity: int 1-5, raisedBy: int, project: string}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const projectNames = [
  'Agent',
  'Gloves',
  'Granite',
  'Planner',
  'Markets',
  'Auto',
  'Cotton',
  'Architect',
  'Canterbury',
  'Cambridge'
];

const userIds = [1034, 4532, 5464, 6787, 4575, 2324, 3465, 6756, 7887, 6354];

function randomDate() {
  let year = 2018;
  let month = getRandomInt(1, 2);
  let day = getRandomInt(1, 27);
  let hour = getRandomInt(0, 24);
  let minute = getRandomInt(0, 60);
  let seconds = getRandomInt(0, 60);
  let milli = getRandomInt(0, 100);

  return new Date(Date.UTC(year, month, day, hour, minute, seconds));
}

function randomElement(array) {
  let i = getRandomInt(0, array.length);
  return array[i];
}

function generateDataObj() {
  let raisedBy = randomElement(userIds);
  let date = randomDate();
  let project = randomElement(projectNames);
  let severity = getRandomInt(1, 6);

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
