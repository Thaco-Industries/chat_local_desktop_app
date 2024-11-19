import moment from 'moment';

export const getDateLabel = (created_at: string) => {
  const messageDate = moment(created_at, 'YYYY-MM-DD HH:mm');
  const today = moment();
  const yesterday = moment().subtract(1, 'days');

  if (messageDate.isSame(today, 'day')) return 'Hôm nay';
  if (messageDate.isSame(yesterday, 'day')) return 'Hôm qua';
  return messageDate.format('DD/MM/YYYY');
};
