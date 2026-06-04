export default (start, end, percent) => Math.min(Math.max(0, (percent - start) / (end - start)), 1)
