const simpleLogger = (ctx, msg) => {
  if (
    process.env.EXPO_PUBLIC_BUILD_ENV === 'production' ||
    !process.env.EXPO_PUBLIC_BUILD_ENV
  ) {
    return;
  }

  const date = new Date();
  const time = date.toLocaleTimeString();
  const dateStr = date.toLocaleDateString();
  const logStr = `[${dateStr} ${time}] ${ctx}: ${msg || ''}`;
  console.log(logStr);
};

export default simpleLogger;
