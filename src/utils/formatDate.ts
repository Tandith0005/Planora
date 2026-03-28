
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatFee = (fee: number): string => {
  if (fee === 0) return "Free";
  return `৳${fee.toLocaleString()}`;
};