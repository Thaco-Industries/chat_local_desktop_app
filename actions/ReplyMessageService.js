const { default: axios } = require('axios');

const url = `${process.env.REACT_APP_API_URL}/message`;
const clientId = localStorage.getItem('x-client-id');
const userAuth = localStorage.getItem('userAuth');
const handleReplyMessage = async (opt) => {
  console.log(url, clientId, userAuth);

  // const resp = await axios.post(url, opt, {
  //   headers: {
  //     'x-client-id': clientId,
  //     'x-type-device': 'desktop',
  //     Authorization: `Bearer ${userAuth.token.accessToken}`,
  //   },
  // });
  // return resp.data.task;
};

module.exports = { handleReplyMessage };
