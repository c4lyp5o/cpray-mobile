const simpleLogger = (ctx, msg) => {
  const date = new Date();
  const time = date.toLocaleTimeString();
  const dateStr = date.toLocaleDateString();
  const logStr = `[${dateStr} ${time}] ${ctx}: ${msg || ''}`;
  console.log(logStr);
};

export default simpleLogger;
