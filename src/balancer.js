const available = {
  ready: false,
};

const changeReadyStatus = (newStatus) => {
  available.ready = newStatus;
};

available.changeReadyStatus = changeReadyStatus;
module.exports = available;
