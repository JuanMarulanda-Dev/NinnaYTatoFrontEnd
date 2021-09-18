exports.install = function (Vue) {
  Vue.prototype.getNowDate = () => {
    let date = new Date(); // Or the date you'd like converted.
    let isoDateTime = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
    return isoDateTime.substr(0, 10);
  };

  Vue.prototype.getNowTime = () => {
    let date = new Date(); // Or the date you'd like converted.
    let isoDateTime = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
    return isoDateTime.substr(11, 5);
  };
};
