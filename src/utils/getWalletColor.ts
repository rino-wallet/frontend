export function getWalletColor(id: string): { main: string; light: string; } {
  const colors = [
    ["from-orange-900", "to-orange-800", "from-orange-100"],
    ["from-orange-900", "to-orange-800", "from-orange-100"],
    ["from-orange-900", "to-orange-800", "from-orange-100"],
    ["from-orange-900", "to-orange-800", "from-orange-100"],
    ["from-orange-900", "to-orange-800", "from-orange-100"],
    ["from-orange-900", "to-orange-800", "from-orange-100"],
    ["from-orange-900", "to-orange-800", "from-orange-100"],
    ["from-orange-900", "to-orange-800", "from-orange-100"],
    ["from-orange-900", "to-orange-800", "from-orange-100"],
    ["from-orange-900", "to-orange-800", "from-orange-100"],
  ];
  const walletIntId = id.replace(/\D/g, "");
  const colorIndex = parseInt(walletIntId[0]);
  return {
    main: `bg-gradient-to-r ${colors[colorIndex][0]} ${colors[colorIndex][1]}`,
    light: `bg-gradient-to-r ${colors[colorIndex][2]} via-white ${colors[colorIndex][3]} to-white`,
  }
}
