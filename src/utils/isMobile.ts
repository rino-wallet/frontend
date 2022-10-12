export const isMobile = (userAgent?: string): boolean => /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent?.toLowerCase() || navigator.userAgent.toLowerCase());
