export const dva = {
  config: {
    onError(e) {
      e.preventDefault();
      console.error(e.message);
    },
  },
  plugins: process.env.NODE_ENV === `development` ? [require('dva-logger')()] : [],
};
