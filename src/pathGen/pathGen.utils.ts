export const getPathWithArgs = (path: string, args: any[]) => {
  let finalPath = path;
  if (args.length > 0) {
    const finalOptions = args.flatMap((option) => {
      if (Array.isArray(option)) {
        return option;
      } else if (typeof option === 'object') {
        return Object.entries(option).map(([key, value]) => `${key}-${value}`);
      } else {
        return [option];
      }
    });

    finalPath = [finalPath, ...finalOptions].join(' ');
  }
  return finalPath;
};
