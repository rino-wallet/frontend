export function getWalletColor(isEnterprise = false): { main: string; light: string; } {
  const colors = ["from-orange-900", "to-orange-800", "from-orange-200"];
  const enterpriseColors = ["from-blue-900", "to-blue-800", "from-blue-300", "to-blue-100"];

  if (!isEnterprise) {
    return {
      main: `bg-gradient-to-r ${colors[0]} ${colors[1]}`,
      light: `bg-gradient-to-r ${colors[2]}`,
    };
  }
  return {
    main: `bg-gradient-to-r ${enterpriseColors[0]} ${enterpriseColors[1]}`,
    light: `bg-gradient-to-r ${enterpriseColors[2]} ${enterpriseColors[3]}`,
  };
}
