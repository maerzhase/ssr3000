export const fakeApi = (data) => (
  new Promise(resolve => {
    setTimeout(() => {
      resolve({ data });
    }, 500);
  })
);
