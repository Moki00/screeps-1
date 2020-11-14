const Logger = {
  info,
  warning,
  error,
};

function info(text: string): void {
  console.log(colorText(`Info: ${text}`, severityColors.info));
}

function warning(text: string): void {
  console.log(colorText(`Warning: ${text}`, severityColors.warning));
}

function error(text: string): void {
  console.log(colorText(`Error: ${text}`, severityColors.error));
}

function colorText(text: string, color: string): string {
  return `<span style="color: ${color}">${text}</span>`;
}

const LogSeverity = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
};

const severityColors = {
  [LogSeverity.INFO]: "SkyBlue",
  [LogSeverity.WARNING]: "Gold",
  [LogSeverity.ERROR]: "Tomato",
};

export default Logger;
