export default (link) => {
  const win = window.open(link, "_blank");
  win.focus();
};
