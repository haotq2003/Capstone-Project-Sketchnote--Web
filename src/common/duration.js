const formatDuration = (duration) => {
  if (!duration || isNaN(duration)) return "00:00";
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default formatDuration;
