export default (start, end, percent) => Math.min(Math.max(0, Math.round((percent - start) / (end - start))), 1)
