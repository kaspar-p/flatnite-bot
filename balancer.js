let ready = false;

const available = {
  ready,
};

const changeReadyStatus = (newStatus) => {
  available.ready = newStatus;
};

available.changeReadyStatus = changeReadyStatus;
module.exports = available;
