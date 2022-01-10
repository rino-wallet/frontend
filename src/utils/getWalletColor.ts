export function getWalletColor(): { main: string; light: string; } {
  const colors =  ["from-orange-900", "to-orange-800", "from-orange-200"];
  return {
    main: `bg-gradient-to-r ${colors[0]} ${colors[1]}`,
    light: `bg-gradient-to-r ${colors[2]}`,
  }
}
